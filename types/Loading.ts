export interface LoadingApp {
    isLoading: boolean
}

export interface LoadingContextType {
    loadingState: LoadingApp;
    setLoadingState: React.Dispatch<React.SetStateAction<LoadingApp>>;
}