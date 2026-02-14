import { useState } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import ScrollWheelPicker from "../components/ScrollWheelPicker";
import AppButton from "../components/AppButton";
import api from "../config/axios";
import { useLoading } from "../context/LoadingContext";
import LoadingScreen from "../components/LoadingScreen";

const FREQUENCIES = [1, 2, 3, 4, 5, 6, 7];

export default function Onboarding() {
  const [frequency, setFrequency] = useState(3);
  const { loadingState, setLoadingState } = useLoading();

  const handleContinue = async () => {
    try {
      setLoadingState({ isLoading: true });
      await api.post("/api/v1/auth/onboard", { frequency });
      setLoadingState({ isLoading: false });
      router.replace("/(tabs)/home");
    } catch (error) {
      setLoadingState({ isLoading: false });
      Alert.alert("Onboarding Failed", error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  if (loadingState.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1 bg-primary">
      <SafeAreaView className="flex-1 justify-between items-center px-6 pb-8">
        <View className="flex-1 justify-center items-center w-full">
          <Text className="text-light/70 uppercase text-2xl font-roboto-light text-center">
            Videos Per Week
          </Text>
          <ScrollWheelPicker
            items={FREQUENCIES}
            renderLabel={(n) => String(n)}
            onSelect={setFrequency}
            defaultIndex={2}
          />
        </View>
        <AppButton onPressHandler={handleContinue} width={320} buttonText="Continue" />
      </SafeAreaView>
    </View>
  );
}
