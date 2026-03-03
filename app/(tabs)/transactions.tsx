import { ThemedGradientBackground, View } from "@/components/Themed";
import FilterTabs from "@/components/transactions/FilterTabs";
import TransactionList from "@/components/transactions/TransactionList";
import ScreenLoader from "@/components/ui/ScreenLoader";
import { useAvailableMonths, useInfiniteTransactions, useTransactionCounts } from "@/hooks/useTransactionsQuery";
import { useMemo, useState } from "react";

export default function TransactionsScreen() {
  const { data: monthsData, isLoading: isLoadingMonths } = useAvailableMonths();
  const { data: countsData, isLoading: isLoadingCounts } = useTransactionCounts();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingTx,
    isError,
  } = useInfiniteTransactions() as any;

  const [activeFilter, setActiveFilter] = useState<"all" | "received" | "sent" | "debt">("all");

  // Filter transactions based on active tab
  const filteredTransactions = useMemo(() => {
    const allTx = data?.pages.flatMap((page: any) => page.transactions) ?? [];

    return allTx.filter((t: any) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "received") return t.isIncome && !t.debt;
      if (activeFilter === "sent") return !t.isIncome && !t.debt;
      if (activeFilter === "debt") return !!t.debt;
      return true;
    });
  }, [data, activeFilter]);

  const counts = countsData || { all: 0, received: 0, sent: 0, debt: 0 };

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
