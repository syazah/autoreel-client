import { View } from 'react-native'
import React from 'react'
import Skeleton from 'react-native-reanimated-skeleton'

const CARD_COUNT = 3

const SkeletonCard = () => (
    <View className='w-[200px] h-[200px] mr-3 rounded-2xl overflow-hidden' style={{ backgroundColor: '#2a2a2a' }}>
        <Skeleton
            isLoading={true}
            boneColor='#333333'
            highlightColor='#444444'
            containerStyle={{ flex: 1 }}
        >
            {/* Thumbnail */}
            <View style={{ width: 200, height: 112, backgroundColor: '#333333' }} />
            {/* Title line 1 */}
            <View style={{ width: 170, height: 10, marginTop: 10, marginLeft: 10, borderRadius: 4, backgroundColor: '#333333' }} />
            {/* Title line 2 */}
            <View style={{ width: 120, height: 10, marginTop: 4, marginLeft: 10, borderRadius: 4, backgroundColor: '#333333' }} />
            {/* Channel */}
            <View style={{ width: 80, height: 8, marginTop: 6, marginLeft: 10, borderRadius: 4, backgroundColor: '#333333' }} />
            {/* Stats */}
            <View style={{ width: 100, height: 8, marginTop: 6, marginLeft: 10, marginBottom: 10, borderRadius: 4, backgroundColor: '#333333' }} />
        </Skeleton>
    </View>
)

const TrendingCardsSkeleton = () => {
    return (
        <View className='w-full flex-row overflow-x-hidden mt-4'>
            {Array.from({ length: CARD_COUNT }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </View>
    )
}

export default TrendingCardsSkeleton
