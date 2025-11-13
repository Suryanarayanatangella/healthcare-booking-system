/**
 * Message Service
 * Handles all messaging-related API calls
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

// Get all conversations for the current user
export const getConversations = async () => {
  const response = await axios.get(`${API_URL}/messages/conversations`, {
    headers: {
      'Authorization': getAuthToken()
    }
  });
  return response.data;
};

// Get messages for a specific conversation
export const getConversationMessages = async (conversationId) => {
  const response = await axios.get(`${API_URL}/messages/conversation/${conversationId}`, {
    headers: {
      'Authorization': getAuthToken()
    }
  });
  return response.data;
};

// Send a message
export const sendMessage = async (conversationId, text, recipientId = null) => {
  const response = await axios.post(
    `${API_URL}/messages/send`,
    {
      conversationId,
      text,
      recipientId
    },
    {
      headers: {
        'Authorization': getAuthToken()
      }
    }
  );
  return response.data;
};

// Create a new conversation
export const createConversation = async (recipientId) => {
  const response = await axios.post(
    `${API_URL}/messages/conversation/create`,
    { recipientId },
    {
      headers: {
        'Authorization': getAuthToken()
      }
    }
  );
  return response.data;
};

export default {
  getConversations,
  getConversationMessages,
  sendMessage,
  createConversation
};
