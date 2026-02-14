import { View, Text, Image } from 'react-native'
import React from 'react'
import { CategorizedVideo } from '../../types/Trends'
import AntDesign from '@expo/vector-icons/AntDesign'

const formatViews = (views: number): string => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`
    return views.toString()
}

const VideoCard = ({ video }: { video: CategorizedVideo }) => {
    return (
        <View className='w-[220px] mr-3 rounded-2xl overflow-hidden bg-[#2a2a2a]'>
            <Image
                className='w-full h-[124px]'
                source={{ uri: video.thumbnail }}
                resizeMode='cover'
            />
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
                <View className='flex-row items-center gap-3 mt-0.5'>
                    <View className='flex-row items-center gap-1'>
                        <AntDesign name="eye" size={10} color="rgba(250,243,225,0.4)" />
                        <Text className='text-light/40 text-[10px] font-roboto-light'>
                            {formatViews(video.metrics.views)}
                        </Text>
                    </View>
                    <View className='flex-row items-center gap-1'>
                        <AntDesign name="like2" size={10} color="rgba(250,243,225,0.4)" />
                        <Text className='text-light/40 text-[10px] font-roboto-light'>
                            {formatViews(video.metrics.likes)}
                        </Text>
                    </View>
                    <View className='bg-emerald-500/20 px-1.5 py-0.5 rounded'>
                        <Text className='text-emerald-400 text-[9px] font-roboto-medium'>
                            {(video.metrics.engagementRate * 100).toFixed(1)}%
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default VideoCard
