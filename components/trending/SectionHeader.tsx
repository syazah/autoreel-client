import { View, Text } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'

interface SectionHeaderProps {
    title: string;
    icon: keyof typeof AntDesign.glyphMap;
    count?: number;
    iconColor?: string;
}

const SectionHeader = ({ title, icon, count, iconColor }: SectionHeaderProps) => {
    return (
        <View className='flex-row items-center gap-2 mb-4 mt-6'>
            <AntDesign name={icon} size={16} color={iconColor || "rgba(250,243,225,0.5)"} />
            <Text className='font-roboto-light text-light/50 tracking-widest uppercase text-xs'>
                {title}
            </Text>
            {count !== undefined && (
                <View className='bg-[#008BFF]/20 px-2 py-0.5 rounded-full'>
                    <Text className='text-[#008BFF] text-[10px] font-roboto-medium'>{count}</Text>
                </View>
            )}
        </View>
    )
}

export default SectionHeader
