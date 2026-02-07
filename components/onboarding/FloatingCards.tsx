import { useEffect } from 'react'
import { Image, View } from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated'

type CardConfig = {
    top: string
    left: string
    rotation: number
    size: 'sm' | 'md' | 'lg'
    opacity: number
    imgLink: string
    zIndex: number
}

const CARDS: CardConfig[] = [
    // two flanking mid-cards, overlapping the hero edges
    { top: '30%', left: '8%', rotation: -14, size: 'md', opacity: 0.7, zIndex: 4, imgLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfVLQ8EtD_RKl7_wdf1OI_gYUKaMVh0OQ2Ng&s" },
    { top: '32%', left: '58%', rotation: 10, size: 'md', opacity: 0.75, zIndex: 5, imgLink: "https://img.freepik.com/free-photo/influencer-posting-social-media_23-2149194122.jpg?semt=ais_user_personalization&w=740&q=80" },

    // top-left small — peeking from the corner
    { top: '8%', left: '-2%', rotation: -20, size: 'sm', opacity: 0.6, zIndex: 2, imgLink: "https://ca-times.brightspotcdn.com/dims4/default/fde8d0d/2147483647/strip/true/crop/3300x2200+0+0/resize/1200x800!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F8d%2F82%2Fbdecd44c4190ae5da6cfd57926c6%2Fla-et-utility-hollywood-careers-influencer.jpg" },

    // top-right medium — counterbalances top-left
    { top: '5%', left: '55%', rotation: 20, size: 'sm', opacity: 0.75, zIndex: 1, imgLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtvB8IWlL30F9YAH2PyzPHLBTkkgx9yiJPAw&s" },

    // mid-right small — fills the gap on right
    { top: '70%', left: '68%', rotation: 18, size: 'sm', opacity: 0.6, zIndex: 3, imgLink: "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2021/12/ig_reels_cover.jpg?w=1250&h=1120&crop=1" },

    // bottom-left — grounds the composition
    { top: '68%', left: '5%', rotation: 12, size: 'md', opacity: 0.7, zIndex: 3, imgLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSrYP7jnIFq6PrAZeTIKUQXn9Tc-gQynx1Cw&s" },

    // bottom-right — balances bottom-left
    { top: '72%', left: '45%', rotation: -10, size: 'sm', opacity: 0.65, zIndex: 2, imgLink: "https://techpilot.ai/wp-content/uploads/2023/12/PhotoReal_Create_the_perfect_african_american_instagram_influe_2-43.jpg" },

    // top-center accent — adds depth above hero
    { top: '15%', left: '30%', rotation: 7, size: 'sm', opacity: 0.6, zIndex: 1, imgLink: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVGLtxSNfCLceJIXXKLiGiZW3LzDmOAmDLtQ&s" },
]

const SIZE_CLASSES = {
    sm: 'w-[26%] aspect-[3/4]',
    md: 'w-[34%] aspect-[3/4]',
    lg: 'w-[42%] aspect-[3/4]',
}

const FloatingCards = () => {
    return (
        <View className='w-full h-full'>
            {CARDS.map((card, index) => (
                <Card key={index} config={card} index={index} />
            ))}
        </View>
    )
}

const Card = ({ config, index }: { config: CardConfig; index: number }) => {
    const scale = useSharedValue(0)
    const translateY = useSharedValue(60)
    const rotate = useSharedValue(0)
    const cardOpacity = useSharedValue(0)

    useEffect(() => {
        const delay = index * 100

        scale.value = withDelay(delay, withSpring(1, { damping: 14, stiffness: 80 }))
        translateY.value = withDelay(delay, withSpring(0, { damping: 16, stiffness: 70 }))
        rotate.value = withDelay(delay, withSpring(config.rotation, { damping: 12, stiffness: 60 }))
        cardOpacity.value = withDelay(delay, withTiming(config.opacity, { duration: 600 }))
    }, [cardOpacity, config.opacity, config.rotation, index, rotate, scale, translateY])

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateY: translateY.value },
            { rotate: `${rotate.value}deg` },
        ],
        opacity: cardOpacity.value,
    }))

    return (
        <Animated.View
            style={[
                { top: config.top as any, left: config.left as any, position: 'absolute', zIndex: config.zIndex },
                animatedStyle,
            ]}
            className={`${SIZE_CLASSES[config.size]} bg-white rounded-3xl shadow-lg overflow-hidden`}
        >
            {config.imgLink ? (
                <Image
                    source={{ uri: config.imgLink }}
                    className='w-full h-full'
                    resizeMode='cover'
                />
            ) : null}
        </Animated.View>
    )
}

export default FloatingCards
