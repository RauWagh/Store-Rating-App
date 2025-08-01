import axios from 'axios';

// Base URL for API - replace with your actual backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock authentication service for development
// Replace with actual API calls when backend is ready
export const authService = {
  login: async (credentials, role) => {
    // Mock login - replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { username, password } = credentials;
        
        // Mock validation
        if (username && password) {
          const mockUser = {
            id: Math.random().toString(36).substr(2, 9),
            username,
            role,
            email: `${username}@${role}.example.com`,
            fullName: `${username.charAt(0).toUpperCase() + username.slice(1)} ${role.charAt(0).toUpperCase() + role.slice(1)}`,
          };
          
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          resolve({
            token: mockToken,
            user: mockUser,
          });
        } else {
          reject({
            response: {
              data: {
                message: 'Invalid username or password',
              },
            },
          });
        }
      }, 1000); // Simulate network delay
    });
  },
  
  // Actual API call structure (uncomment when backend is ready)
  /*
  login: async (credentials, role) => {
    try {
      const response = await api.post('/auth/login', {
        ...credentials,
        role,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  */
};

export default api;