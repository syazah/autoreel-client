import { useState, useMemo } from 'react'
import { View, Text, ScrollView, TextInput, Pressable, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign'
import Tablets from '../../../components/Tablets'
import type { Story, HookType } from '../../../types/Story'

const HOOK_LABELS: Record<string, string> = {
    question: 'Question',
    shocking_fact: 'Shocking Fact',
    mistake: 'Mistake',
    relatable_statement: 'Relatable',
    story_start: 'Story Start',
}

const HOOK_TYPES: HookType[] = [
    'question',
    'shocking_fact',
    'mistake',
    'relatable_statement',
    'story_start',
]

const inputClass = 'bg-white/5 text-light rounded-2xl p-4 border border-white/10 font-roboto text-base'

function SectionHeader({ title }: { title: string }) {
    return (
        <Text className="text-secondary font-roboto-medium text-sm uppercase tracking-wider mb-2">
            {title}
        </Text>
    )
}

function FieldLabel({ label }: { label: string }) {
    return (
        <Text className="text-light/40 font-roboto text-xs mb-1">
            {label}
        </Text>
    )
}

function FieldValue({ value }: { value: string }) {
    return (
        <Text className="text-light font-roboto text-base">
            {value}
        </Text>
    )
}

export default function StoryDetailScreen() {
    const router = useRouter()
    const params = useLocalSearchParams<{ storyId: string; story: string }>()
    const parsedStory: Story = useMemo(() => JSON.parse(params.story), [params.story])

    const [editing, setEditing] = useState(false)

    // Editable state
    const [title, setTitle] = useState(parsedStory.script.title)
    const [hookType, setHookType] = useState<HookType>(parsedStory.script.hook.type)
    const [hookText, setHookText] = useState(parsedStory.script.hook.text)
    const [mainMessage, setMainMessage] = useState(parsedStory.script.message.main_message)
    const [problem, setProblem] = useState(parsedStory.script.message.problem)
    const [resolution, setResolution] = useState(parsedStory.script.message.resolution)
    const [takeaway, setTakeaway] = useState(parsedStory.script.message.takeaway)
    const [intent, setIntent] = useState(parsedStory.script.intent)
    const [segments, setSegments] = useState(
        parsedStory.script.segments.map((s) => ({
            order: s.order,
            narration: s.narration,
            visual_idea: s.visual_idea,
            image_prompt_seed: s.image_prompt_seed,
        }))
    )

    const durationSec = Math.round(parsedStory.script.estimated_total_duration)
    const hookLabel = HOOK_LABELS[hookType] ?? hookType

    const updateSegment = (index: number, field: string, value: string) => {
        setSegments((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
    }

    return (
        <SafeAreaView className="bg-primary flex-1">
            {/* Header */}
            <View className="flex-row items-center px-5 pt-3 pb-4">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <AntDesign name="arrowleft" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-light font-roboto-medium text-xl flex-1" numberOfLines={1}>
                    {title}
                </Text>
                <TouchableOpacity onPress={() => setEditing((v) => !v)}>
                    {editing ? (
                        <Text className="text-secondary font-roboto-medium text-base">Done</Text>
                    ) : (
                        <AntDesign name="edit" size={20} color="#FF6D1F" />
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView className="px-5 pt-4" contentContainerStyle={{ paddingBottom: 160 }}>
                {/* Hook Section */}
                <View className="mb-6">
                    <SectionHeader title="Hook" />
                    {editing ? (
                        <>
                            <FieldLabel label="Type" />
                            <View className="flex-row flex-wrap gap-2 mb-3">
                                {HOOK_TYPES.map((ht) => (
                                    <Pressable key={ht} onPress={() => setHookType(ht)}>
                                        <Tablets
                                            text={
                                                <Text
                                                    className={`font-roboto-medium text-xs ${
                                                        ht === hookType ? 'text-secondary' : 'text-light/70'
                                                    }`}
                                                >
                                                    {HOOK_LABELS[ht]}
                                                </Text>
                                            }
                                        />
                                    </Pressable>
                                ))}
                            </View>
                            <FieldLabel label="Text" />
                            <TextInput
                                className={inputClass}
                                value={hookText}
                                onChangeText={setHookText}
                                multiline
                                placeholderTextColor="rgba(255,255,255,0.3)"
                            />
                        </>
                    ) : (
                        <>
                            <View className="mb-2">
                                <Tablets
                                    text={
                                        <Text className="text-secondary font-roboto-medium text-xs">
                                            {hookLabel}
                                        </Text>
                                    }
                                />
                            </View>
                            <FieldValue value={hookText} />
                        </>
                    )}
                </View>

                {/* Core Message Section */}
                <View className="mb-6">
                    <SectionHeader title="Core Message" />

                    <FieldLabel label="Main Message" />
                    {editing ? (
                        <TextInput
                            className={`${inputClass} mb-3`}
                            value={mainMessage}
                            onChangeText={setMainMessage}
                            multiline
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                    ) : (
                        <Text className="text-light font-roboto text-base mb-3">{mainMessage}</Text>
                    )}

                    <FieldLabel label="Problem" />
                    {editing ? (
                        <TextInput
                            className={`${inputClass} mb-3`}
                            value={problem}
                            onChangeText={setProblem}
                            multiline
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                    ) : (
                        <Text className="text-light font-roboto text-base mb-3">{problem}</Text>
                    )}

                    <FieldLabel label="Resolution" />
                    {editing ? (
                        <TextInput
                            className={`${inputClass} mb-3`}
                            value={resolution}
                            onChangeText={setResolution}
                            multiline
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                    ) : (
                        <Text className="text-light font-roboto text-base mb-3">{resolution}</Text>
                    )}

                    <FieldLabel label="Takeaway" />
                    {editing ? (
                        <TextInput
                            className={inputClass}
                            value={takeaway}
                            onChangeText={setTakeaway}
                            multiline
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                    ) : (
                        <FieldValue value={takeaway} />
                    )}
                </View>

                {/* Segments Section */}
                <View className="mb-6">
                    <SectionHeader title="Segments" />
                    {segments.map((seg, idx) => (
                        <View key={seg.order} className="mb-5">
                            <Text className="text-light font-roboto-medium text-base mb-2">
                                Segment {seg.order}
                            </Text>

                            <FieldLabel label="Narration" />
                            {editing ? (
                                <TextInput
                                    className={`${inputClass} mb-3`}
                                    value={seg.narration}
                                    onChangeText={(v) => updateSegment(idx, 'narration', v)}
                                    multiline
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                />
                            ) : (
                                <Text className="text-light font-roboto text-base mb-3">
                                    {seg.narration}
                                </Text>
                            )}

                            <FieldLabel label="Visual Idea" />
                            {editing ? (
                                <TextInput
                                    className={`${inputClass} mb-3`}
                                    value={seg.visual_idea}
                                    onChangeText={(v) => updateSegment(idx, 'visual_idea', v)}
                                    multiline
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                />
                            ) : (
                                <Text className="text-light font-roboto text-base mb-3">
                                    {seg.visual_idea}
                                </Text>
                            )}

                            <FieldLabel label="Image Prompt Seed" />
                            {editing ? (
                                <TextInput
                                    className={inputClass}
                                    value={seg.image_prompt_seed}
                                    onChangeText={(v) => updateSegment(idx, 'image_prompt_seed', v)}
                                    multiline
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                />
                            ) : (
                                <FieldValue value={seg.image_prompt_seed} />
                            )}
                        </View>
                    ))}
                </View>

                {/* Hashtags Section */}
                {parsedStory.script.hashtags.length > 0 && (
                    <View className="mb-6">
                        <SectionHeader title="Hashtags" />
                        <View className="flex-row flex-wrap gap-2">
                            {parsedStory.script.hashtags.map((tag) => (
                                <Tablets
                                    key={tag}
                                    text={
                                        <Text className="text-light/70 font-roboto-medium text-xs">
                                            #{tag}
                                        </Text>
                                    }
                                />
                            ))}
                        </View>
                    </View>
                )}

                {/* Meta Section */}
                <View className="mb-6">
                    <SectionHeader title="Meta" />

                    <FieldLabel label="Intent" />
                    {editing ? (
                        <TextInput
                            className={`${inputClass} mb-3`}
                            value={intent}
                            onChangeText={setIntent}
                            multiline
                            placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                    ) : (
                        <Text className="text-light font-roboto text-base mb-3">{intent}</Text>
                    )}

                    <FieldLabel label="Duration" />
                    <Tablets
                        text={
                            <Text className="text-light/70 font-roboto-medium text-xs">
                                ~{durationSec}s
                            </Text>
                        }
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
