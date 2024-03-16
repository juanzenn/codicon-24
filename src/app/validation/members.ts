import * as z from "zod";

export type MemberForm = {
  name: string;
  relationship: string;
};

export const memberFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
});
