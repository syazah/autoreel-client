import { Stack } from "expo-router";
import {
  useFonts,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_100Thin,
  Roboto_200ExtraLight,
  Roboto_600SemiBold,
  Roboto_900Black,
  Roboto_800ExtraBold,
} from "@expo-google-fonts/roboto";
import {
  NotoSerif_300Light,
  NotoSerif_400Regular,
  NotoSerif_500Medium,
  NotoSerif_700Bold,
  NotoSerif_100Thin,
  NotoSerif_200ExtraLight,
  NotoSerif_600SemiBold,
  NotoSerif_900Black,
  NotoSerif_800ExtraBold,
} from "@expo-google-fonts/noto-serif";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../global.css";
import { LoadingContextProvider } from "../context/LoadingContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_200ExtraLight,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    Roboto_800ExtraBold,
    Roboto_900Black,
    NotoSerif_100Thin,
    NotoSerif_200ExtraLight,
    NotoSerif_300Light,
    NotoSerif_400Regular,
    NotoSerif_500Medium,
    NotoSerif_600SemiBold,
    NotoSerif_700Bold,
    NotoSerif_800ExtraBold,
    NotoSerif_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LoadingContextProvider>
      <Stack screenOptions={{ headerShown: false }}>
      </Stack>
    </LoadingContextProvider>
  );
}
