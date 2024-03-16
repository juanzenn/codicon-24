import * as z from "zod";

export type MemberForm = {
  name: string;
  relationship: string;
};

export const memberFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  relationship: z.string().trim().min(1, "Relationship is required"),
});
