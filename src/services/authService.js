// src/services/authServices.js
import API from './api';

const authServices = {
  // Login Call
  login: async function(credentials) {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  // Registration Call
  register: async function(userData) {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  // Logout (Optional: Agar backend par session khatam karna ho)
  logout: async function() {
    const response = await API.post('/auth/logout');
    return response.data;
  }
};

export default authServices;