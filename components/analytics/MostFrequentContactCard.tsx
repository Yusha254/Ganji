import { Text, ThemedCard, View } from "@/components/Themed";
import { MostFrequentContactCardProps } from "@/interfaces";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable } from "react-native";

export default function MostFrequentContactsCard({
  contacts,
  trackedContacts,
  onToggleTrack,
}: MostFrequentContactCardProps) {
  return (
    <View className="mb-6">
      {/* Section Title */}
      <View className="flex-row items-center gap-2 mb-4">
        <FontAwesome name="users" size={20} color="rgb(192,132,252)" />
        <Text className="text-lg font-semibold">Most Frequent Contacts</Text>
      </View>

      {/* List of Contacts */}
      {contacts.map((contact) => {
        const avgFee = contact.count > 0 ? contact.totalAmount / contact.count : 0;
        const totalSent = contact.totalSent ?? 0;
        const totalReceived = contact.totalReceived ?? 0;
        const netAmount = totalReceived - totalSent;
        const isTracked = trackedContacts.includes(contact.name);

        return (
          <ThemedCard key={contact.name} className="mb-4">
            {/* Top Row */}
            <View className="flex-row justify-between mb-2">
              <View className="flex-row items-center gap-3 flex-1">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  lightColor="rgba(192, 132, 252, 0.2)"
                  darkColor="rgba(192, 132, 252, 0.2)"
                >
                  <Text
                    className="text-sm"
                    lightColor="rgb(216, 180, 254)"
                    darkColor="rgb(216, 180, 254)"
                  >
                    #{contact.rank}
                  </Text>
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-medium" numberOfLines={1}>
                      {contact.name}
                    </Text>
                    {isTracked && (
                      <FontAwesome name="star" size={16} color="rgb(234,179,8)" />
                    )}
                  </View>
                  <Text
                    className="text-sm"
                    lightColor="rgb(163, 163, 163)"
                    darkColor="rgb(163, 163, 163)"
                  >
                    {contact.count} transaction{contact.count !== 1 ? "s" : ""}
                  </Text>
                </View>
              </View>

              <Pressable
                className="p-2 rounded-lg"
                onPress={() => onToggleTrack(contact.name)}
              >
                <FontAwesome
                  name={isTracked ? "star" : "star-o"}
                  size={20}
                  color={isTracked ? "rgb(234,179,8)" : "rgb(163,163,163)"}
                />
              </Pressable>
            </View>

            {/* Stats Grid */}
            <View className="flex-row flex-wrap gap-3">
              <View className="w-[48%]">
                <Text
                  className="text-xs"
                  lightColor="rgb(163, 163, 163)"
                  darkColor="rgb(163, 163, 163)"
                >
                  Total Spent
                </Text>
                <Text lightColor="rgb(248, 113, 113)" darkColor="rgb(248, 113, 113)">
                  KSh {totalSent.toLocaleString()}
                </Text>
              </View>

              <View className="w-[48%]">
                <Text
                  className="text-xs"
                  lightColor="rgb(163, 163, 163)"
                  darkColor="rgb(163, 163, 163)"
                >
                  Total Received
                </Text>
                <Text lightColor="rgb(74, 222, 128)" darkColor="rgb(74, 222, 128)">
                  KSh {totalReceived.toLocaleString()}
                </Text>
              </View>

              <View className="w-[48%]">
                <Text
                  className="text-xs"
                  lightColor="rgb(163, 163, 163)"
                  darkColor="rgb(163, 163, 163)"
                >
                  Net Amount
                </Text>
                <Text
                  lightColor={
                    netAmount >= 0 ? "rgb(74, 222, 128)" : "rgb(248, 113, 113)"
                  }
                  darkColor={
                    netAmount >= 0 ? "rgb(74, 222, 128)" : "rgb(248, 113, 113)"
                  }
                >
                  KSh {netAmount.toLocaleString()}
                </Text>
              </View>

              <View className="w-[48%]">
                <Text
                  className="text-xs"
                  lightColor="rgb(163, 163, 163)"
                  darkColor="rgb(163, 163, 163)"
                >
                  Avg Fee
                </Text>
                <Text lightColor="rgb(216, 180, 254)" darkColor="rgb(216, 180, 254)">
                  KSh {avgFee.toFixed(2)}
                </Text>
              </View>
            </View>
          </ThemedCard>
        );
      })}
    </View>
  );
}
