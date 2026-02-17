import { View, Text, Pressable, DimensionValue, TouchableOpacity } from 'react-native'
import React from 'react'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

const SPRING_CONFIG = { damping: 14, stiffness: 200 }

const AppButton = ({ buttonText, onPressHandler, width = '80%' as DimensionValue, height = 60, icon }: {
    onPressHandler: () => void,
    buttonText?: string,
    width?: DimensionValue,
    height?: number,
    icon?: React.ReactNode,
}) => {
    return (
        <View className="w-full justify-center items-center relative">
            <View
                className="absolute rounded-xl bg-secondary mt-10"
            />
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPressHandler}
                style={{ width, height }}
                className="bg-secondary rounded-full flex justify-center items-center mt-10 z-10 flex-row gap-2"
            >
                {icon}
                {buttonText && <Text className="text-light text-center font-roboto-bold text-2xl">{buttonText}</Text>}
            </TouchableOpacity>
        </View>
    )
}
export default AppButton
