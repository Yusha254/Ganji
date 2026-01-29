import { Text, View } from "@/components/Themed";
import { GradientActionButtonProps } from "@/interfaces";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable } from "react-native";

export default function GradientActionButton({
  label,
  onPress,
  disabled = false,
}: GradientActionButtonProps) {
  return (
    <Pressable disabled={disabled} onPress={onPress}>
      <View className="rounded-lg overflow-hidden">
        <LinearGradient
          colors={["rgb(168, 85, 247)", "rgb(236, 72, 153)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={`px-4 py-2 ${disabled ? "opacity-60" : ""}`}
        >
          <Text
            className="text-sm font-medium"
            lightColor="#fff"
            darkColor="#fff"
          >
            {label}
          </Text>
        </LinearGradient>
      </View>
    </Pressable>
  );
}
