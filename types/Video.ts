import { z } from "zod";

export const VideoCategoriesSchema = z.enum(["Music", "Gaming", "Entertainment", "News", "Science", "Sports", "Education", "Comedy", "People"]);
export type VideoCategory = z.infer<typeof VideoCategoriesSchema>;

export const VideoSchema = z.object({
    script: z.string().nullable(),
})

export type VideoSchemaType = z.infer<typeof VideoSchema>;