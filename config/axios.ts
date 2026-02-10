import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ENV } from "./env";
import { router } from "expo-router";

const api = axios.create({
    baseURL: ENV.API_URL,
});

api.interceptors.request.use(async (config) => {
    const accessToken = await SecureStore.getItemAsync(ENV.ACCESS_TOKEN_KEY);
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = await SecureStore.getItemAsync(ENV.REFRESH_TOKEN_KEY);
            if (!refreshToken) {
                await clearTokensAndRedirect();
                return Promise.reject(error);
            }
            try {
                const response = await axios.post(`${ENV.API_URL}/api/v1/auth/refresh`, { refreshToken });
                const { data } = response.data;
                await SecureStore.setItemAsync(ENV.ACCESS_TOKEN_KEY, data.accessToken);
                await SecureStore.setItemAsync(ENV.REFRESH_TOKEN_KEY, data.refreshToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch {
                await clearTokensAndRedirect();
                return Promise.reject(error);
            }
        }
        await clearTokensAndRedirect();
        return Promise.reject(error);
    }
);

async function clearTokensAndRedirect() {
    await SecureStore.deleteItemAsync(ENV.ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(ENV.REFRESH_TOKEN_KEY);
    router.replace("/");
}

export default api;
