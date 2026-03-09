// src/utils/axiosInstance.ts
import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "https://my-site-1bjq.vercel.app/api",
// });

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;