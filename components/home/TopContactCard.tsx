// TopContactCard.tsx
import { Text, ThemedTopContactGradient, View } from "@/components/Themed";
import { TopContactCardProps } from "@/interfaces";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function TopContactCard({ topContact }: TopContactCardProps) {
  return (
    <View className="mx-4 rounded-2xl overflow-hidden">
      <ThemedTopContactGradient>
        <View className="flex-row justify-between items-center">
          {/* LEFT TEXT AREA */}
          <View className="flex-col">
            <Text
              className="text-sm mb-1"
              darkColor="rgb(216, 180, 254)"
              lightColor="rgb(126, 34, 206)"
            >
              Most Frequent Contact
            </Text>

            <Text className="text-xl font-semibold">{topContact.name}</Text>

            <Text className="text-sm" darkColor="#9ca3af" lightColor="#4b5563">
              {topContact.count} transactions
            </Text>
          </View>

          {/* RIGHT ICON CIRCLE */}
          <View
            className="rounded-full p-3"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Ionicons name="people" size={22} color="#ffffff" />
          </View>
        </View>
      </ThemedTopContactGradient>
    </View>
  );
}
