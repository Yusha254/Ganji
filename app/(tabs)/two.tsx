import FilterTabs from "@/components/FilterTabs";
import { ThemedGradientBackground, View } from '@/components/Themed';
import { useState } from "react";

export default function TabTwoScreen() {
  const [activeFilter, setActiveFilter] = useState<"all" | "received" | "sent" | "debt">("all");
  const counts = {
    all: 42,
    received: 12,
    sent: 25,
    debt: 5,
  };
  return (
    <ThemedGradientBackground className="flex-1 pt-5">
      <View className="px-2 mb-4 flex-row justify-between">
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={(f) => setActiveFilter(f)}
          counts={counts}
        />
      </View>
    </ThemedGradientBackground>
  );
}

