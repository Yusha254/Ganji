// OverviewMetricCards.tsx

import { Text, ThemedCard, View } from "@/components/Themed";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

export default function MetricCards() {
  return (
    <View className="flex-row justify-between my-4 mx-2">
      
      {/* CARD 1 */}
      <ThemedCard className="flex-1 mx-2 items-center">
        <MaterialCommunityIcons name="receipt" size={18} color="rgb(192, 132, 252)" />
        <Text className="text-xs mt-1 opacity-70">This Month</Text>
        <Text className="text-lg font-semibold mt-1">4</Text>
      </ThemedCard>

      {/* CARD 2 */}
      <ThemedCard className="flex-1 mx-2 items-center">
        <Ionicons name="trending-up" size={18} color="rgb(244, 114, 182)" />
        <Text className="text-xs mt-1 opacity-70">Total Fees</Text>
        <Text className="text-lg font-semibold mt-1">$1473</Text>
      </ThemedCard>

      {/* CARD 3 */}
      <ThemedCard className="flex-1 mx-2 items-center">
        <FontAwesome name="users" size={18} color="rgb(74, 222, 128)" />
        <Text className="text-xs mt-1 opacity-70">Contacts</Text>
        <Text className="text-lg font-semibold mt-1">20</Text>
      </ThemedCard>

    </View>
  );
}
