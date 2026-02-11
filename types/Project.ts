import { z } from "zod";

export const AllCategories = ["Entertainment", "Educational", "Storytelling", "Lifestyle"] as const;
export const CategorySchema = z.enum(AllCategories);
export type Category = z.infer<typeof CategorySchema>;

export const CategoryColors: Record<Category, string> = {
    Entertainment: "#FF2ED1",
    Educational: "#00B8FF",
    Storytelling: "#8A2BFF",
    Lifestyle: "#39FF14",
};

export const CategoryStickers: Record<Category, string> = {
    Entertainment: "stickers/entertainment.png",
    Educational: "stickers/educational.png",
    Storytelling: "stickers/storytelling.png",
    Lifestyle: "stickers/lifestyle.png",
}

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    frequency: z.number(),
    category: CategorySchema,
});
export type Project = z.infer<typeof ProjectSchema>;

export type ProjectState = {
    project: Project | null;
    setProject: (project: Project) => void;
};
