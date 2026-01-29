import { Text, ThemedCard, View } from "@/components/Themed";
import { AverageTransactionCostCardProps } from "@/interfaces";
import { Feather } from "@expo/vector-icons";

export default function AverageTransactionCostCard({
  averageTransactionCost,
}: AverageTransactionCostCardProps) {
  return (
    <ThemedCard className="mb-4">
      <View className="flex-row items-center justify-between">
        {/* Left */}
        <View>
          <Text className="text-sm text-gray-400 mb-1">
            Average Cost per Transaction
          </Text>

          <Text className="text-xl font-semibold">
            KSh {averageTransactionCost.toFixed(2)}
          </Text>
        </View>

        {/* Icon */}
        <View className="p-3 rounded-full bg-purple-400/20">
          <Feather name="dollar-sign" size={24} color="rgb(192,132,252)" />
        </View>
      </View>
    </ThemedCard>
  );
}
