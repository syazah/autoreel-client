import { TouchableOpacity, Text, View, Image, Linking } from 'react-native'
import React from 'react'
import { CategorizedVideo } from '../../types/Trends'
import AntDesign from '@expo/vector-icons/AntDesign'

const formatViews = (views: number): string => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`
    return views.toString()
}

const TrendingCards = ({ video }: { video: CategorizedVideo }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            className='w-[200px] mr-3 rounded-2xl overflow-hidden bg-[#2a2a2a]'
        >
            <View className='w-full h-[112px] relative'>
                <Image
                    className='w-full h-full'
                    source={{ uri: video.thumbnail }}
                    resizeMode='cover'
                />
                <View className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/70' />
            </View>

            <View className='p-2.5 gap-1.5'>
                <Text
                    className='text-light text-xs font-roboto-medium leading-4'
                    numberOfLines={2}
                >
                    {video.title}
                </Text>

                <Text
                    className='text-light/40 text-[10px] font-roboto-light'
                    numberOfLines={1}
                >
                    {video.channel}
                </Text>

                <View className='flex-row items-center gap-2 mt-0.5'>
                    <View className='flex-row items-center gap-1'>
                        <AntDesign name="eye" size={10} color="rgba(250,243,225,0.4)" />
                        <Text className='text-light/40 text-[10px] font-roboto-light'>
                            {formatViews(video.metrics.views)}
                        </Text>
                    </View>
                    <View className='flex-row items-center gap-1'>
                        <AntDesign name="like" size={10} color="rgba(250,243,225,0.4)" />
                        <Text className='text-light/40 text-[10px] font-roboto-light'>
                            {formatViews(video.metrics.likes)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default TrendingCards
