import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://travel-project-backend-iwoe.onrender.com',
});

// ✅ Add a request interceptor to include the token in headers
instance.interceptors.request.use(
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

// ✅ Only one default export here
export default instance;
