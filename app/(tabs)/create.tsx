import { View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AntDesign from "@expo/vector-icons/AntDesign"

export default function Create() {
    return (
        <View className="flex-1 bg-primary">
            <SafeAreaView className="flex-1 justify-center items-center px-6">
                <AntDesign name="video-camera" size={64} color="rgba(255,255,255,0.3)" />
                <Text className="text-light/50 font-roboto-light text-xl mt-6 text-center">
                    Video generation coming soon
                </Text>
            </SafeAreaView>
        </View>
    )
}
