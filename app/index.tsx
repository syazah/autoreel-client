import { useEffect } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingCards from "../components/onboarding/FloatingCards";
import { signInWithGoogle } from "../components/authentication/GoogleSignIn";
import axios from "axios";
import { ENV } from "../config/env";
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from "../store/authStore";
import { router } from "expo-router";
import { UserSchema } from "../types/User";

export default function Index() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const checkExistingToken = async () => {
      const token = await SecureStore.getItemAsync(ENV.ACCESS_TOKEN_KEY);
      if (token) {
        router.replace("/home");
      }
    };
    checkExistingToken();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
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
      return router.replace("/home")
    } catch (err) {
      Alert.alert("Sign in failed", err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

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

        <TouchableOpacity onPress={handleGoogleSignIn} activeOpacity={0.8} className="bg-secondary w-[90%] rounded-full p-4 mt-10">
          <Text className="text-light text-center font-roboto text-xl">LESS GO</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
