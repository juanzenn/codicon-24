import type { MemoryBody } from "@/app/validation/memories";
import { API_ROUTES, api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const endpoints = API_ROUTES.memories;

export function useCreateMemory() {
  return useMutation({
    mutationFn: async (body: MemoryBody) => {
      return api.post(endpoints.create, body);
    },
  });
}

export function useUpdateMemory() {
  return useMutation({
    mutationFn: async (body: MemoryBody & { id: string }) => {
      return api.put(endpoints.update(body.id), body);
    },
  });
}

export function useDeleteMemory() {
  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete(endpoints.delete(id));
    },
  });
}
