import { z } from "zod";

export const UserSchema = z.object({
    uid: z.string(),
    username: z.string(),
    profilePicture: z.string(),
    phoneNumber: z.string(),
    name: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export type AuthState = {
    user: User | null;
    isLoggedIn: boolean;
    setUser: (user: User) => void;
    logout: () => void;
};
