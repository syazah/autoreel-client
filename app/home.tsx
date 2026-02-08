import { View, Text, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../store/authStore'
import api from '../config/axios'

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
        <SafeAreaView className='flex-1 justify-center items-center bg-primary'>
            <Text>Hello {user.username}</Text>
        </SafeAreaView>
    )
}

export default Home