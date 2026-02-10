import { Alert, View, Image, Text, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuthStore } from '../store/authStore'
import api from '../config/axios'
import { FlashList } from '@shopify/flash-list'
import { z } from 'zod'
import { AllCategories, ProjectSchema } from '../types/Project'
import type { Category, Project } from '../types/Project'
import { UserSchema } from '../types/User'
import { useProjectStore } from '../store/projectStore'
import { useLoading } from '../context/LoadingContext'
import * as SecureStore from 'expo-secure-store';
import { ENV } from '../config/env'
import LoadingScreen from '../components/LoadingScreen'
import Tablets from '../components/Tablets'
import CategoryCards from '../components/home/CategoryCards'
import AntDesign from '@expo/vector-icons/AntDesign';
import AppButton from '../components/AppButton'


const CATEGORY_ICONS: Record<Category, string> = {
    Entertainment: "emoji-happy",
    Educational: "light-bulb",
    Storytelling: "open-book",
    Lifestyle: "heart",
};

function ProjectCard({ project }: { project: Project }) {
    const { setProject } = useProjectStore()
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
                setProject(project)
                router.push(`/project/${project.id}`)
            }}
            className="mb-3 rounded-2xl overflow-hidden"
        >
            <View className="flex-row items-center p-4">
                <View className="w-12 h-12 rounded-xl bg-white/40 justify-center items-center mr-4">
                </View>
                <View className="flex-1">
                    <Text className="text-primary text-lg font-roboto-semibold" numberOfLines={1}>
                        {project.name}
                    </Text>
                    <View className="flex-row items-center mt-1 gap-3">
                        <View className="flex-row items-center gap-1">
                            <Text className="text-sm font-roboto-medium text-zinc-600">{project.category}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <Text className="text-sm font-roboto-medium text-zinc-600">{project.frequency}x/week</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const Home = () => {
    const { user, setUser, logout } = useAuthStore()
    const [projects, setProjects] = useState<Project[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const { loadingState, setLoadingState } = useLoading()
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null)

    const fetchUserData = useCallback(async () => {
        try {
            const response = await api.get('/api/v1/auth/user?getProjects=true')
            const { data } = response.data
            if (!data.user) {
                Alert.alert("User Details Not Found", "No user data found. Please try again.")
            }
            const user = UserSchema.parse(data.user)
            const projects = data.projects ? z.array(ProjectSchema).parse(data.projects) : []
            setUser(user)
            setProjects(projects)
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert("User Details Not Found", error.message)
            } else {
                Alert.alert("User Details Not Found", "Something went wrong")
            }
        }
    }, [setUser])

    const onRefresh = useCallback(async () => {
        setRefreshing(true)
        await fetchUserData()
        setRefreshing(false)
    }, [fetchUserData])

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

    const handleSelectCard = (category: Category) => {
        setCurrentCategory(category)
    }

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
                    <Tablets icon={<Image className='w-6 h-6' source={require("../assets/stickers/coin.png")} />} text={<Text className='font-roboto-black text-white text-2xl'>
                        0
                    </Text>} />
                </View>
            </View>

            <View className='w-full flex justify-start items-start p-4'>
                <Text className='font-roboto-light text-light/50 tracking-widest uppercase'> filter by CATEGORIES</Text>
                <View className='w-full flex-row justify-center items-center mt-4 gap-6'>
                    {AllCategories.map((category, index) => (
                        <CategoryCards onSelect={() => {
                            if (currentCategory === category) { setCurrentCategory(null) } else { handleSelectCard(category) }
                        }} selected={currentCategory === category} key={index} category={category} />
                    ))}
                </View>
            </View>

            {/* PROJECTS  */}
            <View className='w-full p-4 py-6 bg-primary flex-1 mt-4 rounded-3xl'>
                <FlashList
                    data={projects}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ProjectCard project={item} />}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#FF6D1F"
                            colors={["#FF6D1F"]}
                        />
                    }
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center py-16">
                            <Image className='w-32 h-32' source={require("../assets/stickers/binocular.png")} />
                            <Text className="text-light/70 text-lg font-roboto-light uppercase mt-4">No projects FOUND</Text>
                            <Text className="text-light/50 text-sm font-roboto-extralight mt-1 uppercase">Tap + to create your first project</Text>
                        </View>
                    }
                />
            </View>

            <View className="absolute bottom-20 right-10">
                <AppButton width={64} height={48} icon={<AntDesign name="plus" size={24} color="white" />} onPressHandler={() => router.push("/create-project")} />
            </View>
        </SafeAreaView>
    )
}

export default Home
