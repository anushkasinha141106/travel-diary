import axios from "axios";

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.startsWith("http")) {
    return envUrl;
  }
  // Fallback to production backend
  return "https://travel-diary-04gc.onrender.com";
};

const axiosInstance = axios.create({
  baseURL: `${getBaseURL()}/api`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;

