import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.137.206:3000', // Updated to match backend port
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor with logging cd Kalakritiapp-2
api.interceptors.request.use(
  async (config) => {
    // Log the full URL being requested
    console.log('Making request to:', config.baseURL + config.url);
    console.log('Request data:', config.data);

    const token = await AsyncStorage.getItem('userToken');
    console.log('Token:', token); // Log the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor with logging
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default api;