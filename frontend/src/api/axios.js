import axios from "axios";

// Backend URL'i environment'a göre belirle
const API_URL = import.meta.env.VITE_API_URL || "${import.meta.env.VITE_API_URL || 'http://localhost:3000'}";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Her istekte token'ı otomatik ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;