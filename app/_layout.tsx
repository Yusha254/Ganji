import PinEntryScreen from "@/components/auth/PinEntryScreen";
import { AnalyticsProvider } from "@/context/AnalyticsContext";
import { SettingsProvider, useSettings } from "@/context/SettingsContext";
import { TransactionProvider } from "@/context/TransactionContext";
import { initDatabase } from "@/data";
import { ingestSmsMessages } from "@/services/smsIngestService";
import { scanMpesaMessages } from "@/utils/SmsUtils";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import "../global.css";

const queryClient = new QueryClient();

export {
  ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch((e) => console.error("DB Init Failed:", e));
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && dbReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, dbReady]);

  if (!loaded || !dbReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <RootLayoutNav />
      </SettingsProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const { resolvedTheme, isLoading, autoScan, pin, isAuthorized, setIsAuthorized, lastSmsSync, updateLastSmsSync } = useSettings();
  const hasScanned = useRef(false);

  // 2. Auto-Scan Logic: Run once per session if enabled
  useEffect(() => {
    if (!isLoading && autoScan && !hasScanned.current) {
      hasScanned.current = true;
      const minDate = lastSmsSync > 0 ? lastSmsSync : Date.now();

      scanMpesaMessages("all", minDate)
        .then(async (msgs) => {
          if (msgs.length > 0) {
            console.log(`📥 Ingesting ${msgs.length} new messages...`);
            await ingestSmsMessages(msgs);
            // Invalidate queries after ingestion to refresh data
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
          } else {
            console.log("✅ No new messages found.");
          }
          await updateLastSmsSync(Date.now());
        })
        .catch((err) => console.error("❌ Auto-scan failed:", err));
    }
  }, [isLoading, autoScan, lastSmsSync, updateLastSmsSync]);

  if (isLoading) {
    return null;
  }

  // 3. Auth Guard & Conditional Rendering
  // IMPORTANT: We only show lock screen if PIN is exactly 4 characters.
  const showLockScreen = pin && pin.length === 4 && !isAuthorized;

  if (showLockScreen) {
    return (
      <ThemeProvider value={resolvedTheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
        <PinEntryScreen onSuccess={() => setIsAuthorized(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider
      value={resolvedTheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
      <TransactionProvider>
        <AnalyticsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="settings"
              options={{
                presentation: "modal",
                headerShown: true,
                title: "Settings",
                headerStyle: {
                  backgroundColor: resolvedTheme === 'dark' ? '#020617' : '#faf5ff',
                },
                headerTitleStyle: {
                  color: resolvedTheme === 'dark' ? '#f8fafc' : '#1e293b'
                }
              }}
            />
          </Stack>
        </AnalyticsProvider>
      </TransactionProvider>
    </ThemeProvider>
  );
}
