import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useMemo, useState } from "react"

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

export default function Plan() {
    const dates = useMemo(() => getNext7Days(), [])
    const [selectedDate, setSelectedDate] = useState<Date>(dates[0])
    const today = useMemo(() => new Date(), [])

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
                            onPress={() => setSelectedDate(date)}
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

                <View className="flex-1 justify-center items-center">
                    <Text className="text-light/20 font-roboto-light text-base text-center">
                        No content planned for this day
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    )
}
