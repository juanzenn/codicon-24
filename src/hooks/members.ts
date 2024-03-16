import { MemberForm } from "@/app/validation/members";
import { API_ROUTES, api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const endpoints = API_ROUTES.members;

export function useCreateMember() {
  return useMutation({
    mutationFn: async (form: MemberForm) => {
      return api.post(endpoints.create, form);
    },
  });
}

export function useUpdateMember() {
  return useMutation({
    mutationFn: async (form: MemberForm & { id: string }) => {
      return api.put(endpoints.update(form.id), form);
    },
  });
}

export function useDeleteMember() {
  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete(endpoints.delete(id));
    },
  });
}
