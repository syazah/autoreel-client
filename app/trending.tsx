import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native'
import React, { useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useTrendsStore } from '../store/trendsStore'
import SectionHeader from '../components/trending/SectionHeader'
import VideoCard from '../components/trending/VideoCard'

const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM'
    if (hour === 12) return '12 PM'
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`
}

const Trending = () => {
    const { trends } = useTrendsStore()
    const [showNicheDropdown, setShowNicheDropdown] = useState(false)

    const nicheKeys = useMemo(
        () => (trends ? Object.keys(trends.nicheOpportunities) : []),
        [trends]
    )
    const [selectedNiche, setSelectedNiche] = useState<string | null>(null)

    const activeNiche = selectedNiche ?? nicheKeys[0] ?? null
    const nicheVideos = activeNiche ? trends?.nicheOpportunities[activeNiche] ?? [] : []

    if (!trends) {
        return (
            <SafeAreaView className='flex-1 bg-primary justify-center items-center'>
                <Text className='text-light/50 font-roboto-light'>No trending data available</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className='flex-1 bg-primary'>
            {/* Header */}
            <View className='flex-row items-center px-4 py-3 gap-2'>
                <TouchableOpacity className='bg-light/20 p-2 rounded-full' onPress={() => router.back()}>
                    <AntDesign name="caret-left" size={22} color="#FAF3E1" />
                </TouchableOpacity>
                <Text className='text-light text-2xl font-roboto-light'>Trending</Text>
            </View>

            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                {/* Trending Topics */}
                {trends.trendingTopics.length > 0 && (
                    <>
                        <View className='px-4'>
                            <SectionHeader title="Trending Topics" iconColor='#008BFF' icon="tags" count={trends.trendingTopics.length} />
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerClassName='px-4 gap-2'
                        >
                            {trends.trendingTopics.map((topic) => (
                                <View key={topic.topic} className='bg-[#2a2a2a] px-3 py-2 rounded-full flex-row items-center gap-2'>
                                    <Text className='text-light text-xs font-roboto-medium'>{topic.topic}</Text>
                                    <View className='bg-light/10 px-1.5 py-0.5 rounded-full'>
                                        <Text className='text-light/50 text-[9px] font-roboto-light'>{topic.count}</Text>
                                    </View>
                                    <Text className='text-emerald-400 text-[9px] font-roboto-light'>
                                        {(topic.avgEngagement * 100).toFixed(1)}%
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </>
                )}

                {/* Best Posting Hours */}
                {trends.engagementByHour.length > 0 && (
                    <>
                        <View className='px-4'>
                            <SectionHeader title="Best Posting Hours" iconColor='#008BFF' icon="clock-circle" count={trends.engagementByHour.length} />
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerClassName='px-4 gap-2'
                        >
                            {[...trends.engagementByHour]
                                .sort((a, b) => b.avgEngagement - a.avgEngagement)
                                .map((slot) => (
                                    <View key={slot.hour} className='bg-[#2a2a2a] px-3 py-2.5 rounded-xl items-center min-w-[80px]'>
                                        <Text className='text-light text-xs font-roboto-medium'>{formatHour(slot.hour)}</Text>
                                        <Text className='text-emerald-400 text-[10px] font-roboto-light mt-1'>
                                            {(slot.avgEngagement * 100).toFixed(1)}%
                                        </Text>
                                        <Text className='text-light/30 text-[9px] font-roboto-light mt-0.5'>
                                            {slot.videoCount} videos
                                        </Text>
                                    </View>
                                ))}
                        </ScrollView>
                    </>
                )}

                {/* Viral Potential */}
                <View className='px-4'>
                    <SectionHeader title="Viral Potential" iconColor='#008BFF' icon="fire" count={trends.viralPotential.length} />
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName='px-4'
                >
                    {trends.viralPotential.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </ScrollView>

                {/* Rising Stars */}
                <View className='px-4'>
                    <SectionHeader title="Rising Stars" iconColor='#008BFF' icon="star" count={trends.risingStars.length} />
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName='px-4'
                >
                    {trends.risingStars.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </ScrollView>

                {/* Niche Opportunities */}
                {nicheKeys.length > 0 && (
                    <>
                        <View className='px-4 flex-row items-center justify-between'>
                            <SectionHeader title="Niche Opportunities" iconColor='#008BFF' icon="api" count={nicheVideos.length} />
                        </View>

                        {/* Dropdown trigger */}
                        <View className='px-4 mb-3'>
                            <TouchableOpacity
                                className='bg-[#2a2a2a] px-4 py-2.5 rounded-xl flex-row items-center justify-between'
                                onPress={() => setShowNicheDropdown(true)}
                            >
                                <Text className='text-light text-sm font-roboto-medium capitalize'>
                                    {activeNiche}
                                </Text>
                                <AntDesign name="down" size={14} color="rgba(250,243,225,0.5)" />
                            </TouchableOpacity>
                        </View>

                        {/* Dropdown modal */}
                        <Modal
                            visible={showNicheDropdown}
                            transparent
                            animationType='fade'
                            onRequestClose={() => setShowNicheDropdown(false)}
                        >
                            <TouchableOpacity
                                className='flex-1 bg-black/60 justify-center px-8'
                                activeOpacity={1}
                                onPress={() => setShowNicheDropdown(false)}
                            >
                                <View className='bg-[#1e1e1e] rounded-2xl overflow-hidden max-h-[400px]'>
                                    <Text className='text-light/50 text-xs font-roboto-light tracking-widest uppercase px-4 pt-4 pb-2'>
                                        Select Category
                                    </Text>
                                    <FlatList
                                        data={nicheKeys}
                                        keyExtractor={(item) => item}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                className={`px-4 py-3 flex-row items-center justify-between ${item === activeNiche ? 'bg-[#008BFF]/10' : ''}`}
                                                onPress={() => {
                                                    setSelectedNiche(item)
                                                    setShowNicheDropdown(false)
                                                }}
                                            >
                                                <Text className={`text-sm font-roboto-medium capitalize ${item === activeNiche ? 'text-[#008BFF]' : 'text-light'}`}>
                                                    {item}
                                                </Text>
                                                <View className='bg-light/10 px-2 py-0.5 rounded-full'>
                                                    <Text className='text-light/40 text-[10px] font-roboto-light'>
                                                        {trends.nicheOpportunities[item].length}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </TouchableOpacity>
                        </Modal>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerClassName='px-4'
                        >
                            {nicheVideos.map((video) => (
                                <VideoCard key={video.id} video={video} />
                            ))}
                        </ScrollView>
                    </>
                )}

                <View className='h-8' />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Trending
