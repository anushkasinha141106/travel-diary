import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://travel-diary-backend-2wl1.onrender.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;