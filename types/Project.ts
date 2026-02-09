export type Category = "Children" | "Informative" | "Fiction";

export type Project = {
  id: string;
  name: string;
  frequency: number;
  category: Category;
  createdAt: number;
};

export type ProjectState = {
  project: Project | null;
  setProject: (project: Project) => void;
}