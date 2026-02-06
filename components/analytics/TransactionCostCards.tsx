import { Text, View } from "@/components/Themed";
import { TransactionCostCardsProps } from "@/interfaces";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function TransactionCostsCards({
  totalTransactionCost,
  totalTransactions,
  totalDebtCost,
}: TransactionCostCardsProps) {
  return (
    <View className="pt-4 mb-4">
      {/* Section Title */}
      <View className="flex-row items-center gap-2 mb-4">
        <MaterialIcons name="receipt" size={20} color="rgb(192,132,252)" />
        <Text className="text-lg font-semibold">Transaction Costs</Text>
      </View>

      {/* Cards Grid */}
      <View className="flex-row gap-3">
        {/* Total Fees */}
        <View
          className="rounded-2xl overflow-hidden border flex-1"
          lightBorderColor="rgb(126, 34, 206)"
          darkBorderColor="#d8b4fe66"
        >
          <LinearGradient
            colors={["rgba(168,85,247,0.2)", "rgba(236,72,153,0.2)"]}
            className="p-4"
          >
            <Text
              className="text-sm mb-1"
              lightColor="rgb(126, 34, 206)"
              darkColor="#d8b4fe"
            >
              Total Fees Paid
            </Text>

            <Text className="text-2xl font-semibold mb-1">
              KSh{" "}
              {totalTransactionCost.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>

            <Text className="text-xs" lightColor="#576f97ff" darkColor="#9ca3af">
              Across {totalTransactions} transaction
              {totalTransactions !== 1 ? "s" : ""}
            </Text>
          </LinearGradient>
        </View>

        {/* Debt Costs Placeholder */}
        <View
          className="rounded-2xl overflow-hidden border flex-1"
          lightBorderColor="#fdbb74ff"
          darkBorderColor="#fdba7466"
        >
          <LinearGradient
            colors={["rgba(249,115,22,0.2)", "rgba(239,68,68,0.2)"]}
            className="p-4"
          >
            <Text
              className="text-sm mb-1"
              lightColor="#f79429ff"
              darkColor="#fdba74"
            >
              Debt Costs
            </Text>

            <Text className="text-2xl font-semibold mb-1">
              KSh{" "}
              {totalDebtCost.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>

            <Text className="text-xs" lightColor="#576f97ff" darkColor="#9ca3af">
              Additional fees
            </Text>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}
