import api from "./axios";

export const getUsers = () => api.get("/users");
export const updateRole = (id, role) => api.patch(`/users/${id}/role`, { role });
export const updateStatus = (id, isActive) => api.patch(`/users/${id}/status`, { isActive });