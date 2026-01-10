import FilterTabs from "@/components/FilterTabs";
import { ThemedGradientBackground, View } from "@/components/Themed";
import TransactionList from "@/components/TransactionList";
import { useTransactions } from "@/context/TransactionContext";
import { useMemo, useState } from "react";

export default function TransactionsScreen() {
  const { transactions, loading } = useTransactions();

  const [activeFilter, setActiveFilter] =
    useState<"all" | "received" | "sent" | "debt">("all");

  const filteredTransactions = useMemo(() => {
    switch (activeFilter) {
      case "received":
        return transactions.filter(
          t => t.isIncome && !t.debt
        );

      case "sent":
        return transactions.filter(
          t => !t.isIncome && !t.debt
        );

      case "debt":
        return transactions.filter(
          t => !!t.debt
        );

      default:
      return transactions;
    }
  }, [activeFilter, transactions]);


  const counts = {
    all: transactions.length,
    received: transactions.filter(
      t => t.isIncome && !t.debt
    ).length,
    sent: transactions.filter(
      t => !t.isIncome && !t.debt
    ).length,
    debt: transactions.filter(t => t.debt).length,
  };

  return (
    <ThemedGradientBackground className="flex-1 pt-5">

      <View className="px-2 mb-4 flex-row justify-between">
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />
      </View>

      <TransactionList
        transactions={filteredTransactions}
        loading={loading}
      />

    </ThemedGradientBackground>
  );
}
