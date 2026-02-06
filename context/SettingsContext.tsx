import {
    AppearanceMode,
    DashboardType,
    SettingsContextValue,
} from "@/interfaces";
import { saveAppearance } from "@/utils/settings/appearance";
import { saveAutoScan } from "@/utils/settings/autoScan";
import { saveDashboardType } from "@/utils/settings/dashboard";
import { DEFAULT_SETTINGS } from "@/utils/settings/defaults";
import { saveLastSmsSync } from "@/utils/settings/lastSmsSync";
import { loadAllSettings } from "@/utils/settings/loader";
import { clearPin, savePin } from "@/utils/settings/pin";
import { saveTrackedContacts } from "@/utils/settings/trackedContacts";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import { useColorScheme } from "react-native";

const SettingsContext = createContext<SettingsContextValue | undefined>(
    undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [appearance, setAppearanceState] = useState<AppearanceMode>(
        DEFAULT_SETTINGS.appearance
    );
    const [autoScan, setAutoScanState] = useState(DEFAULT_SETTINGS.autoScan);
    const [dashboardType, setDashboardTypeState] = useState<DashboardType>(
        DEFAULT_SETTINGS.dashboardType
    );
    const [pin, setPinState] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [lastSmsSync, setLastSmsSyncState] = useState<number>(DEFAULT_SETTINGS.lastSmsSync);
    const [trackedContacts, setTrackedContactsState] = useState<string[]>(DEFAULT_SETTINGS.trackedContacts);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Get System Theme (React Native)
    const systemColorScheme = useColorScheme() ?? "light";

    // 2. NativeWind Control
    const { setColorScheme: setNativeWindColorScheme } = useNativeWindColorScheme();

    // 3. Resolve Theme
    const resolvedTheme = appearance === "system" ? systemColorScheme : appearance;

    // 4. Update NativeWind whenever resolvedTheme changes
    useEffect(() => {
        setNativeWindColorScheme(resolvedTheme);
    }, [resolvedTheme, setNativeWindColorScheme]);


    useEffect(() => {
        loadAllSettings()
            .then((data) => {
                if (data.appearance) setAppearanceState(data.appearance);
                if (data.dashboardType) setDashboardTypeState(data.dashboardType);
                setAutoScanState(data.autoScan);

                if (data.pin && data.pin !== 'null' && data.pin !== 'undefined') {
                    setPinState(data.pin);
                } else {
                    setPinState(null);
                    setIsAuthorized(true);
                }

                setLastSmsSyncState(data.lastSmsSync);
                setTrackedContactsState(data.trackedContacts);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const setAppearance = useCallback(async (mode: AppearanceMode) => {
        await saveAppearance(mode);
        setAppearanceState(mode);
    }, []);

    const toggleAutoScan = useCallback(async () => {
        const next = !autoScan;
        await saveAutoScan(next);
        setAutoScanState(next);
    }, [autoScan]);

    const setDashboardType = useCallback(async (type: DashboardType) => {
        await saveDashboardType(type);
        setDashboardTypeState(type);
    }, []);

    const setPinValue = useCallback(async (newPin: string) => {
        await savePin(newPin);
        setPinState(newPin);
        setIsAuthorized(false);
    }, []);

    const clearPinValue = useCallback(async () => {
        await clearPin();
        setPinState(null);
        setIsAuthorized(true);
    }, []);

    const updateLastSmsSync = useCallback(async (ts: number) => {
        await saveLastSmsSync(ts);
        setLastSmsSyncState(ts);
    }, []);

    const toggleTrackedContact = useCallback(async (name: string) => {
        setTrackedContactsState((prev) => {
            const next = prev.includes(name)
                ? prev.filter((c) => c !== name)
                : [...prev, name];
            saveTrackedContacts(next);
            return next;
        });
    }, []);

    return (
        <SettingsContext.Provider
            value={{
                appearance,
                resolvedTheme,
                autoScan,
                dashboardType,
                pin,
                isAuthorized,
                lastSmsSync,
                isLoading,
                setAppearance,
                toggleAutoScan,
                setDashboardType,
                setPin: setPinValue,
                clearPin: clearPinValue,
                updateLastSmsSync,
                setIsAuthorized,
                trackedContacts,
                toggleTrackedContact,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export function useSettings() {
    const ctx = useContext(SettingsContext);
    if (!ctx) {
        throw new Error("useSettings must be used within SettingsProvider");
    }
    return ctx;
}
