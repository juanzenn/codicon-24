import * as z from "zod";

export type MemoryForm = {
  memory: File | null;
  description: string;
  date: Date;
  familyMembers: string[];
};

export const memoryFormSchema = z.object({
  file_url: z.string(),
  description: z.string(),
  date: z.date(),
  familyMembers: z.array(z.string()),
});

export type MemoryBody = z.infer<typeof memoryFormSchema>;
