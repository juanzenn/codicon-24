import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
});

export const api = {
  get: <ReturnType>(url: string) => axiosInstance.get<ReturnType>(url),
  post: <ReturnType>(url: string, data: unknown = {}) =>
    axiosInstance.post<ReturnType>(url, data),
  put: <ReturnType>(url: string, data: unknown = {}) =>
    axiosInstance.put<ReturnType>(url, data),
  delete: <ReturnType>(url: string) => axiosInstance.delete<ReturnType>(url),
};

export const API_ROUTES = {
  members: {
    create: "/member",
    update: (id: string) => `/member/${id}`,
    delete: (id: string) => `/member/${id}`,
  },
  memories: {
    create: "/memories",
    update: (id: string) => `/memories/${id}`,
    delete: (id: string) => `/memories/${id}`,
  },
};
