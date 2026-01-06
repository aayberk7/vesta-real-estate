//“Auth ile ilgili backend isteklerini nereden ve nasıl atıyoruz?”

import api from "./axios";

export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const updateProfile = (data) => api.put("/users/me", data);