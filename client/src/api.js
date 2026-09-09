import axios from 'axios';

const apiHost = window.location.hostname || 'localhost';
const apiBaseUrl = import.meta.env.VITE_API_URL || `${window.location.protocol}//${apiHost}:5000/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
});

export default api;
