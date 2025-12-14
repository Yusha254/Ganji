import { Text, ThemedCard, View } from "@/components/Themed";

export default function MonthlyTransactionCostsCard() {
  return (
    <ThemedCard className="mb-4">
      {/* Title */}
      <Text className="text-sm text-gray-400">
        Monthly Transaction Costs
      </Text>

      {/* List */}
      <View className="mt-3 gap-2">
        {/* August */}
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-300">
            August 2025
          </Text>

          <View className="items-end">
            <Text className="text-base font-medium">
              KSh 420.00
            </Text>
            <Text className="text-xs text-gray-400">
              18 transactions
            </Text>
          </View>
        </View>

        {/* July */}
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-300">
            July 2025
          </Text>

          <View className="items-end">
            <Text className="text-base font-medium">
              KSh 310.50
            </Text>
            <Text className="text-xs text-gray-400">
              14 transactions
            </Text>
          </View>
        </View>

        {/* June */}
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-300">
            June 2025
          </Text>

          <View className="items-end">
            <Text className="text-base font-medium">
              KSh 198.75
            </Text>
            <Text className="text-xs text-gray-400">
              9 transactions
            </Text>
          </View>
        </View>
      </View>
    </ThemedCard>
  );
}
