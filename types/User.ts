export type User = {
    uid: string;
    username: string;
    profilePicture: string;
    phoneNumber: string;
};

export type AuthState = {
    user: User | null;
    isLoggedIn: boolean;
    setUser: (user: User) => void;
    logout: () => void;
};