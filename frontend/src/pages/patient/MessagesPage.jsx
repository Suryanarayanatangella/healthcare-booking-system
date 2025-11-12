/**
 * Patient Messages Page
 * 
 * Allows patients to send and receive messages from their doctors
 */

import React, { useState } from 'react';
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
  Stethoscope
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const MessagesPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversations data
  const [conversations] = useState([
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      doctorId: 201,
      specialization: 'Cardiology',
      lastMessage: 'Please take the medication after meals.',
      timestamp: '2024-01-15T10:30:00',
      unread: 0,
      avatar: null
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      doctorId: 202,
      specialization: 'Pediatrics',
      lastMessage: 'Your test results look good.',
      timestamp: '2024-01-15T09:15:00',
      unread: 1,
      avatar: null
    },
    {
      id: 3,
      doctorName: 'Dr. Emily Rodriguez',
      doctorId: 203,
      specialization: 'Dermatology',
      lastMessage: 'See you at your next appointment.',
      timestamp: '2024-01-14T16:45:00',
      unread: 0,
      avatar: null
    }
  ]);

  // Mock messages for selected conversation
  const getMessages = (conversationId) => {
    const mockMessages = {
      1: [
        { id: 1, sender: 'patient', text: 'Hello Doctor, I have a question about my prescription.', timestamp: '2024-01-15T10:00:00' },
        { id: 2, sender: 'doctor', text: 'Hello! Of course, what would you like to know?', timestamp: '2024-01-15T10:05:00' },
        { id: 3, sender: 'patient', text: 'Should I take the medication before or after meals?', timestamp: '2024-01-15T10:10:00' },
        { id: 4, sender: 'doctor', text: 'Please take the medication after meals, twice a day.', timestamp: '2024-01-15T10:30:00' }
      ],
      2: [
        { id: 1, sender: 'patient', text: 'Good morning Doctor!', timestamp: '2024-01-15T09:00:00' },
        { id: 2, sender: 'doctor', text: 'Good morning! Your test results look good.', timestamp: '2024-01-15T09:15:00' }
      ],
      3: [
        { id: 1, sender: 'doctor', text: 'See you at your next appointment.', timestamp: '2024-01-14T16:45:00' }
      ]
    };
    return mockMessages[conversationId] || [];
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    
    toast.success('Message sent!');
    setMessageText('');
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
    conv.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-background-light flex">
      {/* Conversations List */}
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-heading font-bold text-text-primary mb-4">
            My Doctors
          </h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedConversation?.id === conversation.id ? 'bg-primary-50' : ''
              }`}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Stethoscope className="h-6 w-6 text-primary-600" />
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-text-primary truncate">
                    {conversation.doctorName}
                  </h3>
                  <span className="text-xs text-text-secondary">
                    {formatTime(conversation.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-primary-600 mb-1">{conversation.specialization}</p>
                <p className="text-sm text-text-secondary truncate">
                  {conversation.lastMessage}
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
          ))}
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
                  <Stethoscope className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-text-primary">
                    {selectedConversation.doctorName}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {selectedConversation.specialization}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {getMessages(selectedConversation.id).map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'patient'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-text-primary border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <Clock className="h-3 w-3 opacity-70" />
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
                    onKeyPress={(e) => {
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
                Select a doctor from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
