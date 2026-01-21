import axios from 'axios';
import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Chat API
export const chatAPI = {
    sendMessage: async (message: string, conversationId?: string) => {
        const response = await api.post('/api/chat', { message, conversation_id: conversationId });
        return response.data;
    },
    getConversations: async () => {
        const response = await api.get('/api/chat/conversations');
        return response.data;
    },
};

// Email API
export const emailAPI = {
    getEmails: async (limit = 20) => {
        const response = await api.get(`/api/emails?limit=${limit}`);
        return response.data;
    },
    getUrgentEmails: async () => {
        const response = await api.get('/api/emails/urgent');
        return response.data;
    },
};

// Task API
export const taskAPI = {
    getTasks: async (limit = 20) => {
        const response = await api.get(`/api/tasks?limit=${limit}`);
        return response.data;
    },
    getOverdueTasks: async () => {
        const response = await api.get('/api/tasks/overdue');
        return response.data;
    },
};

export default api;
