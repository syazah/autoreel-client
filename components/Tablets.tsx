import { View, Text } from 'react-native'
import React from 'react'

const Tablets = ({
    icon,
    text
}: { icon?: any, text?: any }) => {
    return (
        <View className='px-2 gap-1 bg-light/20 flex-row items-center rounded-full '>
            {icon}
            {text}
        </View>
    )
}

export default Tablets