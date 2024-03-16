import * as z from "zod";

export type MemberForm = {
  name: string;
  relationship: string;
};

export type UpdateMemberForm = MemberForm & {
  id: string;
};

export const memberFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  relationship: z.string().trim().min(1, "Relationship is required"),
});

export const updateMemberFormSchema = memberFormSchema.extend({
  id: z.string().min(1),
});
