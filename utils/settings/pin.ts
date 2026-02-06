import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "./keys";

export async function loadPin() {
    return await SecureStore.getItemAsync(STORAGE_KEYS.PIN);
}

export async function savePin(pin: string) {
    await SecureStore.setItemAsync(STORAGE_KEYS.PIN, pin);
}

export async function clearPin() {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.PIN);
}
