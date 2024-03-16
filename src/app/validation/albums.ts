import * as z from "zod";

export const albumFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string(),
  date: z.date(),
  familyMembers: z.array(z.string()),
});

export type AlbumForm = z.infer<typeof albumFormSchema>;
