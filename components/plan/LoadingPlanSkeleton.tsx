import { View } from 'react-native'
import React from 'react'
import Skeleton from 'react-native-reanimated-skeleton'
const CARD_COUNT = 2

const SkeletonCard = () => (
    <View className='w-full h-[250px] mr-3 rounded-2xl overflow-hidden p-2 justify-center item-center gap-4'>
        <Skeleton
            isLoading={true}
            boneColor='#333333'
            highlightColor='#444444'
            containerStyle={{ flex: 1 }}
        >
            <View style={{ width: 500, height: 40, backgroundColor: '#333333' }} />
            <View style={{ width: 500, marginTop: 20, height: 300, backgroundColor: '#333333' }} />
        </Skeleton>
    </View>
)

const LoadingPlanSkeleton = () => {
    return (
        <View className='w-full mt-4 flex-row'>
            <SkeletonCard />
        </View>
    )
}

export default LoadingPlanSkeleton
