import { useState, useCallback, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    Platform,
    Alert,
    ActivityIndicator,
    Keyboard,
} from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import AntDesign from '@expo/vector-icons/AntDesign'
import api from '../../config/axios'
import type { Project } from '../../types/Project'

type CreateStoryModalProps = {
    visible: boolean
    onClose: () => void
    onStoryCreated?: () => void
    project: Project
}

export default function CreateStoryModal({ visible, onClose, onStoryCreated, project }: CreateStoryModalProps) {
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomOffset = useSharedValue(0)

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

        const showSub = Keyboard.addListener(showEvent, (e) => {
            bottomOffset.value = withTiming(e.endCoordinates.height, { duration: 250 })
        })
        const hideSub = Keyboard.addListener(hideEvent, () => {
            bottomOffset.value = withTiming(0, { duration: 250 })
        })

        return () => {
            showSub.remove()
            hideSub.remove()
        }
    }, [bottomOffset])

    const sheetAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: -bottomOffset.value }],
    }))

    const handleSubmit = useCallback(async () => {
        const trimmed = prompt.trim()
        if (!trimmed) return

        setLoading(true)
        try {
            const response = await api.post('/api/v1/story/prompt', {
                projectId: project.id,
                projectCategory: project.category,
                prompt: trimmed,
            })

            if (response.data.success) {
                Alert.alert('Script Created', 'Your story script has been generated successfully.')
                setPrompt('')
                onClose()
                onStoryCreated?.()
            } else {
                Alert.alert('Error', 'Failed to create script. Please try again.')
            }
        } catch {
            Alert.alert('Error', 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [prompt, project, onClose, onStoryCreated])

    const handleClose = useCallback(() => {
        if (loading) return
        setPrompt('')
        onClose()
    }, [loading, onClose])

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}
        >
            <View className="flex-1 justify-end">
                {/* Backdrop */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleClose}
                    className="flex-1"
                />

                <Animated.View style={sheetAnimatedStyle} className="bg-[#2A2A2A] rounded-t-3xl px-6 pt-4 pb-10">
                    {/* Handle */}
                    <View className="w-10 h-1 bg-white/20 rounded-full self-center mb-5" />

                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-5">
                        <Text className="text-light font-roboto-bold text-xl">
                            Create Story
                        </Text>
                        <TouchableOpacity onPress={handleClose} disabled={loading}>
                            <AntDesign name="close" size={22} color="rgba(250, 243, 225, 0.5)" />
                        </TouchableOpacity>
                    </View>

                    {/* Label */}
                    <Text className="text-light/60 font-roboto-medium text-sm mb-2">
                        What is your story idea?
                    </Text>

                    {/* Input */}
                    <TextInput
                        value={prompt}
                        onChangeText={setPrompt}
                        placeholder="e.g. A curious fox discovers a hidden city beneath the forest..."
                        placeholderTextColor="rgba(250, 243, 225, 0.25)"
                        multiline
                        textAlignVertical="top"
                        editable={!loading}
                        className="bg-white/5 text-light font-roboto text-base rounded-2xl p-4 min-h-[120px] max-h-[200px] border border-white/10"
                        selectionColor="#FF6D1F"
                    />

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={prompt.trim().length === 0 || loading}
                        activeOpacity={0.8}
                        className={`mt-5 py-4 rounded-full items-center flex-row justify-center ${prompt.trim().length > 0 && !loading ? 'bg-secondary' : 'bg-secondary/30'
                            }`}
                    >
                        {loading ? (
                            <>
                                <ActivityIndicator color="white" size="small" />
                                <Text className="text-white font-roboto-semibold text-base ml-2">
                                    Generating Script...
                                </Text>
                            </>
                        ) : (
                            <Text className="text-white font-roboto-semibold text-base">
                                Generate Script
                            </Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    )
}
