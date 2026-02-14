import { Alert, View, Image, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuthStore } from '../../store/authStore'
import api from '../../config/axios'
import { UserSchema } from '../../types/User'
import { useLoading } from '../../context/LoadingContext'
import * as SecureStore from 'expo-secure-store';
import { ENV } from '../../config/env'
import LoadingScreen from '../../components/LoadingScreen'
import Tablets from '../../components/Tablets'
import AntDesign from '@expo/vector-icons/AntDesign';
import TrendingCards from '../../components/home/TrendingCards'
import TrendingCardsSkeleton from '../../components/home/TrendingCardsSkeleton'
import { useTrendsStore } from '../../store/trendsStore'
import VideoSkeleton from '../../components/home/VideoSkeleton'

const Home = () => {
    const { user, setUser, logout } = useAuthStore()
    const { setLoadingState } = useLoading()
    const { trends: trendingVideos, setTrends, setLoading } = useTrendsStore()

    const fetchUserData = useCallback(async () => {
        try {
            const response = await api.get('/api/v1/auth/user')
            const { data } = response.data
            if (!data.user) {
                Alert.alert("User Details Not Found", "No user data found. Please try again.")
            }
            const user = UserSchema.parse(data.user)
            setUser(user)
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert("User Details Not Found", error.message)
            } else {
                Alert.alert("User Details Not Found", "Something went wrong")
            }
        }
    }, [setUser])

    const fetchTrends = async () => {
        try {
            setLoading(true)
            const res = await api.post("/api/v1/trends", {
                regionCode: "US",
                maxResults: 50,
                categoryId: null
            })
            if (res.status !== 200) {
                setLoading(false)
                Alert.alert("Failed to Fetch Trends", "Unable to fetch trending videos. Please try again later.")
            } else {
                setTrends(res.data.data.trends)
            }
        } catch (error) {
            setLoading(false)
            console.log("Error fetching trends:", error)
            Alert.alert("Failed to Fetch Trends", "Unable to fetch trending videos. Please try again later.")
        }
    }
    const handleLogout = async () => {
        try {
            setLoadingState({ isLoading: true })
            await SecureStore.deleteItemAsync(ENV.ACCESS_TOKEN_KEY);
            await SecureStore.deleteItemAsync(ENV.REFRESH_TOKEN_KEY);
            logout()
            setLoadingState({ isLoading: false })
            return router.replace("/")
        } catch (error) {
            setLoadingState({ isLoading: false })
            if (error instanceof Error) {
                Alert.alert("Logout Failed", error.message)
            } else {
                Alert.alert("Logout Failed", "Something went wrong. Please try again.")
            }
        }
    }

    useEffect(() => {
        if (!trendingVideos) {
            fetchTrends()
        }
    }, [trendingVideos])

    useEffect(() => {
        if (user == null) {
            fetchUserData()
        }
    }, [user, fetchUserData])

    if (user === null) {
        return <LoadingScreen />
    }
    return (
        <SafeAreaView className='flex-1 bg-primary p-4'>
            {/* TOPBAR  */}
            <View className="w-full flex-row justify-between items-center p-4">
                <View className='flex flex-row justify-start items-center gap-2'>
                    <TouchableOpacity onPress={handleLogout}>
                        <Image className="w-10 h-10 rounded-full" source={{ uri: user.profilePicture }} />
                    </TouchableOpacity>
                    <Text className='text-white text-lg font-roboto-medium'>Hello, {user.name.split(" ")[0]}!</Text>
                </View>
                <View className='flex flex-row justify-end items-center'>
                    <Tablets icon={<Image className='w-6 h-6' source={require("../../assets/stickers/coin.png")} />} text={<Text className='font-roboto-black text-white text-2xl'>
                        0
                    </Text>} />
                </View>
            </View>

            <View className='w-full flex justify-start items-start p-4'>
                <View className='w-full flex flex-row justify-between items-center'>
                    <Text className='font-roboto-light text-light/50 tracking-widest uppercase'>Trending</Text>
                    <TouchableOpacity className='flex flex-row gap-1 justify-center items-center' onPress={() => router.push("/trending")}>
                        <Text className='font-roboto-light text-light/50 tracking-widest uppercase flex flex-row justify-center items-center'>View All</Text>
                        <AntDesign name="caret-right" size={12} color="#008BFF" />
                    </TouchableOpacity>

                </View>

                {
                    trendingVideos ?
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className='mt-4'
                            contentContainerClassName='pr-4'
                        >

                            {trendingVideos.viralPotential.slice(0, 10).map((video, index) => (
                                <TrendingCards key={index} video={video} />
                            ))}

                        </ScrollView> :
                        <TrendingCardsSkeleton />
                }
            </View>

            {/* VIDEOS  */}
            <View className='w-full flex flex-row justify-between items-center mt-4'>
                <Text className='font-roboto-light text-light/50 tracking-widest uppercase'>YOUR Videos</Text>
            </View>
            {true ? <VideoSkeleton /> : <View className='w-full p-4 py-6 bg-primary flex-1 mt-4 rounded-3xl justify-center items-center'>
                <AntDesign name="video-camera" size={48} color="rgba(255,255,255,0.2)" />
                <Text className='text-light/30 font-roboto-light text-base mt-4 text-center'>
                    Videos you create will appear here
                </Text>
            </View>}
        </SafeAreaView>
    )
}

export default Home
