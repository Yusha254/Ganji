import { ScrollView, Text, ThemedCard, View } from "@/components/Themed";
import TransactionCard from "@/components/transactions/TransactionCard";
import { AvailableMonth, getTransactionsPaginated } from "@/data";
import { TransactionListProps, TransactionWithDebt } from "@/interfaces";
import { toISODateTime } from "@/utils/DateUtils";
import Feather from "@expo/vector-icons/Feather";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable } from "react-native";



export default function TransactionList({
  transactions,
  availableMonths = [],
  isLoadingNextPage,
  hasNextPage,
  onLoadMore,
  isInitialLoading,
}: TransactionListProps) {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [manualLoadingMonths, setManualLoadingMonths] = useState<Set<string>>(new Set());
  const [manualData, setManualData] = useState<Record<string, TransactionWithDebt[]>>({});

  // Group transactions (from infinite scroll) by monthKey
  const grouped = useMemo(() => {
    const groups: Record<string, TransactionWithDebt[]> = {};

    transactions.forEach((t) => {
      const d = new Date(toISODateTime(t.date, t.time));
      const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;

      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(t);
    });

    return groups;
  }, [transactions]);

  // Auto-expand the most recent month on mount
  useEffect(() => {
    if (availableMonths.length > 0 && expandedMonths.size === 0) {
      toggleMonth(availableMonths[0].monthKey);
    }
  }, [availableMonths]);

  const toggleMonth = async (monthKey: string) => {
    const isNowOpen = !expandedMonths.has(monthKey);

    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(monthKey)) next.delete(monthKey);
      else next.add(monthKey);
      return next;
    });

    // On-Demand Fetching: If expanding and we don't have data yet
    if (isNowOpen && !grouped[monthKey] && !manualData[monthKey] && !manualLoadingMonths.has(monthKey)) {
      setManualLoadingMonths(prev => new Set(prev).add(monthKey));
      try {
        const firstPage = await getTransactionsPaginated(monthKey, 30, 0);
        setManualData(prev => ({ ...prev, [monthKey]: firstPage }));
      } catch (err) {
        console.error(`Failed to fetch on-demand for ${monthKey}:`, err);
      } finally {
        setManualLoadingMonths(prev => {
          const next = new Set(prev);
          next.delete(monthKey);
          return next;
        });
      }
    }
  };

  if (isInitialLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="mt-2 text-gray-500">Loading transactions...</Text>
      </View>
    );
  }

  if (availableMonths.length === 0) {
    return (
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-center" lightColor="rgb(163, 163, 163)" darkColor="rgb(163, 163, 163)">No transactions found</Text>
        </View>
      </ScrollView>
    );
  }

  const FlashListAlt = FlashList as any;

  return (
    <FlashListAlt
      data={availableMonths}
      extraData={manualData} // Ensure it rerenders when manual data is added
      keyExtractor={(item: AvailableMonth) => item.monthKey}
      estimatedItemSize={80}
      contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isLoadingNextPage ? (
          <View className="py-4">
            <ActivityIndicator size="small" color="#6366f1" />
          </View>
        ) : null
      }
      renderItem={({ item: month }: any) => {
        const monthKey = month.monthKey;
        const monthTx = grouped[monthKey] || manualData[monthKey] || [];
        const isOpen = expandedMonths.has(monthKey);
        const isLoadingManual = manualLoadingMonths.has(monthKey);

        // Approximate total for the month (only from what's loaded)
        const monthTotal = monthTx.reduce((sum, t) => {
          if (t.isTransfer) return sum;
          return sum + (t.isIncome ? t.amount : -t.amount);
        }, 0);

        return (
          <ThemedCard className="mb-4 px-0 py-0 overflow-hidden">
            <Pressable
              onPress={() => toggleMonth(monthKey)}
              className="flex-row justify-between items-center px-4 py-4"
            >
              <View>
                <Text className="text-base font-semibold">{month.label}</Text>
                <Text className="text-xs" lightColor="rgb(163, 163, 163)" darkColor="rgb(163, 163, 163)">
                  {month.count} transactions
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                <Text
                  className={`font-semibold`}
                  lightColor={monthTotal >= 0 ? "rgb(74,222,128)" : "rgb(248,113,113)"}
                  darkColor={monthTotal >= 0 ? "rgb(74,222,128)" : "rgb(248,113,113)"}
                >
                  {monthTotal !== 0 ? `${monthTotal >= 0 ? "+" : "-"}KSh${Math.abs(monthTotal).toFixed(2)}` : ""}
                </Text>

                <Feather
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="gray"
                />
              </View>
            </Pressable>

            {isOpen && (
              <View className="px-3 pb-3 flex-col gap-3">
                {isLoadingManual ? (
                  <View className="py-4 items-center">
                    <ActivityIndicator size="small" color="#6366f1" />
                  </View>
                ) : monthTx.length > 0 ? (
                  monthTx.map((tx) => (
                    <TransactionCard key={tx.code} transaction={tx} />
                  ))
                ) : (
                  <Text className="text-center text-gray-500 py-2">No data loaded yet</Text>
                )}
              </View>
            )}
          </ThemedCard>
        );
      }}
    />
  );
}
