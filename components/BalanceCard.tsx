import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "./Themed";

export default function BalanceCard() {
  return (
    <View className="mx-4 rounded-2xl overflow-hidden">
    <LinearGradient
      className="p-6"
      colors={['#a855f7', '#ec4899']}
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
        lightColor="#FFFFFFCC"
        darkColor="#FFFFFFCC"
      >
        $ -1490.67
      </Text>

      <View className="flex-row mt-5 w-full justify-between">
        <View 
          className="rounded-2xl px-4 py-3 w-[48%]"
          lightColor="#FFFFFF1A"
          darkColor="#FFFFFF1A"  
        >
          <Text 
            className="text-sm"
            lightColor="#FFFFFFCC"
            darkColor="#FFFFFFCC"
          >
            Received
          </Text>
          <Text 
            className="text-xl font-semibold mt-1"
            lightColor="#FFFFFF"
            darkColor="#FFFFFF"
          >
            $451.20</Text>
        </View>

        <View
          className="rounded-2xl px-4 py-3 w-[48%]"
          lightColor="#FFFFFF1A"
          darkColor="#FFFFFF1A"  
        >
          <Text
            className="text-sm"
            lightColor="#FFFFFFCC"
            darkColor="#FFFFFFCC"
          >
            Sent
          </Text>
          <Text
            className="text-xl font-semibold mt-1"
            lightColor="#FFFFFF"
            darkColor="#FFFFFF"
          >
            $959.16
          </Text>
        </View>
      </View>
    </LinearGradient>
    </View>
  );
}
