import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // This is CRUCIAL for sending cookies (like your auth token)
});

export default apiClient;