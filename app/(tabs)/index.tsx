import BalanceCard from "@/components/home/BalanceCard";
import MetricCards from "@/components/home/MetricCards";
import RecentActivity from "@/components/home/RecentActivity";
import TopContactCard from "@/components/home/TopContactCard";
import { ScrollView, Text, ThemedGradientBackground, View } from "@/components/Themed";
import ScreenLoader from "@/components/ui/ScreenLoader";
import { useAnalytics } from "@/context/AnalyticsContext";
import { useTransactions } from "@/context/TransactionContext";
import { toISODateTime } from "@/utils/DateUtils";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable } from "react-native";

export default function TabOneScreen() {
  const { analytics, range, headBalance } = useAnalytics();
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
        const aDate = new Date(toISODateTime(a.date, a.time)).getTime();
        const bDate = new Date(toISODateTime(b.date, b.time)).getTime();
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
        {transactions.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-20 px-6">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-6"
              lightColor="rgba(168,85,247,0.1)"
              darkColor="rgba(168,85,247,0.1)"
            >
              <Feather name="message-square" size={40} color="rgb(192,132,252)" />
            </View>

            <Text className="text-xl font-bold text-center mb-2">
              No transactions found
            </Text>

            <Text
              className="text-center mb-8"
              lightColor="rgb(75,85,99)"
              darkColor="rgb(156,163,175)"
            >
              Ganji works by scanning your M-PESA SMS messages.
              Scan your messages to see your analytics.
            </Text>

            <Pressable
              onPress={() => router.push("/settings")}
              className="w-full"
            >
              <View
                className="w-full py-4 rounded-xl items-center"
                lightColor="rgb(168,85,247)"
                darkColor="rgb(168,85,247)"
              >
                <Text className="text-white font-semibold text-lg">
                  Scan Now
                </Text>
              </View>
            </Pressable>
          </View>
        ) : (
          <>
            <BalanceCard
              balance={headBalance}
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
          </>
        )}
      </ScrollView>
    </ThemedGradientBackground>
  );
}
