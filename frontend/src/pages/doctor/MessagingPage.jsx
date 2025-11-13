/**
 * Messaging Page Component (Doctor View)
 * 
 * Allows doctors to send and receive messages from patients
 */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Send,
  Search,
  User,
  Clock,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Check,
  CheckCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as messageService from '../../services/messageService';
import CallModal from '../../components/messaging/CallModal';

const MessagingPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState(null); // 'audio' or 'video'

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await messageService.getConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await messageService.getConversationMessages(conversationId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    try {
      await messageService.sendMessage(selectedConversation.id, messageText);
      toast.success('Message sent!');
      setMessageText('');
      
      // Reload messages and conversations
      await loadMessages(selectedConversation.id);
      await loadConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleStartCall = (type) => {
    if (!selectedConversation) {
      toast.error('Please select a conversation first');
      return;
    }
    setCallType(type);
    setIsCallModalOpen(true);
    toast.success(`Starting ${type} call...`);
  };

  const handleCloseCall = () => {
    setIsCallModalOpen(false);
    setCallType(null);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.patientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background-light flex">
      {/* Conversations List */}
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-heading font-bold text-text-primary mb-4">
            Messages
          </h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-text-secondary">No conversations yet</p>
              <p className="text-sm text-text-secondary mt-1">
                Patients will appear here when they message you
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedConversation?.id === conversation.id ? 'bg-primary-50' : ''
              }`}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-primary-600" />
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-text-primary truncate">
                    {conversation.patientName}
                  </h3>
                  <span className="text-xs text-text-secondary">
                    {formatTime(conversation.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-text-secondary truncate">
                  {conversation.lastMessage || 'No messages yet'}
                </p>
              </div>
              
              {conversation.unread > 0 && (
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-white font-semibold">
                    {conversation.unread}
                  </span>
                </div>
              )}
            </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-text-primary">
                    {selectedConversation.patientName}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Patient ID: {selectedConversation.patientId}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleStartCall('audio')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Start audio call"
                >
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => handleStartCall('video')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Start video call"
                >
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-text-secondary">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderRole === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderRole === 'doctor'
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-text-primary border border-gray-200'
                      }`}
                    >
                      <p className="text-sm text-white">{message.text}</p>
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                        {/* Read indicators - only show for sent messages (doctor's messages) */}
                        {message.senderRole === 'doctor' && (
                          <span className="ml-1">
                            {message.read ? (
                              <CheckCheck className="h-3 w-3 text-blue-400" title="Read" />
                            ) : (
                              <Check className="h-3 w-3 opacity-70" title="Delivered" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                
                <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    rows="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No Conversation Selected
              </h3>
              <p className="text-text-secondary">
                Select a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Call Modal */}
      <CallModal
        isOpen={isCallModalOpen}
        onClose={handleCloseCall}
        callType={callType}
        recipientName={selectedConversation?.patientName}
        recipientRole="patient"
      />
    </div>
  );
};

export default MessagingPage;
