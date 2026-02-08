export type Category = "Children" | "Informative" | "Fiction";

export type Project = {
  id: string;
  name: string;
  frequency: number;
  category: Category;
  createdAt: number;
};
