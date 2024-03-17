import * as z from "zod";

export const albumDetailsSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string(),
  date: z.date(),
});

export const selectMemoriesSchema = z.object({
  familyMembers: z
    .array(z.string())
    .min(1, "Select at least one family member"),
  memories: z.array(z.string()).min(1, "Select at least one memory"),
});

export const upsertAlbumSchema = z.object({
  details: albumDetailsSchema,
  selectedMemories: selectMemoriesSchema,
});

export type AlbumDetailsForm = z.infer<typeof albumDetailsSchema>;
export type UpsertAlbumForm = z.infer<typeof upsertAlbumSchema>;
export type SelectMemories = z.infer<typeof selectMemoriesSchema>;
