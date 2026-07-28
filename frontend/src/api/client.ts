import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export function getApiErrorMessage(error: unknown, fallbackMessage?: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallbackMessage || 'An API error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage || 'An unexpected error occurred';
}

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto Token Refresh on 401 & Toast Error Formatting
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await axios.post<{ data: { accessToken: string } }>(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );
          const newAccessToken = res.data.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        toast.error('Session expired. Please log in again.');
      }
    }

    const message = getApiErrorMessage(error);
    toast.error(message);
    return Promise.reject(error);
  }
);
