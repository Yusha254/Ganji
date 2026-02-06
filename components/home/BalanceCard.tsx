import { Text, View } from "@/components/Themed";
import { BalanceCardProps } from "@/interfaces";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

export default function BalanceCard({ balance, totalReceived, totalSent }: BalanceCardProps) {
  return (
    <View className="mx-4 my-4 rounded-2xl overflow-hidden">
      <LinearGradient
        className="p-6"
        colors={["#a855f7", "#ec4899"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text
          className="opacity-80 text-base"
          lightColor="#FFFFFFCC"
          darkColor="#FFFFFFCC"
        >
          Total Balance
        </Text>

        <Text
          className="text-4xl font-bold mt-1"
          lightColor="#FFFFFF"
          darkColor="#FFFFFF"
        >
          KSh{" "}
          {balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>

        <View className="flex-row mt-5 w-full justify-between">
          <View
            className="rounded-2xl px-4 py-3 w-[48%]"
            lightColor="#FFFFFF1A"
            darkColor="#FFFFFF1A"
          >
            <Text
              className="text-sm"
              lightColor="rgb(134, 239, 172)"
              darkColor="rgb(134, 239, 172)"
            >
              Received
            </Text>
            <Text
              className="text-xl font-semibold mt-1"
              lightColor="#FFFFFF"
              darkColor="#FFFFFF"
            >
              KSh{" "}
              {totalReceived.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          <View
            className="rounded-2xl px-4 py-3 w-[48%]"
            lightColor="#FFFFFF1A"
            darkColor="#FFFFFF1A"
          >
            <Text
              className="text-sm"
              lightColor="rgb(252, 165, 165)"
              darkColor="rgb(252, 165, 165)"
            >
              Sent
            </Text>
            <Text
              className="text-xl font-semibold mt-1"
              lightColor="#FFFFFF"
              darkColor="#FFFFFF"
            >
              KSh{" "}
              {totalSent.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
