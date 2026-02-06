import { ScrollView, Text, ThemedCard, View } from "@/components/Themed";
import TransactionCard from "@/components/transactions/TransactionCard";
import { Transaction, TransactionListProps } from "@/interfaces";
import { toISODateTime } from "@/utils/DateUtils";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable } from "react-native";

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  // Group transactions by "Month Year" e.g. "August 2025"
  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};

    transactions.forEach((t) => {
      // Attempt to construct a Date from your date/time strings.
      // If your date format is ambiguous, adapt the parsing logic here.
      const d = new Date(toISODateTime(t.date, t.time));
      const key = `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`;

      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });

    return groups;
  }, [transactions]);

  // Sort months newest -> oldest
  const sortedMonths = useMemo(() => {
    const keys = Object.keys(grouped);
    keys.sort((a, b) => {
      const ga = grouped[a][0];
      const gb = grouped[b][0];
      const da = new Date(toISODateTime(ga.date, ga.time)).getTime();
      const db = new Date(toISODateTime(gb.date, gb.time)).getTime();
      return db - da;
    });
    return keys;
  }, [grouped]);

  // Auto-expand the most recent month once on mount / when sortedMonths changes
  useEffect(() => {
    if (sortedMonths.length === 0) return;
    setExpandedMonths((prev) => {
      if (prev.size > 0) return prev;
      return new Set([sortedMonths[0]]);
    });
  }, [sortedMonths]);

  const toggleMonth = (month: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  };

  if (sortedMonths.length === 0) {
    return (
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-center" lightColor="rgb(163, 163, 163)" darkColor="rgb(163, 163, 163)">No transactions</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    // Themed ScrollView keeps background transparent and hides scrollbars
    <FlatList
      data={sortedMonths}
      keyExtractor={(item: string) => item}
      contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
      renderItem={({ item: monthKey }: { item: string }) => {
        const monthTx = grouped[monthKey];
        const isOpen = expandedMonths.has(monthKey);

        // month total (sum of amounts)
        const monthTotal = monthTx.reduce((sum, t) => {
          // treat income as positive, spending as negative
          // ignore transfers from the total sum
          if (t.isTransfer) return sum;
          return sum + (t.isIncome ? t.amount : -t.amount);
        }, 0);

        // sort transactions: newest -> oldest
        const sortedTx = [...monthTx].sort((a, b) => {
          const da = new Date(toISODateTime(a.date, a.time)).getTime();
          const db = new Date(toISODateTime(b.date, b.time)).getTime();
          return db - da;
        });

        return (
          <ThemedCard className="mb-4 px-0 py-0">
            {/* Header row */}
            <Pressable
              onPress={() => toggleMonth(monthKey)}
              className="flex-row justify-between items-center px-4 py-4"
            >
              <View>
                <Text className="text-base font-semibold">{monthKey}</Text>
                <Text className="text-xs" lightColor="rgb(163, 163, 163)" darkColor="rgb(163, 163, 163)">
                  {monthTx.length} transactions
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                <Text
                  className={`font-semibold`}
                  lightColor={monthTotal >= 0 ? "rgb(74,222,128)" : "rgb(248,113,113)"}
                  darkColor={monthTotal >= 0 ? "rgb(74,222,128)" : "rgb(248,113,113)"}
                >
                  {monthTotal >= 0 ? "+" : "-"}KSh
                  {Math.abs(monthTotal).toFixed(2)}
                </Text>

                <Feather
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="gray"
                />
              </View>
            </Pressable>

            {/* Transactions list for the month */}
            {isOpen && (
              <View className="px-3 pb-3 flex-col gap-3">
                {sortedTx.map((tx) => (
                  <TransactionCard key={tx.code} transaction={tx} />
                ))}
              </View>
            )}
          </ThemedCard>
        );
      }}
    />
  );
}
