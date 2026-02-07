import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingCards from "../components/onboarding/FloatingCards";
import { signInWithGoogle } from "../components/authentication/GoogleSignIn";

export default function Index() {
  const handleGoogleSignIn = async () => {
    try {
      const idToken = await signInWithGoogle();
      console.log("Signed in, idToken:", idToken);
    } catch {
      Alert.alert("Sign in failed", "Please try again.");
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
