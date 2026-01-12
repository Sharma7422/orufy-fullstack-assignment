import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  // Remove withCredentials since we use Bearer tokens, not cookies
});

console.log("API Base URL:", API.defaults.baseURL)

// Attach token if stored
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor for debugging
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message,
      url: error.config?.url,
      method: error.config?.method,
    });
    return Promise.reject(error);
  }
);

export const sendOtp = (payload) => {
  return API.post("/auth/send-otp", payload);
};

export const verifyOtp = (payload) => {
  return API.post("/auth/verify-otp", payload);
};

export const resendOtp = (payload) => {
  return API.post("/auth/resend-otp", payload);
};

export const getUserDetails = () => {
  return API.get("/auth/user-details");
};

export const updateProductStatus = (productId) => {
  return API.put(`/products/status/${productId}`);
};

export const getProducts = (status = "") => {
  const query = status ? `?status=${status}` : "";
  return API.get(`/products/list${query}`);
};

export const getProductById = (productId) => {
  return API.get(`/products/view/${productId}`);
};

export const updateProduct = (productId, formData) => {
  return API.put(`/products/edit/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = (productId) => {
  return API.delete(`/products/delete/${productId}`);
};

export default API;
