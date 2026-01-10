import { Text, View } from "@/components/Themed";
import { TransactionWithDebt } from "@/interfaces";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { Pressable } from "react-native";

export default function TransactionCard({ transaction }: { transaction: TransactionWithDebt }) {
  const [expanded, setExpanded] = useState(false);

  const isReceived = transaction.amount > 0;
  const isDebt = !!transaction.debt;

  return (
    <Pressable onPress={() => setExpanded((p) => !p)}>
      <View
        className="
          mb-3 
          rounded-2xl 
          p-4
          border 
          bg-white/5 
          dark:bg-white/5 
          border-white/10 
          dark:border-white/10
        "
      >
        {/* Top Row */}
        <View className="flex-row justify-between">
          
          {/* Left Section */}
          <View className="flex-row flex-1 gap-3 items-start">
            
            {/* Icon */}
            <View
              className={`
                p-2 rounded-xl 
                ${isReceived ? "bg-green-400/20" : "bg-red-400/20"}
              `}
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
                <Text className="text-xs text-gray-400">
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
                ${isReceived ? "text-green-400" : "text-red-400"}
              `}
            >
              {isReceived ? "+" : "-"}KSh {Math.abs(transaction.amount)}
            </Text>

            {transaction.transactionCost > 0 && (
              <Text className="text-xs text-gray-400">
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
              border-t border-white/10 
              dark:border-white/10
              gap-3
            "
          >
            {/* Transaction Code */}
            <View className="flex-row justify-between">
              <View className="flex-row gap-2 items-center">
                <Feather name="hash" size={16} color="gray" />
                <Text className="text-gray-400">Code</Text>
              </View>

              <Text className="text-purple-300">
                {transaction.code}
              </Text>
            </View>

            {/* Transaction Cost */}
            <View className="flex-row justify-between">
              <Text className="text-gray-400">Transaction Cost</Text>
              <Text className="text-gray-300">
                KSh {transaction.transactionCost}
              </Text>
            </View>

            {/* Debt Cost (Optional) */}
            {isDebt && (
              <View className="flex-row justify-between">
                <View className="flex-row gap-2 items-center">
                  <Feather name="alert-circle" size={16} color="rgb(251,146,60)" />
                  <Text className="text-orange-300">Debt Cost</Text>
                </View>
                <Text className="text-orange-300">
                  KSh {transaction.debt?.interest}
                </Text>
              </View>
            )}

            {/* TOTAL */}
            <View
              className="
                mt-2 p-3 rounded-lg 
                bg-white/5 dark:bg-white/5
              "
            >
              <Text className="text-xs text-gray-400 mb-1">Total</Text>

              <Text
                className={`
                  text-xl font-bold
                  ${isReceived ? "text-green-400" : "text-red-400"}
                `}
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