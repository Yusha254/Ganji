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
          <Text className="text-sm mb-1" lightColor="#6b7280" darkColor="#9ca3af">
            Average Cost per Transaction
          </Text>

          <Text className="text-xl font-semibold">
            KSh {averageTransactionCost.toFixed(2)}
          </Text>
        </View>

        {/* Icon */}
        <View className="rounded-full p-3" lightColor="rgba(168, 85, 247, 0.2)" darkColor="rgba(168, 85, 247, 0.2)">
          <Feather name="dollar-sign" size={24} color="rgb(192,132,252)" />
        </View>
      </View>
    </ThemedCard>
  );
}
