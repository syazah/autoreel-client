import { createContext, useContext, useState } from "react";
import { LoadingApp, LoadingContextType } from "../types/Loading";

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [loadingState, setLoadingState] = useState<LoadingApp>({ isLoading: false });

    return (
        <LoadingContext.Provider value={{ loadingState, setLoadingState }}>
            {children}
        </LoadingContext.Provider>
    );
};
export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) throw new Error("useLoading must be used inside LoadingContextProvider");
    return context;
};