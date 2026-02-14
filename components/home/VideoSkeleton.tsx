import { View } from 'react-native'
import React from 'react'
import Skeleton from 'react-native-reanimated-skeleton'
const CARD_COUNT = 2

const SkeletonCard = () => (
    <View className='w-[200px] h-[300px] mr-3 rounded-2xl overflow-hidden' style={{ backgroundColor: '#2a2a2a' }}>
        <Skeleton
            isLoading={true}
            boneColor='#333333'
            highlightColor='#444444'
            containerStyle={{ flex: 1 }}
        >
            <View style={{ width: 200, height: 300, backgroundColor: '#333333' }} />
        </Skeleton>
    </View>
)

const VideoSkeleton = () => {
    return (
        <View className='w-full mt-4 flex-row'>
            {Array.from({ length: CARD_COUNT }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </View>
    )
}

export default VideoSkeleton
