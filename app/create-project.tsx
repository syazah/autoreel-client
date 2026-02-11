import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { router } from "expo-router";
import ScrollWheelPicker from "../components/create-project/ScrollWheelPicker";
import { AllCategories, CategoryColors, ProjectSchema } from "../types/Project";
import type { Category } from "../types/Project";
import api from "../config/axios";
import AppButton from "../components/AppButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const FREQUENCIES = [1, 2, 3, 4, 5, 6, 7];
const CATEGORY_COLOR_ARRAY = AllCategories.map((c) => CategoryColors[c]);

export default function CreateProject() {
  const [frequency, setFrequency] = useState(3);
  const [category, setCategory] = useState<Category>(AllCategories[0]);
  const [projectName, setProjectName] = useState("");

  const translateX = useSharedValue(0);
  const categoryColorIndex = useSharedValue(1);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const step2BgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      categoryColorIndex.value,
      AllCategories.map((_, i) => i),
      CATEGORY_COLOR_ARRAY
    ),
  }));

  const handleNext = useCallback((index: number) => {
    translateX.value = withTiming(-SCREEN_WIDTH * index, { duration: 400 });
  }, [translateX]);

  const handleCategorySelect = useCallback((cat: Category) => {
    setCategory(cat);
    const idx = AllCategories.indexOf(cat);
    categoryColorIndex.value = withTiming(idx, { duration: 300 });
  }, [categoryColorIndex]);

  const handleCreate = useCallback(async () => {
    const projectData = {
      frequency,
      category,
      name: projectName.trim(),
    }
    const response = await api.post('/api/v1/project/create', projectData);
    if (!response.data.success) {
      return Alert.alert("Project Creation Failed", "Unable to create project. Please try again.")
    }
    ProjectSchema.parse(response.data.data.project);
    Alert.alert("Project Created", `Your project ${projectName.trim()} has been created successfully.`);
    router.back();
  }, [frequency, category, projectName]);

  return (
    <View className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[
          { flexDirection: "row", width: SCREEN_WIDTH * 3, flex: 1 },
          slideStyle,
        ]}
      >
        {/* Step 1 — Frequency */}
        <View style={{ width: SCREEN_WIDTH }} className="flex-1 bg-primary">
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
            <AppButton onPressHandler={() => handleNext(1)} width={320} buttonText="Next" />
          </SafeAreaView>
        </View>

        {/* Step 2 — Category */}
        <Animated.View
          style={[{ width: SCREEN_WIDTH, flex: 1 }, step2BgStyle]}
        >
          <SafeAreaView className="flex-1 justify-between items-center px-6 pb-8">
            <View className="flex-1 justify-center items-center w-full">
              <Text className="text-light/70 text-2xl font-roboto-light uppercase text-center mb-8">
                Category Of POSTS
              </Text>
              <ScrollWheelPicker
                items={AllCategories}
                renderLabel={(c) => c}
                onSelect={handleCategorySelect}
                defaultIndex={1}
                textSize={46}
                containerWidth="100%"
                padding={220}
              />
            </View>

            <AppButton onPressHandler={() => handleNext(2)} width={320} buttonText="Next" />
          </SafeAreaView>
        </Animated.View>

        {/* Step 3 — Name */}
        <View
          style={{ width: SCREEN_WIDTH }}
          className="flex-1 bg-primary"
        >
          <SafeAreaView className="flex-1 justify-between items-center px-6 pb-8">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1 justify-center items-center w-full"
            >
              <Text className="text-light/70 text-2xl font-roboto-light uppercase text-center mb-8">
                Name Of Your Project
              </Text>
              <TextInput
                value={projectName}
                onChangeText={setProjectName}
                placeholder="e.g. My Awesome Series"
                placeholderTextColor="rgba(255,255,255,0.4)"
                className="w-full text-white text-xl font-roboto-medium text-center py-4 border-b-2 border-white/30"
                selectionColor="white"
                autoFocus={false}
              />
            </KeyboardAvoidingView>
            <AppButton onPressHandler={handleCreate} width={320} buttonText="Create Project" />
          </SafeAreaView>
        </View>
      </Animated.View>
    </View>
  );
}
