import { Text, ThemedCard, View } from "@/components/Themed";
import { MostFrequentContactCardProps } from "@/interfaces";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable } from "react-native";

export default function MostFrequentContactsCard({
  topContact,
}: MostFrequentContactCardProps) {
  const avgFee = topContact.count > 0 ? topContact.totalAmount / topContact.count : 0;
  const totalSent = topContact.totalSent ?? 0;
  const totalReceived = topContact.totalReceived ?? 0;
  const netAmount = totalReceived - totalSent;

  return (
    <View className="mb-6">
      {/* Section Title */}
      <View className="flex-row items-center gap-2 mb-4">
        <FontAwesome name="users" size={20} color="rgb(192,132,252)" />
        <Text className="text-lg font-semibold">Most Frequent Contacts</Text>
      </View>

      {/* Top Contact Card */}
      <ThemedCard className="mb-2">
        {/* Top Row */}
        <View className="flex-row justify-between mb-2">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-8 h-8 rounded-full bg-purple-400/20 items-center justify-center">
              <Text className="text-sm text-purple-300">#{topContact.rank}</Text>
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="font-medium" numberOfLines={1}>
                  {topContact.name}
                </Text>
                <FontAwesome name="star" size={16} color="rgb(234,179,8)" />
              </View>
              <Text className="text-sm text-gray-400">
                {topContact.count} transaction{topContact.count !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          <Pressable className="p-2 rounded-lg">
            <FontAwesome name="star" size={20} color="rgb(234,179,8)" />
          </Pressable>
        </View>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap gap-3">
          <View className="w-[48%]">
            <Text className="text-xs text-gray-400">Total Spent</Text>
            <Text className="text-red-400">
              KSh {totalSent.toLocaleString()}
            </Text>
          </View>

          <View className="w-[48%]">
            <Text className="text-xs text-gray-400">Total Received</Text>
            <Text className="text-green-400">
              KSh {totalReceived.toLocaleString()}
            </Text>
          </View>

          <View className="w-[48%]">
            <Text className="text-xs text-gray-400">Net Amount</Text>
            <Text
              className={netAmount >= 0 ? "text-green-400" : "text-red-400"}
            >
              KSh {netAmount.toLocaleString()}
            </Text>
          </View>

          <View className="w-[48%]">
            <Text className="text-xs text-gray-400">Avg Fee</Text>
            <Text className="text-purple-300">KSh {avgFee.toFixed(2)}</Text>
          </View>
        </View>
      </ThemedCard>
    </View>
  );
}
