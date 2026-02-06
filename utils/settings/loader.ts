import { loadAppearance } from "./appearance";
import { loadAutoScan } from "./autoScan";
import { loadDashboardType } from "./dashboard";
import { loadLastSmsSync } from "./lastSmsSync";
import { loadPin } from "./pin";
import { loadTrackedContacts } from "./trackedContacts";

export async function loadAllSettings() {
    const [appearance, autoScan, dashboardType, pin, lastSmsSync, trackedContacts] = await Promise.all([
        loadAppearance(),
        loadAutoScan(),
        loadDashboardType(),
        loadPin(),
        loadLastSmsSync(),
        loadTrackedContacts(),
    ]);

    return {
        appearance,
        autoScan,
        dashboardType,
        pin,
        lastSmsSync,
        trackedContacts,
    };
}
