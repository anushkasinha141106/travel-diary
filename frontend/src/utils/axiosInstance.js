import axios from "axios";

export const BASE_URL = "https://travel-diary-04gc.onrender.com";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This allows cookies to be passed automatically
});

export default axiosInstance;
