import { Alert, ActivityIndicator, View, Image, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuthStore } from '../store/authStore'
import api from '../config/axios'
import Entypo from '@expo/vector-icons/Entypo';

const Home = () => {
    const { user, setUser } = useAuthStore()
    async function getUserData() {
        try {
            const response = await api.get('/api/v1/auth/user')
            const { data } = response.data
            if (!data.user) {
                Alert.alert("User Details Not Found", "No user data found. Please try again.")
            }
            setUser(data.user)
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert("User Details Not Found", error.message)
            } else {
                Alert.alert("User Details Not Found", "Something went wrong")
            }
        }
    }

    useEffect(() => {
        if (user == null) {
            getUserData()
        }
    }, [user])

    if (user === null) {
        return <SafeAreaView className='flex-1 justify-center items-center bg-primary'>
            <ActivityIndicator />
        </SafeAreaView>
    }
    return (
        <SafeAreaView className='flex-1 justify-start items-center bg-primary p-4'>
            {/* TOPBAR  */}
            <View className="w-full flex-row justify-between items-center p-4">
                <View className='flex flex-row justify-start items-center gap-2'>
                    <Image className="w-10 h-10 rounded-full" source={{ uri: user.profilePicture }} />
                    <Text className='text-white text-lg font-roboto-medium'>Hello, Azaan!</Text>
                </View>
                <View><Entypo name="bell" size={24} color="white" /></View>
            </View>

            {/* TOKENS */}
            <View className='w-full p-4 py-6 mt-2 bg-light rounded-3xl flex-row justify-between items-center'>
                <View className='flex flex-col justify-start items-start gap-1'>
                    <Text className=' text-md font-roboto-medium text-zinc-700'>Tokens Left</Text>
                    <Text className=' text-4xl font-roboto-black text-primary'>1000</Text>
                </View>
                <View className='bg-secondary w-20 h-20 rounded-2xl justify-center items-center'>
                    <Entypo name="arrow-bold-up" size={32} color="white" />
                </View>
            </View>

            {/* PROJECTS  */}
            <View className='w-full p-4 py-6 bg-light h-[75%] mt-4 rounded-3xl justify-start items-start'>
                <View className='w-full flex-row justify-between items-center'>
                    <Text className='font-roboto-semibold text-xl text-primary'>Your Projects</Text>
                    <TouchableOpacity onPress={() => router.push("/create-project")} className='bg-secondary p-2 px-4 rounded-xl'>
                        <Entypo name="plus" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Home