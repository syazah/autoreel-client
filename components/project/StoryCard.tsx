import { View, Text, Pressable } from 'react-native'
import type { Story } from '../../types/Story'
import Tablets from '../Tablets'

const HOOK_LABELS: Record<string, string> = {
    question: 'Question',
    shocking_fact: 'Shocking Fact',
    mistake: 'Mistake',
    relatable_statement: 'Relatable',
    story_start: 'Story Start',
}

type StoryCardProps = {
    story: Story
    onPress?: () => void
}

export default function StoryCard({ story, onPress }: StoryCardProps) {
    const { script } = story
    const durationSec = Math.round(script.estimated_total_duration)
    const hookLabel = HOOK_LABELS[script.hook.type] ?? script.hook.type
    const visibleHashtags = script.hashtags.slice(0, 4)
    const remaining = script.hashtags.length - visibleHashtags.length

    return (
        <Pressable onPress={onPress} className="bg-light/10 rounded-xl p-4 mb-3">
            {/* Title */}
            <Text className="text-light font-roboto-medium text-lg mb-2" numberOfLines={2}>
                {script.title}
            </Text>

            {/* Hook text */}
            <Text className="text-light/60 font-roboto-light text-sm mb-3" numberOfLines={2}>
                {script.hook.text}
            </Text>

            {/* Badges row */}
            <View className="flex-row items-center flex-wrap gap-2 mb-3">
                <Tablets text={<Text className="text-secondary font-roboto-medium text-xs">{hookLabel}</Text>} />
                <Tablets text={<Text className="text-light/70 font-roboto-medium text-xs">~{durationSec}s</Text>} />
                <Tablets text={<Text className="text-light/70 font-roboto-medium text-xs">{script.segments.length} segment{script.segments.length !== 1 ? 's' : ''}</Text>} />
            </View>

            {/* Hashtags */}
            {visibleHashtags.length > 0 && (
                <View className="flex-row flex-wrap gap-1.5">
                    {visibleHashtags.map((tag) => (
                        <View key={tag} className="bg-white/5 rounded-full px-2.5 py-0.5">
                            <Text className="text-light/40 font-roboto text-xs">
                                #{tag}
                            </Text>
                        </View>
                    ))}
                    {remaining > 0 && (
                        <View className="bg-white/5 rounded-full px-2.5 py-0.5">
                            <Text className="text-light/40 font-roboto text-xs">
                                +{remaining}
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </Pressable>
    )
}
