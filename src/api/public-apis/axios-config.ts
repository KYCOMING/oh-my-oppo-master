import axios, { AxiosInstance } from 'axios';

// Basic Axios configuration for public API calls
const apiClient: AxiosInstance = axios.create({
  baseURL: '', // to be replaced by real base URL in environment
  timeout: 8000,
});

export default apiClient;
