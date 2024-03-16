import { AlbumForm } from "@/app/validation/albums";
import { API_ROUTES, api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const endpoints = API_ROUTES.albums;

export function useCreateAlbum() {
  return useMutation({
    mutationFn: async (form: AlbumForm) => {
      return api.post(endpoints.create, form);
    },
  });
}
