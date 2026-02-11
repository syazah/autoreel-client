import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react'
import { View, Text, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import api from '../../config/axios'
import { z } from 'zod'
import { StorySchema } from '../../types/Story'
import type { Story } from '../../types/Story'
import StoryCard from './StoryCard'

export type PromptsTabRef = {
    refresh: () => void
}

type PromptsTabProps = {
    projectId: string
    onStoryPress?: (story: Story) => void
}

export default forwardRef<PromptsTabRef, PromptsTabProps>(function PromptsTab({ projectId, onStoryPress }, ref) {
    const [stories, setStories] = useState<Story[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchStories = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true)
        else setLoading(true)

        try {
            const response = await api.get('/api/v1/story/prompt', {
                params: { projectId },
            })
            if (response.data.success) {
                const stories = z.array(StorySchema).parse(response.data.data.stories)
                setStories(stories)
            }
        } catch {
            // silently fail — user can pull to refresh
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [projectId])

    useEffect(() => {
        fetchStories()
    }, [fetchStories])

    useImperativeHandle(ref, () => ({
        refresh: () => fetchStories(true),
    }), [fetchStories])

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator color="#FF6D1F" size="large" />
            </View>
        )
    }

    if (stories.length === 0) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-light/30 font-roboto-medium text-base">
                    No prompts yet
                </Text>
            </View>
        )
    }

    return (
        <FlatList
            data={stories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <StoryCard story={item} onPress={() => onStoryPress?.(item)} />
            )}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => fetchStories(true)}
                    tintColor="#FF6D1F"
                />
            }
        />
    )
})
