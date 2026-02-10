import { z } from "zod";

export const CategorySchema = z.enum(["Children", "Informative", "Fiction"]);
export type Category = z.infer<typeof CategorySchema>;

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    frequency: z.number(),
    category: CategorySchema,
    createdAt: z.number(),
});
export type Project = z.infer<typeof ProjectSchema>;

export type ProjectState = {
    project: Project | null;
    setProject: (project: Project) => void;
};
