import { Alert, ActivityIndicator, View, Image, Text, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuthStore } from '../store/authStore'
import api from '../config/axios'
import Entypo from '@expo/vector-icons/Entypo';
import { FlashList } from '@shopify/flash-list'
import { z } from 'zod'
import { ProjectSchema } from '../types/Project'
import type { Project } from '../types/Project'
import { UserSchema } from '../types/User'
import { useProjectStore } from '../store/projectStore'

const CATEGORY_COLORS: Record<string, string> = {
    Children: "#FFB6C1",
    Informative: "#B0D4F1",
    Fiction: "#C4B5FD",
};

const CATEGORY_ICONS: Record<string, string> = {
    Children: "emoji-happy",
    Informative: "light-bulb",
    Fiction: "open-book",
};

function ProjectCard({ project }: { project: Project }) {
    const bgColor = CATEGORY_COLORS[project.category] || "#E5E7EB";
    const iconName = CATEGORY_ICONS[project.category] || "folder";
    const { setProject } = useProjectStore()
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
                setProject(project)
                router.push(`/project/${project.id}`)
            }}
            className="mb-3 rounded-2xl overflow-hidden"
            style={{ backgroundColor: bgColor }}
        >
            <View className="flex-row items-center p-4">
                <View className="w-12 h-12 rounded-xl bg-white/40 justify-center items-center mr-4">
                    <Entypo name={iconName as any} size={22} color="#222222" />
                </View>
                <View className="flex-1">
                    <Text className="text-primary text-lg font-roboto-semibold" numberOfLines={1}>
                        {project.name}
                    </Text>
                    <View className="flex-row items-center mt-1 gap-3">
                        <View className="flex-row items-center gap-1">
                            <Entypo name="folder" size={13} color="#555" />
                            <Text className="text-sm font-roboto-medium text-zinc-600">{project.category}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <Entypo name="cycle" size={13} color="#555" />
                            <Text className="text-sm font-roboto-medium text-zinc-600">{project.frequency}x/week</Text>
                        </View>
                    </View>
                </View>
                <Entypo name="chevron-right" size={22} color="#222222" />
            </View>
        </TouchableOpacity>
    );
}

const Home = () => {
    const { user, setUser } = useAuthStore()
    const [projects, setProjects] = useState<Project[]>([])
    const [refreshing, setRefreshing] = useState(false)

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

    useEffect(() => {
        if (user == null) {
            fetchUserData()
        }
    }, [user, fetchUserData])

    if (user === null) {
        return <SafeAreaView className='flex-1 justify-center items-center bg-primary'>
            <ActivityIndicator />
        </SafeAreaView>
    }
    return (
        <SafeAreaView className='flex-1 bg-primary p-4'>
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
            <View className='w-full p-4 py-6 bg-light flex-1 mt-4 rounded-3xl'>
                <View className='w-full flex-row justify-between items-center mb-4'>
                    <Text className='font-roboto-semibold text-xl text-primary'>Your Projects</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/create-project")} className='bg-secondary p-2 px-4 rounded-xl'>
                        <Entypo name="plus" size={24} color="white" />
                    </TouchableOpacity>
                </View>
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
                            <Entypo name="folder" size={48} color="#D1D5DB" />
                            <Text className="text-zinc-400 text-lg font-roboto-medium mt-4">No projects yet</Text>
                            <Text className="text-zinc-400 text-sm font-roboto mt-1">Tap + to create your first project</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    )
}

export default Home
