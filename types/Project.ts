export type Category = "Children" | "Informative" | "Fiction";

export type Project = {
  id: string;
  frequency: number;
  category: Category;
  createdAt: number;
};
