import axios from "axios";

const API = axios.create({
 baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
});

API.interceptors.request.use((request) => {
  const token = localStorage.getItem("token");

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

export default API;