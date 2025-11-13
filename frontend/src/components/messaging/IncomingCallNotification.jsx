/**
 * Incoming Call Notification Component
 * Shows a notification when receiving a call (for future WebRTC integration)
 */

import { Phone, Video, X, User } from 'lucide-react';

const IncomingCallNotification = ({ 
  isVisible, 
  callerName, 
  callerRole,
  callType, // 'audio' or 'video'
  onAccept, 
  onDecline 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-bounce">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-primary-500 p-4 w-80">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {callType === 'video' ? (
              <Video className="h-5 w-5 text-primary-600" />
            ) : (
              <Phone className="h-5 w-5 text-primary-600" />
            )}
            <span className="text-sm font-semibold text-gray-700">
              Incoming {callType} call
            </span>
          </div>
          <button
            onClick={onDecline}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Caller Info */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{callerName}</h3>
            <p className="text-sm text-gray-500 capitalize">{callerRole}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={onDecline}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Decline</span>
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {callType === 'video' ? (
              <Video className="h-4 w-4" />
            ) : (
              <Phone className="h-4 w-4" />
            )}
            <span>Accept</span>
          </button>
        </div>

        {/* Ringing Animation */}
        <div className="mt-3 flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallNotification;
