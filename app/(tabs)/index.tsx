import BalanceCard from '@/components/BalanceCard';
import MetricCards from '@/components/MetricCards';
import RecentActivity from '@/components/RecentActivity';
import { ScrollView, ThemedGradientBackground } from '@/components/Themed';
import TopContactCard from '@/components/TopContactCard';

export default function TabOneScreen() {
  return (
    <ThemedGradientBackground className="flex-1 pt-5">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <BalanceCard />
        <MetricCards />
        <TopContactCard />
        <RecentActivity />
      </ScrollView>
    </ThemedGradientBackground>
  );
}

