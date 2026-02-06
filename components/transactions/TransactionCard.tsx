import { Text, View } from "@/components/Themed";
import { TransactionWithDebt } from "@/interfaces";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { Pressable } from "react-native";

export default function TransactionCard({ transaction }: { transaction: TransactionWithDebt }) {
  const [expanded, setExpanded] = useState(false);

  const isReceived = transaction.isIncome;
  const isDebt = !!transaction.debt;

  return (
    <Pressable onPress={() => setExpanded((p) => !p)}>
      <View
        className="
          mb-3 
          rounded-2xl 
          p-4
          border 
          border-white/10 
        "
        lightColor="#ffffff"
        darkColor="#FFFFFF26"
      >
        {/* Top Row */}
        <View className="flex-row justify-between">

          {/* Left Section */}
          <View className="flex-row flex-1 gap-3 items-start">

            {/* Icon */}
            <View
              className="p-2 rounded-xl"
              lightColor="rgba(255, 255, 255, 0.5)"
              darkColor="rgba(255, 255, 255, 0.1)"
            >
              {isReceived ? (
                <Feather name="arrow-down-left" size={20} color="rgb(74,222,128)" />
              ) : (
                <Feather name="arrow-up-right" size={20} color="rgb(248,113,113)" />
              )}
            </View>

            {/* Name + Time */}
            <View className="flex-1">
              <Text className="font-semibold text-base" numberOfLines={1}>
                {transaction.name || "Unknown"}
              </Text>

              <View className="flex-row items-center mt-1 gap-1">
                <Feather name="clock" size={12} color="gray" />
                <Text className="text-sm" lightColor="rgb(163, 163, 163)" darkColor="rgb(163, 163, 163)">
                  {transaction.time} • {transaction.date}
                </Text>
              </View>
            </View>
          </View>

          {/* Amount */}
          <View className="items-end">
            <Text
              className={`
                font-semibold text-lg 
              `}
              lightColor={isReceived ? "rgb(74,222,128)" : "rgb(248,113,113)"}
              darkColor={isReceived ? "rgb(74,222,128)" : "rgb(248,113,113)"}
            >
              KSh {Math.abs(transaction.amount)}
            </Text>

            {transaction.transactionCost > 0 && (
              <Text className="text-xs" lightColor="rgb(163, 163, 163)" darkColor="rgb(163, 163, 163)">
                Fee: KSh {transaction.transactionCost}
              </Text>
            )}
          </View>
        </View>

        {/* Expanded Area */}
        {expanded && (
          <View
            className="
              mt-4 pt-4
              border-t
              gap-3
            "
            lightBorderColor="rgba(255, 255, 255, 0.1)"
            darkBorderColor="rgba(255, 255, 255, 0.1)"
          >
            {/* Transaction Code */}
            <View className="flex-row justify-between">
              <View className="flex-row gap-2 items-center">
                <Feather name="hash" size={16} color="gray" />
                <Text className="text-sm" lightColor="rgb(163, 163, 163)" darkColor="rgb(163, 163, 163)">Code</Text>
              </View>

              <Text className="text-sm" lightColor="rgb(216, 180, 254)" darkColor="rgb(216, 180, 254)">
                {transaction.code}
              </Text>
            </View>

            {/* Transaction Cost */}
            <View className="flex-row justify-between">
              <Text className="text-sm" lightColor="rgb(163, 163, 163)" darkColor="rgb(163, 163, 163)">Transaction Cost</Text>
              <Text className="text-sm" lightColor="rgb(209, 213, 219)" darkColor="rgb(209, 213, 219)">
                KSh {transaction.transactionCost}
              </Text>
            </View>

            {/* Debt Cost (Optional) */}
            {isDebt && (
              <View className="flex-row justify-between">
                <View className="flex-row gap-2 items-center">
                  <Feather name="alert-circle" size={16} color="rgb(251,146,60)" />
                  <Text className="text-sm" lightColor="rgb(253, 186, 116)" darkColor="rgb(253, 186, 116)">Debt Cost</Text>
                </View>
                <Text className="text-sm" lightColor="rgb(253, 186, 116)" darkColor="rgb(253, 186, 116)">
                  KSh {transaction.debt?.interest}
                </Text>
              </View>
            )}

            {/* TOTAL */}
            <View
              className="
                mt-2 p-3 rounded-lg 
              "
              lightColor="rgba(255, 255, 255, 0.05)"
              darkColor="rgba(255, 255, 255, 0.05)"
            >
              <Text className="text-sm mb-1" lightColor="rgb(163, 163, 163)" darkColor="rgb(163, 163, 163)">Total</Text>

              <Text
                className={`
                  text-xl font-bold
                `}
                lightColor={isReceived ? "rgb(74,222,128)" : "rgb(248,113,113)"}
                darkColor={isReceived ? "rgb(74,222,128)" : "rgb(248,113,113)"}
              >
                KSh{" "}
                {(
                  Math.abs(transaction.amount) +
                  transaction.transactionCost +
                  (transaction.debt?.interest || 0)
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}