import axios from "axios";

const api = axios.create({
  baseURL: "https://swiftdrop-xh7v.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
