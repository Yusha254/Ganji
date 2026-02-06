//is my button usage okay;

import { Text, ThemedCard, View } from "@/components/Themed";
import GradientActionButton from "@/components/ui/GradientActionButton";
import { useSettings } from "@/context/SettingsContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Pressable } from "react-native";

export default function DashboardType() {
  const { dashboardType, setDashboardType } = useSettings();

  return (
    <View className="mb-8">
      {/* Section Title */}
      <View className="flex-row items-center gap-2 mb-4">
        <AntDesign name="dashboard" size={20} color="rgb(192,132,252)" />
        <Text className="text-lg font-semibold">Dashboard</Text>
      </View>

      <ThemedCard>
        {/* Label */}
        <View className="mb-4">
          <Text className="font-medium">Transaction Period</Text>
          <Text
            className="text-sm mt-1"
            lightColor="rgb(75,85,99)"
            darkColor="rgb(156,163,175)"
          >
            Choose which transactions to show in your dashboard
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-2 mb-4">
          {dashboardType === "monthly" ? (
            <GradientActionButton
              label="Monthly"
              onPress={() => setDashboardType("monthly")}
            />
          ) : (
            <Pressable
              className="flex-1"
              onPress={() => setDashboardType("monthly")}
            >
              <View
                className="px-4 py-3 rounded-lg items-center"
                lightColor="rgb(243,232,255)"
                darkColor="rgba(255,255,255,0.05)"
              >
                <Text className="text-sm font-medium">Monthly</Text>
              </View>
            </Pressable>
          )}
          {dashboardType === "yearly" ? (
            <GradientActionButton
              label="Yearly"
              onPress={() => setDashboardType("yearly")}
            />
          ) : (
            <Pressable
              className="flex-1"
              onPress={() => setDashboardType("yearly")}
            >
              <View
                className="px-4 py-3 rounded-lg items-center"
                lightColor="rgb(243,232,255)"
                darkColor="rgba(255,255,255,0.05)"
              >
                <Text className="text-sm font-medium">Yearly</Text>
              </View>
            </Pressable>
          )}
          {dashboardType === "alltime" ? (
            <GradientActionButton
              label="All Time"
              onPress={() => setDashboardType("alltime")}
            />
          ) : (
            <Pressable
              className="flex-1"
              onPress={() => setDashboardType("alltime")}
            >
              <View
                className="px-4 py-3 rounded-lg items-center"
                lightColor="rgb(243,232,255)"
                darkColor="rgba(255,255,255,0.05)"
              >
                <Text className="text-sm font-medium">All Time</Text>
              </View>
            </Pressable>
          )}
        </View>

        {/* Info Box */}
        <View
          className="flex-row items-start gap-2 rounded-xl p-3"
          lightColor="rgb(239,246,255)"
          darkColor="rgba(59,130,246,0.1)"
        >
          <Feather name="info" size={16} color="rgb(96,165,250)" />
          <Text
            className="text-xs flex-1"
            lightColor="rgb(29,78,216)"
            darkColor="rgb(147,197,253)"
          >
            {dashboardType === "monthly" &&
              "Your dashboard will show transactions from the current month."}
            {dashboardType === "yearly" &&
              "Your dashboard will show transactions from the current year."}
            {dashboardType === "alltime" &&
              "Your dashboard will show all transactions from all time periods."}
          </Text>
        </View>
      </ThemedCard>
    </View>
  );
}
