//“Frontend backend’e nasıl istek atıyor ve login olan kullanıcı nasıl tanınıyor?”
//Axios, frontend’den backend’e HTTP istekleri (GET, POST, PUT, DELETE) 
//atmak için kullanılan bir kütüphanedir.
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
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
