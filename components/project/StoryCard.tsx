import { View, Text } from 'react-native'
import type { Story } from '../../types/Story'

const HOOK_LABELS: Record<string, string> = {
    question: 'Question',
    shocking_fact: 'Shocking Fact',
    mistake: 'Mistake',
    relatable_statement: 'Relatable',
    story_start: 'Story Start',
}

type StoryCardProps = {
    story: Story
}

export default function StoryCard({ story }: StoryCardProps) {
    const { script } = story
    const durationSec = Math.round(script.estimated_total_duration)
    const hookLabel = HOOK_LABELS[script.hook.type] ?? script.hook.type
    const visibleHashtags = script.hashtags.slice(0, 4)
    const remaining = script.hashtags.length - visibleHashtags.length

    return (
        <View className="bg-[#2A2A2A] rounded-2xl p-4 mb-3">
            {/* Title */}
            <Text className="text-light font-roboto-bold text-base mb-2" numberOfLines={2}>
                {script.title}
            </Text>

            {/* Hook text */}
            <Text className="text-light/60 font-roboto text-sm mb-3" numberOfLines={2}>
                {script.hook.text}
            </Text>

            {/* Badges row */}
            <View className="flex-row items-center flex-wrap gap-2 mb-3">
                <View className="bg-secondary/20 rounded-full px-3 py-1">
                    <Text className="text-secondary font-roboto-medium text-xs">
                        {hookLabel}
                    </Text>
                </View>
                <View className="bg-white/10 rounded-full px-3 py-1">
                    <Text className="text-light/70 font-roboto-medium text-xs">
                        ~{durationSec}s
                    </Text>
                </View>
                <View className="bg-white/10 rounded-full px-3 py-1">
                    <Text className="text-light/70 font-roboto-medium text-xs">
                        {script.segments.length} segment{script.segments.length !== 1 ? 's' : ''}
                    </Text>
                </View>
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
        </View>
    )
}
