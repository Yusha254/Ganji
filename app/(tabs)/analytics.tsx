import AverageTransactionCostCard from "@/components/AverageTransactionCostCard";
import HighestSpendingContactsCard from "@/components/HighestSpendingContactCard";
import MonthlyTransactionCostsCard from "@/components/MonthlyTransactionCostsCard";
import MostFrequentContactsCard from "@/components/MostFrequentContactCard";
import { ScrollView, ThemedGradientBackground } from "@/components/Themed";
import TransactionCostsCards from "@/components/TransactionCostCards";

export default function AnalyticsScreen() {
    return (
        <ThemedGradientBackground className="flex-1 px-4">
            <ScrollView 
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <TransactionCostsCards />
                <AverageTransactionCostCard />
                <MonthlyTransactionCostsCard />
                <MostFrequentContactsCard />
                <HighestSpendingContactsCard />
            </ScrollView>
        </ThemedGradientBackground>
    );
};