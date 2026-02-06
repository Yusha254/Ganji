

import { Text, ThemedCard, View } from "@/components/Themed";
import { HighestSpendingContactsCardProps } from "@/interfaces";
import { FontAwesome5 } from "@expo/vector-icons";

export default function HighestSpendingContactsCard({
  contacts,
}: HighestSpendingContactsCardProps) {
  return (
    <View className="mb-6">
      {/* Section Title */}
      <View className="flex-row items-center gap-2 mb-4">
        <FontAwesome5 name="chart-line" size={20} color="rgb(244,114,182)" />
        <Text className="text-lg font-semibold">Highest Spending</Text>
      </View>

      {contacts.map((contact) => {
        const avgPerTransaction =
          contact.count > 0 ? contact.totalAmount / contact.count : 0;

        return (
          <ThemedCard
            key={`${contact.name}-${contact.rank}`}
            className="mb-4"
          >
            <View className="flex-row items-center justify-between">
              {/* Left */}
              <View className="flex-row items-center gap-3 flex-1">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  lightColor="#f472b633"
                  darkColor="#f472b633"
                >
                  <Text
                    className="text-sm font-bold"
                    lightColor="#f472b6"
                    darkColor="#f472b6"
                  >
                    #{contact.rank}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className="font-medium" numberOfLines={1}>
                    {contact.name}
                  </Text>
                  <Text
                    className="text-sm"
                    lightColor="#9ca3af"
                    darkColor="#9ca3af"
                  >
                    {contact.count} transactions
                  </Text>
                </View>
              </View>

              {/* Right */}
              <View className="items-end">
                <Text
                  className="font-medium"
                  lightColor="#f87171"
                  darkColor="#f87171"
                >
                  KSh {contact.totalAmount.toLocaleString()}
                </Text>
                <Text
                  className="text-xs"
                  lightColor="#9ca3af"
                  darkColor="#9ca3af"
                >
                  KSh {avgPerTransaction.toFixed(2)} avg / tx
                </Text>
              </View>
            </View>
          </ThemedCard>
        );
      })}
    </View>
  );
}
