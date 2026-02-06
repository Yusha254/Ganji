import {
    Text,
    ThemedTrackedContactsGradient,
    View,
} from "@/components/Themed";
import { TrackedContactsCardProps } from "@/interfaces";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable } from "react-native";

export default function TrackedContactsCard({
    contacts,
    trackedContacts,
    onToggleTrack,
}: TrackedContactsCardProps) {
    if (trackedContacts.length === 0) return null;

    // Filter contacts to show only tracked ones
    // We also need to handle contacts that are tracked but NOT in the provided 'contacts' list (top 10)
    // Actually, 'contacts' from analytics.contacts.mostFrequentContacts contains ALL contacts usually,
    // but building the list here. Let's assume 'contacts' passed is the full list or at least enough.

    const displayContacts = trackedContacts.map(name => {
        const contact = contacts.find(c => c.name === name);
        return contact;
    }).filter(Boolean).sort((a, b) => (a?.rank || 0) - (b?.rank || 0));

    if (displayContacts.length === 0) return null;

    return (
        <View className="mb-6">
            {/* Section title */}
            <View className="mb-4 flex-row items-center gap-2">
                <FontAwesome
                    name="star"
                    size={20}
                    color="rgb(234, 179, 8)"
                />
                <Text className="text-lg font-semibold">
                    Tracked Contacts
                </Text>
            </View>

            {/* List of Tracked Contacts */}
            {displayContacts.map((contact) => {
                if (!contact) return null;
                const isTop10 = contact.rank <= 10;

                return (
                    <View key={contact.name} className="mb-4 overflow-hidden rounded-2xl border" lightBorderColor="rgba(250, 204, 21, 0.6)" darkBorderColor="rgba(250, 204, 21, 0.6)">
                        <ThemedTrackedContactsGradient>
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center space-x-3 flex-1">
                                    <View className="w-8 h-8 rounded-full items-center justify-center mr-3" lightColor="rgba(250, 204, 21, 0.2)" darkColor="rgba(250, 204, 21, 0.2)">
                                        <Text className="text-sm font-bold" lightColor="rgb(234, 179, 8)" darkColor="rgb(234, 179, 8)">#{contact.rank}</Text>
                                    </View>

                                    <View className="flex-1">
                                        <Text className="font-medium" numberOfLines={1}>
                                            {contact.name}
                                        </Text>
                                        <Text className="text-xs" lightColor="rgba(82, 82, 82, 1)" darkColor="rgba(163, 163, 163, 1)">
                                            {contact.count} transactions • KSh {contact.totalAmount.toLocaleString()}
                                        </Text>
                                        {!isTop10 && (
                                            <Text className="text-[10px] mt-0.5 italic" lightColor="rgb(234, 179, 8)" darkColor="rgb(234, 179, 8)">
                                                Ranked #{contact.rank} overall
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                <Pressable
                                    className="p-2"
                                    onPress={() => onToggleTrack(contact.name)}
                                >
                                    <FontAwesome name="star" size={20} color="rgb(234, 179, 8)" />
                                </Pressable>
                            </View>
                        </ThemedTrackedContactsGradient>
                    </View>
                );
            })}
        </View>
    );
}
