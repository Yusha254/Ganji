import { Text, View } from "@/components/Themed";
import { FilterTabsProps } from "@/interfaces";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, ScrollView } from "react-native";

export default function FilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}: FilterTabsProps) {
  const tabs = [
    { label: "All", value: "all" },
    { label: "Received", value: "received" },
    { label: "Sent", value: "sent" },
    { label: "Debt", value: "debt" },
  ] as const;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4 mb-6"
      contentContainerStyle={{
        flexDirection: "row",
        alignItems: "center",
        columnGap: 8,
        paddingRight: 16,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.value;
        const count = counts[tab.value];

        if (isActive) {
          return (
            <View
              key={tab.value}
              className="rounded-full overflow-hidden self-start"
            >
              <LinearGradient
                colors={["rgb(168, 85, 247)", "rgb(236, 72, 153)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-row items-center px-4 py-2"
              >
                <Text className="font-medium">{tab.label}</Text>

                <View
                  className="ml-2 px-2 py-0.5 rounded-full"
                  lightColor="rgba(255,255,255,0.2)"
                  darkColor="rgba(255,255,255,0.2)"
                >
                  <Text className="text-xs">{count}</Text>
                </View>
              </LinearGradient>
            </View>
          );
        }

        return (
          <Pressable
            key={tab.value}
            onPress={() => onFilterChange(tab.value)}
            className="self-start"
          >
            <View
              className="rounded-full flex-row items-center px-4 py-2"
              lightColor="#ffffff"
              darkColor="rgba(255,255,255,0.05)"
              style={{
                borderWidth: 1,
                borderColor: "rgb(233, 213, 255)",
              }}
            >
              <Text
                className="font-medium"
                lightColor="#4b5563"
                darkColor="#9ca3af"
              >
                {tab.label}
              </Text>

              <View
                className="ml-2 px-2 py-0.5 rounded-full"
                lightColor="rgb(243, 232, 255)"
                darkColor="rgba(255,255,255,0.05)"
              >
                <Text
                  className="text-xs"
                  lightColor="#4b5563"
                  darkColor="#9ca3af"
                >
                  {count}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
