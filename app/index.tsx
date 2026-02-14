import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingCards from "../components/onboarding/FloatingCards";
import { signInWithGoogle } from "../components/authentication/GoogleSignIn";
import axios from "axios";
import { ENV } from "../config/env";
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from "../store/authStore";
import { router } from "expo-router";
import { UserSchema } from "../types/User";
import AppButton from "../components/AppButton";
import LoadingScreen from "../components/LoadingScreen";
import { useLoading } from "../context/LoadingContext";
import api from "../config/axios";

export default function Index() {
  const { setUser, user } = useAuthStore();
  const { loadingState, setLoadingState } = useLoading()
  useEffect(() => {
    const checkExistingToken = async () => {
      setLoadingState({ isLoading: true });
      const token = await SecureStore.getItemAsync(ENV.ACCESS_TOKEN_KEY);
      if (token && !user) {
        try {
          const response = await api.get('/api/v1/auth/user');
          const { data } = response.data;
          const user = UserSchema.parse(data.user);
          setUser(user);
          if (user.isOnboarded) {
            router.replace("/(tabs)/home");
          } else {
            router.replace("/onboarding");
          }
        } catch {
          router.replace("/(tabs)/home");
        }
      }
      setLoadingState({ isLoading: false });
    };
    checkExistingToken();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoadingState({ isLoading: true });
      const idToken = await signInWithGoogle();
      const response = await axios.post(`${ENV.API_URL}/api/v1/auth/google`, {
        idToken,
      })
      const { data } = response.data;
      if (!data) {
        Alert.alert("Sign In Failed", "No response from server. Please try again.");
        return;
      }
      await SecureStore.setItemAsync(ENV.ACCESS_TOKEN_KEY, data.accessToken);
      await SecureStore.setItemAsync(ENV.REFRESH_TOKEN_KEY, data.refreshToken);
      const user = UserSchema.parse(data.user);
      setUser(user);
      setLoadingState({ isLoading: false });
      if (user.isOnboarded) {
        return router.replace("/(tabs)/home");
      } else {
        return router.replace("/onboarding");
      }
    } catch (err) {
      setLoadingState({ isLoading: false });
      Alert.alert("Sign in failed", err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };
  if (loadingState.isLoading) {
    return <LoadingScreen />
  }
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary">
      <View className="w-full h-[50%]">
        <FloatingCards />
      </View>
      <View className="w-full h-[50%] flex-1 justify-center items-center">
        <Text className="font-roboto-black text-light text-[48px]">
          Create Reels
        </Text>
        <Text className="font-roboto-black text-light text-[48px] -mt-6">
          Faster & Better
        </Text>

        <Text className="font-roboto-light text-light text-[16px] mt-6 text-center px-10">
          Turn prompts into posted reels, from idea to live post in minutes.
          We make sure you never miss a post.
        </Text>

        <AppButton onPressHandler={handleGoogleSignIn} width={320} buttonText="GOOGLE SIGN IN" />
      </View>
    </SafeAreaView >
  );
}
