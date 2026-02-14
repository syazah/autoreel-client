import { View, Text, TouchableOpacity, ScrollView, Alert, Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as SecureStore from "expo-secure-store"
import api from "../../config/axios"
import { ENV } from "../../config/env"
import { PlanTopic } from "../../types/plan"
import LoadingPlanSkeleton from "../../components/plan/LoadingPlanSkeleton"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function getNext7Days(): Date[] {
    const dates: Date[] = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() + i)
        dates.push(d)
    }
    return dates
}

function formatFullDate(date: Date): string {
    return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatDateString(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}

export default function Plan() {
    const dates = useMemo(() => getNext7Days(), [])
    const [planForDate, setPlanForDate] = useState<PlanTopic | null>(null)
    const [loadingPlan, setLoadingPlan] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState<Date>(dates[0])
    const today = useMemo(() => new Date(), [])

    const [scriptModalVisible, setScriptModalVisible] = useState(false)
    const [streamedScript, setStreamedScript] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const xhrRef = useRef<XMLHttpRequest | null>(null)
    const scrollViewRef = useRef<ScrollView>(null)

    const getPlanForDate = async (d: Date): Promise<any> => {
        setLoadingPlan(true)
        const dateString = formatDateString(d)
        const response = await api.post("/api/v1/plan/date", { date: dateString })
        console.log(response.data)
        if (response.status !== 200) {
            setLoadingPlan(false)
            return Alert.alert("Error", "Failed to fetch plan for the selected date")
        }
        const planData = response.data.data.plans
        setLoadingPlan(false)
        setPlanForDate(planData)
    }

    const handleGenerateScript = useCallback(async () => {
        setStreamedScript("")
        setScriptModalVisible(true)
        setIsGenerating(true)

        const token = await SecureStore.getItemAsync(ENV.ACCESS_TOKEN_KEY)
        const dateString = formatDateString(selectedDate)
        const url = `${ENV.API_URL}/api/v1/video/script`

        let processedLength = 0

        const xhr = new XMLHttpRequest()
        xhrRef.current = xhr
        xhr.open("POST", url)
        xhr.setRequestHeader("Content-Type", "application/json")
        if (token) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`)
        }

        xhr.onprogress = () => {
            const newText = xhr.responseText.substring(processedLength)
            processedLength = xhr.responseText.length

            const lines = newText.split("\n")
            let accumulated = ""
            for (const line of lines) {
                const trimmed = line.trim()
                if (trimmed.startsWith("data: ")) {
                    const payload = trimmed.slice(6)
                    if (payload === "[DONE]") {
                        setIsGenerating(false)
                        continue
                    }
                    try {
                        const parsed = JSON.parse(payload)
                        if (parsed.content) {
                            accumulated += parsed.content
                        }
                    } catch {
                        // ignore malformed chunks
                    }
                }
            }
            if (accumulated) {
                setStreamedScript((prev) => prev + accumulated)
            }
        }

        xhr.onloadend = () => {
            setIsGenerating(false)
            xhrRef.current = null
        }

        xhr.onerror = () => {
            setIsGenerating(false)
            xhrRef.current = null
            Alert.alert("Error", "Failed to generate script")
        }

        xhr.send(JSON.stringify({ date: dateString }))
    }, [selectedDate])

    const handleCloseModal = useCallback(() => {
        if (xhrRef.current) {
            xhrRef.current.abort()
            xhrRef.current = null
        }
        setScriptModalVisible(false)
        setIsGenerating(false)
    }, [])

    useEffect(() => {
        if (!planForDate) {
            getPlanForDate(selectedDate)
        }
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-primary">
            {/* Header */}
            <View className="px-4 pt-2 pb-4">
                <Text className="text-light/50 text-xl font-roboto-light uppercase">YOUR Content Plan</Text>
            </View>

            {/* Calendar strip */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="px-4 gap-2 h-[20%]"
            >
                {dates.map((date) => {
                    const isSelected = isSameDay(date, selectedDate)
                    const isToday = isSameDay(date, today)

                    return (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            key={date.toISOString()}
                            onPress={() => {
                                getPlanForDate(date)
                                setSelectedDate(date)
                            }}
                            className={`items-center py-3 px-4 rounded-2xl w-20 h-32 ${isSelected ? "bg-[#008BFF]" : "bg-[#2a2a2a]"}`}
                        >
                            <Text className={`text-[10px] font-roboto-light uppercase tracking-widest ${isSelected ? "text-white" : "text-light/40"}`}>
                                {DAYS[date.getDay()]}
                            </Text>
                            <Text className={`text-xl font-roboto-bold mt-1 ${isSelected ? "text-white" : "text-light"}`}>
                                {date.getDate()}
                            </Text>
                            <Text className={`text-[10px] font-roboto-light mt-0.5 ${isSelected ? "text-white/70" : "text-light/30"}`}>
                                {MONTHS[date.getMonth()]}
                            </Text>
                            {isToday && (
                                <View className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isSelected ? "bg-white" : "bg-[#008BFF]"}`} />
                            )}
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>

            {/* Selected date content */}
            <View className="px-4 h-[80%]">
                <Text className="text-light/50 font-roboto-light text-xs tracking-widest uppercase mb-4">
                    {formatFullDate(selectedDate)}
                </Text>

                {loadingPlan ? <LoadingPlanSkeleton /> : <View className="flex-1 justify-start items-start">
                    <Text className="text-light/60 font-roboto-medium text-lg">
                        {planForDate ? planForDate.title : "No content planned for this day"}
                    </Text>
                    <Text className="text-light/40 font-roboto-light text-base mt-4">
                        {planForDate ? planForDate.shortSummary : "No content planned for this day"}
                    </Text>
                    <View className="flex-row w-full justify-end items-center">
                        <TouchableOpacity onPress={handleGenerateScript} className="rounded-full bg-secondary px-4 py-2 mt-6">
                            <Text className="text-primary">Generate Script</Text>
                        </TouchableOpacity>
                    </View>

                </View>}
            </View>

            {/* Script Modal */}
            <Modal
                visible={scriptModalVisible}
                animationType="slide"
                presentationStyle="fullScreen"
                onRequestClose={handleCloseModal}
            >
                <SafeAreaView className="flex-1 bg-primary">
                    {/* Modal Header */}
                    <View className="flex-row items-center justify-between px-4 py-3 border-b border-light/10">
                        <Text className="text-light text-lg font-roboto-medium">Script</Text>
                        <TouchableOpacity onPress={handleCloseModal} className="p-2">
                            <Text className="text-light/60 text-2xl font-roboto-light">✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Script Content */}
                    <ScrollView
                        ref={scrollViewRef}
                        className="flex-1 px-4 pt-4"
                        onContentSizeChange={() => {
                            scrollViewRef.current?.scrollToEnd({ animated: true })
                        }}
                    >
                        <Text className="text-light/80 font-roboto-light text-base leading-7">
                            {streamedScript}
                            {isGenerating && <Text className="text-[#008BFF]">▊</Text>}
                        </Text>
                        <View className="h-8" />
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    )
}
