import { View, Text, Pressable, DimensionValue } from 'react-native'
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
    const scale = useSharedValue(1)
    const shadowOffsetY = useSharedValue(4)

    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }))

    const animatedShadowStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: shadowOffsetY.value }],
    }))

    const onPressIn = () => {
        scale.value = withSpring(0.80, SPRING_CONFIG)
        shadowOffsetY.value = withSpring(2, SPRING_CONFIG)
    }

    const onPressOut = () => {
        scale.value = withSpring(1, SPRING_CONFIG)
        shadowOffsetY.value = withSpring(4, SPRING_CONFIG)
    }

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onPressHandler()
    }

    // Compute shadow dimensions based on width type
    const shadowWidth = typeof width === 'number' ? width + 4 : width

    return (
        <Animated.View style={animatedButtonStyle} className="w-full justify-center items-center relative">
            <Animated.View
                style={[
                    { width: shadowWidth, height: height + 16 },
                    animatedShadowStyle,
                ]}
                className="absolute rounded-xl bg-secondary mt-10"
            />
            <Pressable
                onPress={handlePress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={{ width, height }}
                className="bg-primary rounded-xl flex justify-center items-center mt-10 z-10 flex-row gap-2"
            >
                {icon}
                {buttonText && <Text className="text-light text-center font-roboto-bold text-2xl">{buttonText}</Text>}
            </Pressable>
        </Animated.View>
    )
}
export default AppButton
