import axios from "axios";

const ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const API_BASE_URL = ORIGIN ? `${ORIGIN}/api` : "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

