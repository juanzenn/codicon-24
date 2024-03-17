import { CreateAlbumForm } from "@/app/validation/albums";
import { API_ROUTES, api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const endpoints = API_ROUTES.albums;

export function useCreateAlbum() {
  return useMutation({
    mutationFn: async (form: CreateAlbumForm) => {
      return api.post(endpoints.create, form);
    },
  });
}

export function useUpdateAlbum() {
  return useMutation({
    mutationFn: async (form: CreateAlbumForm & { id: string }) => {
      return api.put(endpoints.update(form.id), form);
    },
  });
}

export function useDeleteAlbum() {
  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete(endpoints.delete(id));
    },
  });
}
