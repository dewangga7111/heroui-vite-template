import { showErrorToast } from "@/utils/common";
import { getAccessToken, clearAuthSession } from "@/utils/auth";
import { navigateTo } from "@/utils/navigate";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession();
      navigateTo("/auth/login");
      return Promise.reject(error);
    }
    const message = `API error: ${error.response?.data?.response_message || error.message}`;
    console.error(message);
    showErrorToast(message);
    return Promise.reject(error);
  }
);
