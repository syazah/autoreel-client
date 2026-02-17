import { View } from 'react-native'
import React from 'react'
import Skeleton from 'react-native-reanimated-skeleton'

const CARD_COUNT = 3

const SkeletonCard = () => (
    <View className='w-[200px] h-[200px] mr-3 rounded-2xl overflow-hidden' style={{ backgroundColor: '#fff' }}>
        <Skeleton
            isLoading={true}
            boneColor='#eee'
            highlightColor='#f4f3ee'
            containerStyle={{ flex: 1 }}
        >
            {/* Thumbnail */}
            <View style={{ width: 200, height: 112, backgroundColor: '#fff' }} />
            {/* Title line 1 */}
            <View style={{ width: 170, height: 10, marginTop: 10, marginLeft: 10, borderRadius: 4, backgroundColor: '#fff' }} />
            {/* Title line 2 */}
            <View style={{ width: 120, height: 10, marginTop: 4, marginLeft: 10, borderRadius: 4, backgroundColor: '#fff' }} />
            {/* Channel */}
            <View style={{ width: 80, height: 8, marginTop: 6, marginLeft: 10, borderRadius: 4, backgroundColor: '#fff' }} />
            {/* Stats */}
            <View style={{ width: 100, height: 8, marginTop: 6, marginLeft: 10, marginBottom: 10, borderRadius: 4, backgroundColor: '#fff' }} />
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
