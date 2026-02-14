import { useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import ScrollWheelPicker from "../components/ScrollWheelPicker";
import AppButton from "../components/AppButton";
import api from "../config/axios";
import { useLoading } from "../context/LoadingContext";
import LoadingScreen from "../components/LoadingScreen";
import * as Haptics from "expo-haptics";
import { VideoCategoriesSchema, VideoCategory } from "../types/Video";

const FREQUENCIES = [1, 2, 3, 4, 5, 6, 7];

const VIDEO_CATEGORIES = Array.from(VideoCategoriesSchema.options);

export default function Onboarding() {
  const [step, setStep] = useState<1 | 2>(1);
  const [frequency, setFrequency] = useState(3);
  const [selectedNiches, setSelectedNiches] = useState<VideoCategory[]>([]);
  const { loadingState, setLoadingState } = useLoading();
  const [preparingPlan, setPreparingPlan] = useState(false);
  const toggleNiche = (niche: VideoCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  };

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (selectedNiches.length < 3) {
      Alert.alert("Select Niches", "Please select at least 3 niches to continue.");
      return;
    }

    try {
      setLoadingState({ isLoading: true });
      const onboardResponse = await api.post("/api/v1/auth/onboard", { frequency, categories: selectedNiches });
      if (onboardResponse.status !== 200) {
        Alert.alert("Onboarding Failed", "Failed to save your preferences. Please try again.");
      }
      setLoadingState({ isLoading: false });
      setPreparingPlan(true)
      const planResponse = await api.post("/api/v1/plan");
      if (planResponse.status !== 200) {
        setPreparingPlan(false)
        Alert.alert("Plan Generation Failed", "Failed to generate your plan. Please try again later");
      }
      setPreparingPlan(false);
      router.replace("/(tabs)/home");
    } catch (error) {
      setLoadingState({ isLoading: false });
      Alert.alert("Onboarding Failed", error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  if (loadingState.isLoading) {
    return <LoadingScreen />;
  }
  if (preparingPlan) {
    return <SafeAreaView className="flex-1 bg-primary justify-center items-center">
      <View className="w-full h-full flex items-center justify-center">
        <Text className="text-light/70 text-xl font-roboto-light">Preparing Your Plan</Text>
      </View>
    </SafeAreaView>
  }

  if (step === 1) {
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

  return (
    <View className="flex-1 bg-primary">
      <SafeAreaView className="flex-1 justify-between items-center px-6 pb-8">
        <View className="flex-1 justify-center items-center w-full">
          <Text className="text-light/70 uppercase text-2xl font-roboto-light text-center">
            Pick Your Niches
          </Text>
          <Text className="text-light/30 text-sm font-roboto-light text-center mt-2 mb-10">
            Select at least 3 categories
          </Text>

          <View className="flex-row flex-wrap justify-center gap-3 px-2">
            {VIDEO_CATEGORIES.map((category) => {
              const isSelected = selectedNiches.includes(category);
              return (
                <TouchableOpacity
                  key={category}
                  activeOpacity={0.8}
                  onPress={() => toggleNiche(category)}
                  className={`px-5 py-3 rounded-2xl border ${isSelected
                    ? "bg-secondary/15 border-secondary"
                    : "bg-[#2a2a2a] border-transparent"
                    }`}
                >
                  <Text
                    className={`text-sm font-roboto-medium ${isSelected ? "text-secondary" : "text-light/60"
                      }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text className="text-light/20 text-xs font-roboto-light mt-8">
            {selectedNiches.length} / 3 selected
          </Text>
        </View>

        <AppButton
          onPressHandler={handleContinue}
          width={320}
          buttonText="Get Started"
        />
      </SafeAreaView>
    </View>
  );
}
