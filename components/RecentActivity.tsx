// RecentActivity.tsx

import { Text, ThemedCard, View } from "@/components/Themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

type MCIIconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];


const activities: {
  id: number;
  label: string;
  amount: string;
  time: string;
  icon: MCIIconName;
  color: string;
}[] = [
  {
    id: 1,
    label: "Payment",
    amount: "- KES 1,200",
    time: "10:24 AM",
    icon: "receipt-outline",
    color: "rgb(192, 132, 252)", // purple
  },
  {
    id: 2,
    label: "Salary",
    amount: "+ KES 25,000",
    time: "09:10 AM",
    icon: "trending-up",
    color: "rgb(244, 114, 182)", // pink
  },
  {
    id: 3,
    label: "Group Contribution",
    amount: "+ KES 3,400",
    time: "Yesterday",
    icon: "account-multiple-outline",
    color: "rgb(74, 222, 128)", // green
  },
];

export default function RecentActivity() {
  return (
    <View className="mx-4">
      <Text className="text-lg font-semibold mb-3">Recent Activity</Text>

      {activities.map((item) => (
        <ThemedCard className="flex-row items-center mb-3" key={item.id}>

          {/* Labels */}
          <View className="flex-1">
            <Text className="text-base font-medium">{item.label}</Text>
            <Text className="text-sm opacity-70">{item.time}</Text>
          </View>

          {/* Amount */}
          <Text className="text-base font-semibold">{item.amount}</Text>
        </ThemedCard>
      ))}
    </View>
  );
}
