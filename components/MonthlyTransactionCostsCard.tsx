import { Text, ThemedCard, View } from "@/components/Themed";
import { useAnalytics } from "@/context/AnalyticsContext";
import { formatMonth } from "@/utils/DateUtils";

export default function MonthlyTransactionCostsCard() {
  const { monthlyTransactionCosts, monthlyTotals } = useAnalytics();

  const months = Object.keys(monthlyTransactionCosts || {})
    .sort((a, b) => (a < b ? 1 : -1)) // newest first
    .slice(0, 6); // show last 6 months

  return (
    <ThemedCard className="mb-4">
      {/* Title */}
      <Text className="text-sm text-gray-400">
        Monthly Transaction Costs
      </Text>

      {/* List */}
      <View className="mt-3 gap-2">
        {months.map((monthKey) => {
          const cost = monthlyTransactionCosts[monthKey];
          //will this work. it's how its defined in context. no count variable
          const monthlyTotal =
            (monthlyTotals?.[monthKey]?.received ?? 0) +
            (monthlyTotals?.[monthKey]?.sent ?? 0);

          return (
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-300">
                {formatMonth(monthKey)}
              </Text>

              <View className="items-end">
                <Text className="text-base font-medium">
                  KSh {cost?.toFixed(2) || "0.00"}
                </Text>
                <Text className="text-xs text-gray-400">
                  {monthlyTotal} transactions
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ThemedCard>
  );
}
