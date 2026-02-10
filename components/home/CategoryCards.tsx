import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import { Category, CategoryColors } from '../../types/Project'

const CategoryStickerImages: Record<Category, ImageSourcePropType> = {
    Entertainment: require('../../assets/stickers/serie.png'),
    Educational: require('../../assets/stickers/entertainment.png'),
    Storytelling: require('../../assets/stickers/theatre.png'),
    Lifestyle: require('../../assets/stickers/balance.png'),
}

const CategoryCards = (
    { category, selected, onSelect }: { category: Category, selected: boolean, onSelect: () => void }
) => {
    return (
        <TouchableOpacity activeOpacity={0.9} onPress={onSelect} className='w-[80px] h-[80px] gap-2 rounded-xl justify-start items-center'>
            <View
                style={{
                    borderColor: selected ? CategoryColors[category] : "transparent",
                }}
                className={`w-full h-[60px] bg-light/20 justify-center items-center rounded-xl border-[2px] `}>
                <Image className="w-10 h-10 rounded-full" source={CategoryStickerImages[category]} />
            </View>
            <Text style={{ color: selected ? CategoryColors[category] : "#FAF3E1" }} className=" text-light font-roboto-light text-[9px] uppercase">{category}</Text>
        </TouchableOpacity>
    )
}

export default CategoryCards