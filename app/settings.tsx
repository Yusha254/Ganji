import { AboutSection } from "@/components/AboutApp";
import AppearanceSection from "@/components/AppearanceSection";
import AutoSmsScan from "@/components/AutoSmsScan";
import ManualSmsScan from "@/components/ManualSmsScan";
import SecuritySection from "@/components/SecuritySection";
import { ScrollView, ThemedGradientBackground } from "@/components/Themed";
import { useState } from "react";

export default function SettingsScreen() {
const [smsPermission, setSmsPermission] = useState(false);

  return (
    <ThemedGradientBackground className="flex-1 px-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <AppearanceSection />
      <SecuritySection />
      <AutoSmsScan         
        smsPermission={smsPermission}
        onToggle={() => setSmsPermission((prev) => !prev)}
      />
      <ManualSmsScan isScanning={false} scanComplete={false} onScan={() => {}} />
      <AboutSection />
      </ScrollView>
    </ThemedGradientBackground>
  );
};
