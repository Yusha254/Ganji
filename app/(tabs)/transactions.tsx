import { ThemedGradientBackground, View } from "@/components/Themed";
import FilterTabs from "@/components/transactions/FilterTabs";
import TransactionList from "@/components/transactions/TransactionList";
import ScreenLoader from "@/components/ui/ScreenLoader";
import { useTransactions } from "@/context/TransactionContext";
import { useEffect, useMemo, useState } from "react";

export default function TransactionsScreen() {
  const { transactions, loading } = useTransactions();
  const [showLoader, setShowLoader] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "received" | "sent" | "debt"
  >("all");

  useEffect(() => {
    if (!loading) {
      setShowLoader(false);
      return;
    }

    const t = setTimeout(() => setShowLoader(true), 150);
    return () => clearTimeout(t);
  }, [loading]);

  const filteredTransactions = useMemo(() => {
    switch (activeFilter) {
      case "received":
        return transactions.filter((t) => t.isIncome);

      case "sent":
        return transactions.filter((t) => !t.isIncome && !t.debt);

      case "debt":
        return transactions.filter((t) => !!t.debt);

      default:
        return transactions;
    }
  }, [activeFilter, transactions]);

  const counts = useMemo(
    () => ({
      all: transactions.length,
      received: transactions.filter((t) => t.isIncome && !t.debt).length,
      sent: transactions.filter((t) => !t.isIncome && !t.debt).length,
      debt: transactions.filter((t) => t.debt).length,
    }),
    [transactions],
  );

  return (
    <ThemedGradientBackground className="flex-1 pt-5">
      <View className="px-2 mb-4 flex-row justify-between">
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />
      </View>

      {loading && showLoader ? (
        <ScreenLoader label="Loading transactions…" />
      ) : (
        <TransactionList transactions={filteredTransactions} />
      )}
    </ThemedGradientBackground>
  );
}
