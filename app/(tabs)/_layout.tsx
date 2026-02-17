import { Tabs } from 'expo-router'
import { View } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#eee',
                    bottom: 28,
                    borderRadius: 24,
                    borderTopWidth: 0,
                    height: 64,
                    shadowColor: '#eee',
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
                tabBarActiveTintColor: '#c15f3c',
                tabBarInactiveTintColor: '#ddd',
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <View className='items-center justify-center w-20 h-16'>
                            <MaterialCommunityIcons name="home-circle" size={38} color={color} />
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
                            className='w-20 h-20 rounded-full bg-secondary items-center justify-center -mt-5'
                            style={{
                                shadowColor: '#c15f3c',
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
                        <View className='items-center justify-center w-20 h-16 '>
                            <Ionicons name="calendar-clear" size={32} color={color} />
                            {focused && <View className='w-1 h-1 rounded-full bg-secondary' />}
                        </View>
                    ),
                }}
            />
        </Tabs>
    )
}
