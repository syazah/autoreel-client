import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import { Category } from "../types/Project";
import api from "../config/axios";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const FREQUENCIES = [1, 2, 3, 4, 5, 6, 7];
const CATEGORIES: Category[] = ["Children", "Informative", "Fiction"];
const CATEGORY_COLORS = ["#FFB6C1", "#B0D4F1", "#C4B5FD"];

export default function CreateProject() {
  const [frequency, setFrequency] = useState(3);
  const [category, setCategory] = useState<Category>("Informative");
  const [projectName, setProjectName] = useState("");

  const translateX = useSharedValue(0);
  const categoryColorIndex = useSharedValue(1);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const step2BgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      categoryColorIndex.value,
      [0, 1, 2],
      CATEGORY_COLORS
    ),
  }));

  const handleNext = useCallback((index: number) => {
    translateX.value = withTiming(-SCREEN_WIDTH * index, { duration: 400 });
  }, [translateX]);

  const handleCategorySelect = useCallback((cat: Category) => {
    setCategory(cat);
    const idx = CATEGORIES.indexOf(cat);
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
              <Text className="text-white text-3xl font-roboto-bold text-center mb-8">
                How many videos{"\n"}per week?
              </Text>
              <ScrollWheelPicker
                items={FREQUENCIES}
                renderLabel={(n) => String(n)}
                onSelect={setFrequency}
                defaultIndex={2}
              />
            </View>
            <TouchableOpacity
              onPress={() => handleNext(1)}
              className="bg-secondary w-full py-4 rounded-full items-center"
            >
              <Text className="text-white text-lg font-roboto-semibold">
                Next
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Step 2 — Category */}
        <Animated.View
          style={[{ width: SCREEN_WIDTH, flex: 1 }, step2BgStyle]}
        >
          <SafeAreaView className="flex-1 justify-between items-center px-6 pb-8">
            <View className="flex-1 justify-center items-center w-full">
              <Text className="text-white text-3xl font-roboto-bold text-center mb-8">
                What category?
              </Text>
              <ScrollWheelPicker
                items={CATEGORIES}
                renderLabel={(c) => c}
                onSelect={handleCategorySelect}
                defaultIndex={1}
                textSize={60}
                containerWidth="100%"
                padding={220}
              />
            </View>
            <TouchableOpacity
              onPress={() => handleNext(2)}
              className="bg-secondary w-full py-4 rounded-full items-center"
            >
              <Text className="text-white text-lg font-roboto-semibold">
                Next
              </Text>
            </TouchableOpacity>
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
              <Text className="text-white text-3xl font-roboto-bold text-center mb-8">
                Name your project
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
            <TouchableOpacity
              onPress={handleCreate}
              disabled={projectName.trim().length === 0}
              className={`w-full py-4 rounded-full items-center ${projectName.trim().length > 0 ? "bg-secondary" : "bg-secondary/40"}`}
            >
              <Text className="text-white text-lg font-roboto-semibold">
                Create
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Animated.View>
    </View>
  );
}
