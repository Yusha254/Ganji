import { AppearanceMode, DashboardType } from "@/interfaces";

export const DEFAULT_SETTINGS = {
    appearance: "system" as AppearanceMode,
    autoScan: false,
    dashboardType: "monthly" as DashboardType,
    lastSmsSync: 0,
    trackedContacts: [] as string[],
};