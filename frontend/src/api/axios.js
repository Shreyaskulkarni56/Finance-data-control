// src/api/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
});

api.interceptors.response.use(
    res => res,
    err => {
        const status = err.response?.status;
        if (status === 401) {
            // Token expired or invalid — clear session and redirect
            sessionStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }
);

export default api;