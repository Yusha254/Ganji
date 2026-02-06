import { Text, ThemedCard, View } from "@/components/Themed";
import { MonthlyTransactionCostsCardProps } from "@/interfaces";
import { formatMonth } from "@/utils/DateUtils";

export default function MonthlyTransactionCostsCard({
  monthlyTransactionCosts,
  monthlyTransactionCounts,
}: MonthlyTransactionCostsCardProps) {
  // Get last 6 months, newest first
  const months = Object.keys(monthlyTransactionCosts || {})
    .sort((a, b) => (a < b ? 1 : -1))
    .slice(0, 6);

  // If no months, show empty state
  if (months.length === 0) {
    return (
      <ThemedCard className="mb-4">
        <Text className="text-sm" lightColor="#6b7280" darkColor="#9ca3af">
          Monthly Transaction Costs
        </Text>
        <Text className="mt-3 text-sm" lightColor="#6b7280" darkColor="#9ca3af">
          No data available
        </Text>
      </ThemedCard>
    );
  }

  return (
    <ThemedCard className="mb-4">
      {/* Title */}
      <Text className="text-sm" lightColor="#6b7280" darkColor="#9ca3af">
        Monthly Transaction Costs
      </Text>

      {/* List of months */}
      <View className="mt-3 gap-3">
        {months.map((monthKey) => {
          const cost = monthlyTransactionCosts[monthKey] ?? 0;
          const count = monthlyTransactionCounts[monthKey] ?? 0;

          return (
            <View
              key={monthKey}
              className="flex-row justify-between items-center"
            >
              <Text
                className="text-sm"
                lightColor="#4b5563"
                darkColor="#d1d5db"
              >
                {formatMonth(monthKey)}
              </Text>

              <View className="items-end">
                <Text className="text-base font-medium">
                  KSh {cost.toFixed(2)}
                </Text>
                <Text
                  className="text-xs"
                  lightColor="#9ca3af"
                  darkColor="#9ca3af"
                >
                  {count} transaction{count !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ThemedCard>
  );
}
