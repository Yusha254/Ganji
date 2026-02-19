import { ThemedGradientBackground, View } from "@/components/Themed";
import FilterTabs from "@/components/transactions/FilterTabs";
import TransactionList from "@/components/transactions/TransactionList";
import ScreenLoader from "@/components/ui/ScreenLoader";
import { useAvailableMonths, useInfiniteTransactions } from "@/hooks/useTransactionsQuery";
import { useMemo, useState } from "react";

export default function TransactionsScreen() {
  const { data: monthsData, isLoading: isLoadingMonths } = useAvailableMonths();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingTx,
    isError,
  } = useInfiniteTransactions() as any;

  const [activeFilter, setActiveFilter] = useState<"all" | "received" | "sent" | "debt">("all");

  // Flatten transactions and counts for filtering
  const { filteredTransactions, counts } = useMemo(() => {
    const allTx = data?.pages.flatMap((page: any) => page.transactions) ?? [];

    // Note: Accurate global counts are hard with infinite scroll.
    // We'll calculate counts based on what's currently loaded.
    const counts = { all: allTx.length, received: 0, sent: 0, debt: 0 };
    const filtered: typeof allTx = [];

    for (const t of allTx) {
      if (t.isIncome && !t.debt) counts.received++;
      if (!t.isIncome && !t.debt) counts.sent++;
      if (t.debt) counts.debt++;

      if (activeFilter === "all") filtered.push(t);
      else if (activeFilter === "received" && t.isIncome && !t.debt) filtered.push(t);
      else if (activeFilter === "sent" && !t.isIncome && !t.debt) filtered.push(t);
      else if (activeFilter === "debt" && t.debt) filtered.push(t);
    }

    return { filteredTransactions: filtered, counts };
  }, [data, activeFilter]);

  if (isError) {
    return (
      <ThemedGradientBackground className="flex-1 justify-center items-center">
        <ScreenLoader label="Error loading transactions. Please try again." />
      </ThemedGradientBackground>
    );
  }

  const isLoading = isLoadingMonths || (isLoadingTx && (!data?.pages || data.pages[0]?.transactions?.length === 0));

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
        availableMonths={monthsData}
        isInitialLoading={isLoading}
        isLoadingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        onLoadMore={fetchNextPage}
      />
    </ThemedGradientBackground>
  );
}
