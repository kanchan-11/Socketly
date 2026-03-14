import axios from "axios";

// In production, nginx proxies /api to backend. In dev, use localhost:8080
export const baseURL = import.meta.env.PROD ? "/api" : "http://localhost:8080";

export const httpClient = axios.create({
    baseURL: baseURL,
});