// RecentActivity.tsx
import { Text, ThemedCard, View } from "@/components/Themed";
import { RecentActivityProps } from "@/interfaces";
import { formatTimeLabel } from "@/utils/analytics/formatTimeLabel";
import React from "react";

export default function RecentActivity({ transactions }: RecentActivityProps) {
  return (
    <View className="mx-4">
      <Text className="text-lg font-semibold mb-3">Recent Activity</Text>

      {transactions.map((tx) => {
        const amountPrefix = tx.isIncome ? "+" : "-";
        const amountColor = tx.isIncome ? "#4ade80" : "#f87171";

        return (
          <ThemedCard className="flex-row items-center mb-3" key={tx.code}>
            {/* Labels */}
            <View className="flex-1">
              <Text className="text-base font-medium">{tx.name}</Text>
              <Text className="text-sm opacity-70">
                {formatTimeLabel(tx.date, tx.time)}
              </Text>
            </View>

            {/* Amount */}
            <Text
              className="text-base font-semibold"
              lightColor={amountColor}
              darkColor={amountColor}
            >
              {amountPrefix} {tx.amount.toLocaleString()}
            </Text>
          </ThemedCard>
        );
      })}

      {transactions.length === 0 && (
        <Text className="opacity-60 text-sm">No recent transactions</Text>
      )}
    </View>
  );
}
