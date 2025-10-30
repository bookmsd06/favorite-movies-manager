import { LOCAL_URL } from '@/constant';
import axios from 'axios';

const api = axios.create({
  baseURL: LOCAL_URL,
  withCredentials: false,
})

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api