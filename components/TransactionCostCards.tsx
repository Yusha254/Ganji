import { Text, View } from "@/components/Themed";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function TransactionCostsCards() {
  return (
    <View className="pt-4 mb-4">
      {/* Section Title */}
      <View className="flex-row items-center gap-2 mb-4">
        <MaterialIcons name="receipt" size={20} color="rgb(192,132,252)" />
        <Text className="text-lg font-semibold">
          Transaction Costs
        </Text>
      </View>

      {/* Cards Grid */}
      <View className="flex-row gap-3">
        {/* Total Fees */}
        rounded-2xl
        <View className="rounded-2xl overflow-hidden border border-purple-300/40 flex-1">
            <LinearGradient
                colors={[
                    "rgba(168,85,247,0.2)",
                    "rgba(236,72,153,0.2)",
                ]}
                className="p-4"
            >
                <Text className="text-sm text-purple-300 mb-1">
                    Total Fees Paid
                </Text>

                <Text className="text-2xl font-semibold mb-1">
                    KSh 1,240.00
                </Text>

                <Text className="text-xs text-gray-400">
                    Across 42 transactions
                </Text>
            </LinearGradient>
        </View>

        {/* Debt Costs */}
        <View className="rounded-2xl overflow-hidden border border-orange-300/40 flex-1">
            <LinearGradient
                colors={[
                    "rgba(249,115,22,0.2)",
                    "rgba(239,68,68,0.2)",
                ]}
                className="p-4"
            >
                <Text className="text-sm text-orange-300 mb-1">
                    Debt Costs
                </Text>

                <Text className="text-2xl font-semibold mb-1">
                    KSh 320.00
                </Text>

                <Text className="text-xs text-gray-400">
                    Additional fees
                </Text>
            </LinearGradient>
        </View>
      </View>
    </View>
  );
}
