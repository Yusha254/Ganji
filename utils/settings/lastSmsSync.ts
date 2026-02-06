import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./keys";

export async function loadLastSmsSync(): Promise<number> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SMS_SYNC);
    return value ? parseInt(value, 10) : 0;
}

export async function saveLastSmsSync(timestamp: number) {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SMS_SYNC, String(timestamp));
}
