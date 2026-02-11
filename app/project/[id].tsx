import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import { useRef, useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useProjectStore } from '../../store/projectStore'
import AntDesign from '@expo/vector-icons/AntDesign'
import CreateStoryModal from '../../components/project/CreateStoryModal'
import PromptsTab, { type PromptsTabRef } from '../../components/project/PromptsTab'
import type { Story } from '../../types/Story'
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    runOnJS,
    useAnimatedStyle,
    interpolate,
} from 'react-native-reanimated'
import AppButton from '../../components/AppButton'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const TABS = ['Videos', 'Images', 'Prompts'] as const

const INPUT_RANGE = TABS.map((_, i) => i * SCREEN_WIDTH)
const OUTPUT_RANGE = TABS.map((_, i) => i * (SCREEN_WIDTH / TABS.length))
const INDICATOR_WIDTH = SCREEN_WIDTH / TABS.length

const Project = () => {
    const { project } = useProjectStore()
    const router = useRouter()
    const scrollRef = useRef<Animated.ScrollView>(null)
    const scrollX = useSharedValue(0)
    const [activeTab, setActiveTab] = useState(0)
    const [storyModalVisible, setStoryModalVisible] = useState(false)
    const promptsTabRef = useRef<PromptsTabRef>(null)

    const handleStoryPress = useCallback((story: Story) => {
        router.push({
            pathname: '/project/story/[storyId]',
            params: { storyId: story.id, story: JSON.stringify(story) },
        })
    }, [router])

    const updateActiveTab = useCallback((x: number) => {
        const index = Math.round(x / SCREEN_WIDTH)
        setActiveTab(index)
    }, [])

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x
        },
        onMomentumEnd: (event) => {
            runOnJS(updateActiveTab)(event.contentOffset.x)
        },
    })

    const goToTab = useCallback((index: number) => {
        scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true })
        setActiveTab(index)
    }, [])

    const indicatorStyle = useAnimatedStyle(() => {
        'worklet'
        const translateX = interpolate(scrollX.value, INPUT_RANGE, OUTPUT_RANGE)
        return {
            transform: [{ translateX }],
            width: INDICATOR_WIDTH,
        }
    })

    return (
        <SafeAreaView className="bg-primary flex-1">
            {/* Project Name */}
            <View className="px-5 pt-3 pb-4">
                <Text className="text-light/70 font-roboto-medium text-2xl">
                    {project?.name ?? 'Project'}
                </Text>
            </View>

            {/* Tab Bar */}
            <View className="flex-row border-b border-white/10">
                {TABS.map((tab, index) => {
                    const isActive = activeTab === index
                    return (
                        <TouchableOpacity
                            key={tab}
                            activeOpacity={0.7}
                            onPress={() => goToTab(index)}
                            className="flex-1 items-center pb-3 pt-1"
                        >
                            <Text
                                className={`font-roboto-light text-lg ${isActive ? 'text-secondary' : 'text-light/50'}`}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
                {/* Animated Indicator */}
                <Animated.View
                    className="absolute bottom-0 h-[2px] bg-secondary"
                    style={indicatorStyle}
                />
            </View>

            {/* Carousel */}
            <Animated.ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                className="flex-1"
            >
                {TABS.map((tab) => (
                    <View key={tab} style={{ width: SCREEN_WIDTH }} className="flex-1">
                        {tab === 'Prompts' && project ? (
                            <PromptsTab ref={promptsTabRef} projectId={project.id} onStoryPress={handleStoryPress} />
                        ) : (
                            <View className="flex-1 items-center justify-center px-5">
                                <Text className="text-light/30 font-roboto-medium text-base mt-3">
                                    No {tab.toLowerCase()} yet
                                </Text>
                            </View>
                        )}
                    </View>
                ))}
            </Animated.ScrollView>

            {/* Plus Button */}
            <View className='absolute bottom-20 z-10 right-10'>
                <AppButton icon={<AntDesign name="plus" size={24} color="#008BFF" />} width={64} height={64} onPressHandler={() => setStoryModalVisible(true)} />
            </View>

            {/* Create Story Modal */}
            {project && (
                <CreateStoryModal
                    visible={storyModalVisible}
                    onClose={() => setStoryModalVisible(false)}
                    onStoryCreated={() => promptsTabRef.current?.refresh()}
                    project={project}
                />
            )}
        </SafeAreaView>
    )
}

export default Project
