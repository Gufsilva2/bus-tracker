import { View } from "react-native";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

/**
 * Skeleton loader component for loading states
 * Shows animated placeholder while content is loading
 */
export function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const shimmerAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnimatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shimmerAnimatedValue]);

  const opacity = shimmerAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#e0e0e0",
          opacity,
        },
        style,
      ]}
    />
  );
}

/**
 * Trip card skeleton loader
 */
export function TripCardSkeleton() {
  return (
    <View className="mb-3 rounded-lg border border-border bg-surface p-4">
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-1">
          <SkeletonLoader width="60%" height={20} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="40%" height={16} />
        </View>
        <SkeletonLoader width={80} height={24} borderRadius={12} />
      </View>

      <View className="mb-2 gap-1">
        <SkeletonLoader width="50%" height={14} style={{ marginBottom: 4 }} />
        <SkeletonLoader width="45%" height={14} style={{ marginBottom: 4 }} />
        <SkeletonLoader width="55%" height={14} />
      </View>

      <View className="flex-row items-center justify-between">
        <SkeletonLoader width="40%" height={16} />
        <SkeletonLoader width={60} height={16} />
      </View>
    </View>
  );
}

/**
 * Multiple skeleton loaders for list
 */
export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <TripCardSkeleton key={i} />
      ))}
    </View>
  );
}
