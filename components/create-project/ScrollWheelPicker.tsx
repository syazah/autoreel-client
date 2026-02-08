import { useRef, useCallback } from "react";
import { View, Text, NativeSyntheticEvent, NativeScrollEvent, DimensionValue } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const ITEM_HEIGHT = 120;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING = ITEM_HEIGHT * 2;

type ScrollWheelPickerProps<T> = {
  items: T[];
  renderLabel: (item: T) => string;
  onSelect: (item: T) => void;
  defaultIndex?: number;
  textSize?: number;
  itemHeight?: number;
  visibleItems?: number;
  containerHeight?: number;
  containerWidth?: DimensionValue;
  padding?: number;
};

function WheelItem<T>({
  item,
  index,
  scrollY,
  renderLabel,
  textSize = 100,
  itemHeight = ITEM_HEIGHT,
}: {
  item: T;
  index: number;
  scrollY: SharedValue<number>;
  renderLabel: (item: T) => string;
  textSize?: number;
  itemHeight?: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const center = scrollY.value;
    const itemPosition = index * ITEM_HEIGHT;
    const distance = Math.abs(itemPosition - center) / ITEM_HEIGHT;

    const scale = interpolate(distance, [0, 1, 2], [1.25, 0.95, 0.8], "clamp");
    const opacity = interpolate(distance, [0, 1, 2], [1.0, 0.5, 0.2], "clamp");

    return { transform: [{ scale }], opacity };
  });

  return (
    <Animated.View
      style={[
        { height: itemHeight, justifyContent: "center", alignItems: "center" },
        animatedStyle,
      ]}
    >
      <Text style={{ fontSize: textSize }} className={`text-white font-roboto-black`}>
        {renderLabel(item)}
      </Text>
    </Animated.View >
  );
}

export default function ScrollWheelPicker<T>({
  items,
  renderLabel,
  onSelect,
  defaultIndex = 0,
  textSize = 100,
  itemHeight = ITEM_HEIGHT,
  containerHeight = CONTAINER_HEIGHT,
  containerWidth = 100,
  padding = PADDING,
}: ScrollWheelPickerProps<T>) {
  const scrollY = useSharedValue(defaultIndex * itemHeight);
  const lastSnappedIndex = useRef(defaultIndex);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const didLayout = useRef(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / itemHeight);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));

      if (clampedIndex !== lastSnappedIndex.current) {
        lastSnappedIndex.current = clampedIndex;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      onSelect(items[clampedIndex]);
    },
    [items, onSelect, itemHeight]
  );

  return (
    <View style={{ width: containerWidth, height: containerHeight, overflow: "hidden" }}>

      <View
        pointerEvents="none"
        className="absolute left-4 right-4 z-10"
        style={{ top: padding + itemHeight }}
      >
        <View className="h-[1px] bg-white/30" />
      </View>

      <Animated.ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
        contentContainerStyle={{ paddingTop: PADDING, paddingBottom: PADDING }}
        onLayout={() => {
          if (!didLayout.current) {
            didLayout.current = true;
            scrollViewRef.current?.scrollTo({
              y: defaultIndex * itemHeight,
              animated: false,
            });
          }
        }}
      >
        {items.map((item, index) => (
          <WheelItem
            key={index}
            item={item}
            index={index}
            scrollY={scrollY}
            renderLabel={renderLabel}
            textSize={textSize}
            itemHeight={itemHeight}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}
