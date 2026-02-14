import { Tabs } from 'expo-router'
import { View } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#111111',
                    position: 'absolute',
                    left: 24,
                    right: 24,
                    bottom: 28,
                    borderRadius: 24,
                    borderTopWidth: 0,
                    height: 64,
                    paddingBottom: 0,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                    elevation: 12,
                },
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 8,
                },
                tabBarActiveTintColor: '#008BFF',
                tabBarInactiveTintColor: 'rgba(250,243,225,0.25)',
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <View className='items-center'>
                            <AntDesign name="home" size={24} color={color} />
                            {focused && <View className='w-1 h-1 rounded-full bg-secondary mt-1.5' />}
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: '',
                    tabBarIcon: () => (
                        <View
                            className='w-14 h-14 rounded-2xl bg-secondary items-center justify-center -mt-5'
                            style={{
                                shadowColor: '#008BFF',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.4,
                                shadowRadius: 12,
                                elevation: 8,
                            }}
                        >
                            <AntDesign name="plus" size={26} color="white" />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="plan"
                options={{
                    title: 'Plan',
                    tabBarIcon: ({ color, focused }) => (
                        <View className='items-center'>
                            <AntDesign name="calendar" size={24} color={color} />
                            {focused && <View className='w-1 h-1 rounded-full bg-secondary mt-1.5' />}
                        </View>
                    ),
                }}
            />
        </Tabs>
    )
}
