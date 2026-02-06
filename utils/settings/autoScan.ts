import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./keys";

export async function loadAutoScan() {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.AUTO_SCAN);
    return value === "true";
}

export async function saveAutoScan(value: boolean) {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTO_SCAN, String(value));
}
