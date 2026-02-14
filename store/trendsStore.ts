import { create } from "zustand";
import { TrendsData } from "../types/Trends";

interface TrendsState {
    trends: TrendsData | null;
    isLoading: boolean;
    setTrends: (data: TrendsData) => void;
    setLoading: (loading: boolean) => void;
    clearTrends: () => void;
}

export const useTrendsStore = create<TrendsState>((set) => ({
    trends: null,
    isLoading: false,
    setTrends: (data) => set({ trends: data, isLoading: false }),
    setLoading: (loading) => set({ isLoading: loading }),
    clearTrends: () => set({ trends: null, isLoading: false }),
}));
