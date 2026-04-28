import axios from "axios";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for NextAuth session token
api.interceptors.request.use(
  async (config) => {
    const session = await getSession() as Session & { accessToken?: string };
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
