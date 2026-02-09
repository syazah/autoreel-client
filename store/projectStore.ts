import { create } from "zustand";
import { Project, ProjectState } from "../types/Project";

export const useProjectStore = create<ProjectState>((set) => ({
    project: null,
    setProject: (project: Project) => set({
        project: project,
    }),
}))