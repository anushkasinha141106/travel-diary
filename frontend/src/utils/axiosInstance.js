import axios from "axios";
import BASE_URL from "../config";

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This allows cookies to be passed automatically
});

export default axiosInstance;
