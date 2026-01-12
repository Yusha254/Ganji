

import { AboutSection } from "@/components/AboutApp";
import AppearanceSection from "@/components/AppearanceSection";
import AutoSmsScan from "@/components/AutoSmsScan";
import ManualSmsScan from "@/components/ManualSmsScan";
import SecuritySection from "@/components/SecuritySection";
import { ScrollView, ThemedGradientBackground } from "@/components/Themed";
import { useTransactions } from "@/context/TransactionContext";
import { deleteAllData } from "@/data";
import { useSmsScanner } from "@/hooks/useSmsScanner";
import { SmsScanRange } from "@/interfaces";
import { useState } from "react";

export default function SettingsScreen() {
  const [smsPermission, setSmsPermission] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [selectedRange, setSelectedRange] = useState<SmsScanRange>("month");
  const { refresh } = useTransactions();

  const {
    scanAndSave,
    loading,
  } = useSmsScanner();

  async function handleManualScan(range: SmsScanRange) {
    setScanComplete(false);
    await scanAndSave(range);
    setScanComplete(true);
    await refresh();
  }

  async function handleDeleteAll() {
    await deleteAllData();
    await refresh();
  }

  return (
    <ThemedGradientBackground className="flex-1 px-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <AppearanceSection />
      <SecuritySection />
      <AutoSmsScan         
        smsPermission={smsPermission}
        onToggle={() => setSmsPermission((prev) => !prev)}
      />
      <ManualSmsScan
        isScanning={loading}
        scanComplete={scanComplete}
        onScan={(range) => {
          setSelectedRange(range as SmsScanRange);
          handleManualScan(range as SmsScanRange);
        }}
        onDeleteAll={handleDeleteAll}
      />

      <AboutSection />
      </ScrollView>
    </ThemedGradientBackground>
  );
};
