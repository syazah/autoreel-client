import { create } from "zustand";
import { PlanTopic } from "../types/plan";
import { VideoSchemaType } from "../types/Video"

type PlanVideos = PlanTopic & VideoSchemaType
interface PlanStore {
    plans?: {
        date: string,
        plan: PlanVideos
    }[],
    setPlan: (date: string, plan: PlanVideos) => void,
}

export const usePlanStore = create<PlanStore>((set) => ({
    plans: [],
    setPlan: (date, plan) => set((state) => {
        const existingIndex = state.plans?.findIndex(p => p.date === date) ?? -1
        if (existingIndex !== -1) {
            const updatedPlans = [...(state.plans || [])]
            updatedPlans[existingIndex] = { date, plan }
            return { plans: updatedPlans }
        } else {
            return { plans: [...(state.plans || []), { date, plan }] }
        }
    }),
}));
