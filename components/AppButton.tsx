import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const AppButton = ({ buttonText, onPressHandler, width = 80, height = 60, icon }: {
    onPressHandler: () => void,
    buttonText?: string,
    width?: number,
    height?: number,
    icon?: React.ReactNode,
}) => {
    return (
        <View className="w-full justify-center items-center relative">
            <View
                style={{ width: width + 4, height: height + 16 }}
                className={`absolute -bottom-4 rounded-xl bg-secondary mt-10 transition-all duration-500`}>
            </View>
            <TouchableOpacity
                onPress={onPressHandler}
                activeOpacity={1}
                style={{ width: width, height }}
                className="bg-primary rounded-xl flex justify-center items-center mt-10 z-10 flex-row gap-2">
                {icon}
                {buttonText && <Text className="text-light text-center font-roboto-bold text-2xl">{buttonText}</Text>}
            </TouchableOpacity>
        </View >
    )
}
export default AppButton