/**
 * Call Modal Component
 * Handles audio and video calls in messaging
 */

import { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Video,
  PhoneOff,
  Mic,
  MicOff,
  VideoOff as VideoOffIcon,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  User
} from 'lucide-react';

const CallModal = ({ 
  isOpen, 
  onClose, 
  callType, // 'audio' or 'video'
  recipientName,
  recipientRole // 'doctor' or 'patient'
}) => {
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, ringing, active, ended
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Simulate call connection
    const connectTimer = setTimeout(() => {
      setCallStatus('ringing');
    }, 1000);

    const answerTimer = setTimeout(() => {
      setCallStatus('active');
      startTimer();
    }, 3000);

    return () => {
      clearTimeout(connectTimer);
      clearTimeout(answerTimer);
      stopTimer();
    };
  }, [isOpen]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    stopTimer();
    setTimeout(() => {
      onClose();
      // Reset state
      setDuration(0);
      setCallStatus('connecting');
      setIsMuted(false);
      setIsVideoOff(false);
      setIsSpeakerOff(false);
    }, 1500);
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleSpeaker = () => setIsSpeakerOff(!isSpeakerOff);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className={`bg-gray-900 rounded-lg shadow-2xl overflow-hidden transition-all ${
        isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl h-[600px]'
      }`}>
        {/* Video Area */}
        <div className="relative h-full flex flex-col">
          {/* Main Video */}
          <div className="flex-1 bg-gray-800 relative flex items-center justify-center">
            {callType === 'video' && !isVideoOff ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative">
                {/* Simulated video background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 opacity-50"></div>
                
                {/* Video placeholder with camera icon */}
                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                    <Video className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-white text-2xl font-semibold mb-2">
                    {recipientName}
                  </h3>
                  <p className="text-gray-300 capitalize mb-2">{recipientRole}</p>
                  {callStatus === 'active' && (
                    <div className="mt-4 px-4 py-2 bg-black bg-opacity-30 rounded-lg inline-block">
                      <p className="text-white text-sm">📹 Video Call Active</p>
                    </div>
                  )}
                </div>
                
                {/* Animated video effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-pulse"></div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {callType === 'video' && isVideoOff ? (
                    <VideoOffIcon className="h-16 w-16 text-white" />
                  ) : (
                    <User className="h-16 w-16 text-white" />
                  )}
                </div>
                <h3 className="text-white text-2xl font-semibold mb-2">
                  {recipientName}
                </h3>
                <p className="text-gray-400 capitalize">{recipientRole}</p>
                {callType === 'video' && isVideoOff && (
                  <p className="text-gray-500 text-sm mt-2">Camera is off</p>
                )}
              </div>
            )}

            {/* Self Video (Picture-in-Picture) */}
            {callType === 'video' && (
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-primary-500 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center relative">
                  {isVideoOff ? (
                    <div className="text-center">
                      <VideoOffIcon className="h-8 w-8 text-white mb-2 mx-auto" />
                      <p className="text-white text-xs">Camera Off</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-white text-xs font-semibold">You</p>
                      <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Call Status */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 px-6 py-3 rounded-full backdrop-blur-sm">
              {callStatus === 'connecting' && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <p className="text-white text-sm">Connecting...</p>
                </div>
              )}
              {callStatus === 'ringing' && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                  <p className="text-white text-sm">Ringing...</p>
                </div>
              )}
              {callStatus === 'active' && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-white text-lg font-semibold">{formatDuration(duration)}</p>
                </div>
              )}
              {callStatus === 'ended' && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-white text-sm">Call Ended</p>
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5 text-white" />
              ) : (
                <Maximize2 className="h-5 w-5 text-white" />
              )}
            </button>
          </div>

          {/* Controls */}
          <div className="bg-gray-900 p-6">
            <div className="flex items-center justify-center space-x-4">
              {/* Mute/Unmute */}
              <button
                onClick={toggleMute}
                disabled={callStatus !== 'active'}
                className={`p-4 rounded-full transition-all ${
                  isMuted 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isMuted ? (
                  <MicOff className="h-6 w-6 text-white" />
                ) : (
                  <Mic className="h-6 w-6 text-white" />
                )}
              </button>

              {/* Video Toggle (only for video calls) */}
              {callType === 'video' && (
                <button
                  onClick={toggleVideo}
                  disabled={callStatus !== 'active'}
                  className={`p-4 rounded-full transition-all ${
                    isVideoOff 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isVideoOff ? (
                    <VideoOffIcon className="h-6 w-6 text-white" />
                  ) : (
                    <Video className="h-6 w-6 text-white" />
                  )}
                </button>
              )}

              {/* End Call */}
              <button
                onClick={handleEndCall}
                disabled={callStatus === 'ended'}
                className="p-5 bg-red-600 hover:bg-red-700 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PhoneOff className="h-7 w-7 text-white" />
              </button>

              {/* Speaker Toggle */}
              <button
                onClick={toggleSpeaker}
                disabled={callStatus !== 'active'}
                className={`p-4 rounded-full transition-all ${
                  isSpeakerOff 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSpeakerOff ? (
                  <VolumeX className="h-6 w-6 text-white" />
                ) : (
                  <Volume2 className="h-6 w-6 text-white" />
                )}
              </button>
            </div>

            {/* Control Labels */}
            <div className="flex items-center justify-center space-x-4 mt-3">
              <span className="text-xs text-gray-400 w-16 text-center">
                {isMuted ? 'Unmute' : 'Mute'}
              </span>
              {callType === 'video' && (
                <span className="text-xs text-gray-400 w-16 text-center">
                  {isVideoOff ? 'Video On' : 'Video Off'}
                </span>
              )}
              <span className="text-xs text-gray-400 w-20 text-center">
                End Call
              </span>
              <span className="text-xs text-gray-400 w-16 text-center">
                {isSpeakerOff ? 'Speaker' : 'Mute'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
