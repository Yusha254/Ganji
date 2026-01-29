import AverageTransactionCostCard from "@/components/analytics/AverageTransactionCostCard";
import HighestSpendingContactsCard from "@/components/analytics/HighestSpendingContactCard";
import MonthlyTransactionCostsCard from "@/components/analytics/MonthlyTransactionCostsCard";
import MostFrequentContactsCard from "@/components/analytics/MostFrequentContactCard";
import TransactionCostsCards from "@/components/analytics/TransactionCostCards";
import { ScrollView, ThemedGradientBackground } from "@/components/Themed";
import ScreenLoader from "@/components/ui/ScreenLoader";
import { useAnalytics } from "@/context/AnalyticsContext";
import { useTransactions } from "@/context/TransactionContext";

export default function AnalyticsScreen() {
  const { analytics, monthlyTransactionCosts, monthlyTransactionCounts } =
    useAnalytics();
  const { loading } = useTransactions();

  // Handle loading state
  if (loading) {
    return (
      <ThemedGradientBackground className="flex-1 px-4">
        <ScreenLoader label="Loading analytics..." />
      </ThemedGradientBackground>
    );
  }

  // Get top contact and highest spending contacts
  const topContact = analytics.contacts.mostFrequentContacts[0];
  const topSpendingContacts = analytics.contacts.highestSpendingContacts.slice(
    0,
    5
  );

  return (
    <ThemedGradientBackground className="flex-1 px-4">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TransactionCostsCards
          totalTransactionCost={analytics.totals.totalTransactionCost}
          totalTransactions={analytics.totals.totalTransactions}
          totalDebtCost={analytics.totals.totalDebtCost}
        />
        <AverageTransactionCostCard
          averageTransactionCost={analytics.totals.averageTransactionCost}
        />
        <MonthlyTransactionCostsCard
          monthlyTransactionCosts={monthlyTransactionCosts}
          monthlyTransactionCounts={monthlyTransactionCounts}
        />
        {topContact && <MostFrequentContactsCard topContact={topContact} />}
        {topSpendingContacts.length > 0 && (
          <HighestSpendingContactsCard contacts={topSpendingContacts} />
        )}
      </ScrollView>
    </ThemedGradientBackground>
  );
}
