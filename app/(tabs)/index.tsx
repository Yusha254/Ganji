import BalanceCard from "@/components/home/BalanceCard";
import MetricCards from "@/components/home/MetricCards";
import RecentActivity from "@/components/home/RecentActivity";
import TopContactCard from "@/components/home/TopContactCard";
import { ScrollView, ThemedGradientBackground } from "@/components/Themed";
import ScreenLoader from "@/components/ui/ScreenLoader";
import { useAnalytics } from "@/context/AnalyticsContext";
import { useTransactions } from "@/context/TransactionContext";
import { useMemo } from "react";

export default function TabOneScreen() {
  const { analytics, range } = useAnalytics();
  const { transactions, loading } = useTransactions();

  // Compute range label
  const rangeLabel = useMemo(() => {
    switch (range) {
      case "monthly":
        return "This Month";
      case "yearly":
        return "This Year";
      case "allTime":
        return "All Time";
      default:
        return "This Period";
    }
  }, [range]);

  // Sort and slice recent transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => {
        const aDate = new Date(`${a.date}T${a.time}`).getTime();
        const bDate = new Date(`${b.date}T${b.time}`).getTime();
        return bDate - aDate;
      })
      .slice(0, 5);
  }, [transactions]);

  // Get top contact
  const topContact = analytics.contacts.mostFrequentContacts[0];

  // Handle loading state
  if (loading) {
    return (
      <ThemedGradientBackground className="flex-1">
        <ScreenLoader label="Loading..." />
      </ThemedGradientBackground>
    );
  }

  return (
    <ThemedGradientBackground className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <BalanceCard
          totalReceived={analytics.totals.totalReceived}
          totalSent={analytics.totals.totalSent}
        />
        <MetricCards
          totalTransactions={analytics.totals.totalTransactions}
          totalTransactionCost={analytics.totals.totalTransactionCost}
          totalContacts={analytics.contacts.totalContacts}
          rangeLabel={rangeLabel}
        />
        {topContact && <TopContactCard topContact={topContact} />}
        <RecentActivity transactions={recentTransactions} />
      </ScrollView>
    </ThemedGradientBackground>
  );
}
