import axios, { AxiosError } from "axios";
import router from "@/router";
import { ref } from "vue";

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
    (error: AxiosError) => {
        if (error.status === 401) {
            localStorage.removeItem("authToken");
            router.push("/login");
            return;
        }
        throw error;
    },
);

export const logout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
};

export const username = ref("");
