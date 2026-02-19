import { Text, View } from "@/components/Themed";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator } from "react-native";

export default function ScreenLoader({
  label = "Loading…",
}: {
  label?: string;
}) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="rounded-2xl overflow-hidden mb-4">
        <LinearGradient
          colors={["rgb(168, 85, 247)", "rgb(236, 72, 153)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-14 h-14 items-center justify-center"
        >
          <ActivityIndicator color="#fff" />
        </LinearGradient>
      </View>

      <Text
        className="text-sm"
        lightColor="rgb(75,85,99)"
        darkColor="rgb(156,163,175)"
      >
        {label}
      </Text>
    </View>
  );
}
