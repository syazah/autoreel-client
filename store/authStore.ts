import { create } from "zustand";
import { AuthState } from "../types/User";
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoggedIn: false,
    setUser: (user) => set({
        user: user,
        isLoggedIn: true,
    }),
    logout: () => set({
        user: null,
        isLoggedIn: false,
    })
}))