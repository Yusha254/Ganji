import FilterTabs from "@/components/FilterTabs";
import { ThemedGradientBackground, View } from "@/components/Themed";
import TransactionList from "@/components/TransactionList";
import { sampleTransactions } from "@/data";
import { useMemo, useState } from "react";

export default function TransactionsScreen() {
  const [activeFilter, setActiveFilter] =
    useState<"all" | "received" | "sent" | "debt">("all");

  const counts = {
    all: 42,
    received: 12,
    sent: 25,
    debt: 5,
  };

  const filteredTransactions = useMemo(() => {
    switch (activeFilter) {
      case "received":
        return sampleTransactions.filter(t => t.isIncome && !t.isDebt);
      case "sent":
        return sampleTransactions.filter(t => !t.isIncome && !t.isDebt);
      case "debt":
        return sampleTransactions.filter(t => t.isDebt);
      default:
        return sampleTransactions;
    }
  }, [activeFilter]);

  return (
    <ThemedGradientBackground className="flex-1 pt-5">
      {/* Filters */}
      <View className="px-2 mb-4 flex-row justify-between">
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />
      </View>

      {/* Transaction list */}
      <TransactionList transactions={filteredTransactions} />
    </ThemedGradientBackground>
  );
}
