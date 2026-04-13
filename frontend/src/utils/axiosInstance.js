import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://travel-diary-1-km32.onrender.com/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;
