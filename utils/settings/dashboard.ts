import { DashboardType } from "@/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./keys";

export async function loadDashboardType() {
    return (await AsyncStorage.getItem(
        STORAGE_KEYS.DASHBOARD_TYPE
    )) as DashboardType | null;
}

export async function saveDashboardType(type: DashboardType) {
    await AsyncStorage.setItem(STORAGE_KEYS.DASHBOARD_TYPE, type);
}
