import api from "./axios";

export const getSummary = () => api.get("/dashboard/summary");
export const getCategories = () => api.get("/dashboard/categories");
export const getTrends = () => api.get("/dashboard/trends");
export const getRecent = () => api.get("/dashboard/recent");