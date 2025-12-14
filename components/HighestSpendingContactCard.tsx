import { Text, ThemedCard, View } from "@/components/Themed";
import { FontAwesome5 } from "@expo/vector-icons";

export default function HighestSpendingContactsCard() {
  return (
    <View className="mb-6">
      {/* Section Title */}
      <View className="flex-row items-center gap-2 mb-4">
        <FontAwesome5
          name="chart-line"
          size={20}
          color="rgb(244,114,182)"
        />
        <Text className="text-lg font-semibold">
          Highest Spending
        </Text>
      </View>

      <ThemedCard>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-8 h-8 rounded-full bg-pink-400/20 items-center justify-center">
              <Text className="text-sm text-pink-400">#1</Text>
            </View>

            <View className="flex-1">
              <Text
                className="font-medium"
                numberOfLines={1}
              >
                Jane Smith
              </Text>
              <Text className="text-sm text-gray-400">
                22 transactions
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-red-400">
              KSh 18,900
            </Text>
            <Text className="text-xs text-gray-400">
              KSh 26.40 avg fee
            </Text>
          </View>
        </View>
      </ThemedCard>
    </View>
  );
}
