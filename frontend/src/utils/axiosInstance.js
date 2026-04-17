import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://travel-diary-backend-pxxy.onrender.com/api",
  timeout: 90000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;