import AverageTransactionCostCard from "@/components/analytics/AverageTransactionCostCard";
import HighestSpendingContactsCard from "@/components/analytics/HighestSpendingContactsCard";
import MonthlyTransactionCostsCard from "@/components/analytics/MonthlyTransactionCostsCard";
import MostFrequentContactsCard from "@/components/analytics/MostFrequentContactCard";
import TrackedContactsCard from "@/components/analytics/TrackedContacts";
import TransactionCostsCards from "@/components/analytics/TransactionCostCards";
import { ScrollView, ThemedGradientBackground } from "@/components/Themed";
import ScreenLoader from "@/components/ui/ScreenLoader";
import { useAnalytics } from "@/context/AnalyticsContext";
import { useSettings } from "@/context/SettingsContext";
import { useTransactions } from "@/context/TransactionContext";

export default function AnalyticsScreen() {
  const { analytics, monthlyTransactionCosts, monthlyTransactionCounts } =
    useAnalytics();
  const { loading } = useTransactions();
  const { trackedContacts, toggleTrackedContact } = useSettings();

  // Handle loading state
  if (loading) {
    return (
      <ThemedGradientBackground className="flex-1 px-4">
        <ScreenLoader label="Loading analytics..." />
      </ThemedGradientBackground>
    );
  }

  // Get top 10 contact and highest spending contacts
  const top10Contacts = analytics.contacts.mostFrequentContacts.slice(0, 10);
  const allFrequentContacts = analytics.contacts.mostFrequentContacts;
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
        {top10Contacts.length > 0 && (
          <MostFrequentContactsCard
            contacts={top10Contacts}
            trackedContacts={trackedContacts}
            onToggleTrack={toggleTrackedContact}
          />
        )}
        {topSpendingContacts.length > 0 && (
          <HighestSpendingContactsCard contacts={topSpendingContacts} />
        )}
        <TrackedContactsCard
          contacts={allFrequentContacts}
          trackedContacts={trackedContacts}
          onToggleTrack={toggleTrackedContact}
        />
      </ScrollView>
    </ThemedGradientBackground>
  );
}
