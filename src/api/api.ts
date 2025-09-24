import axios from "axios";
import router from "@/router";

export const API_URL = import.meta.env.VITE_API_URL;
export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
            router.push("/login");
        }
        return Promise.reject(error);
    }
);
