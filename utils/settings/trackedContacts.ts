import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_SETTINGS } from "./defaults";
import { STORAGE_KEYS } from "./keys";

export async function loadTrackedContacts(): Promise<string[]> {
    try {
        const value = await AsyncStorage.getItem(STORAGE_KEYS.TRACKED_CONTACTS);
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (e) {
        console.error("Error loading tracked contacts", e);
    }
    return DEFAULT_SETTINGS.trackedContacts;
}

export async function saveTrackedContacts(contacts: string[]): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.TRACKED_CONTACTS, JSON.stringify(contacts));
    } catch (e) {
        console.error("Error saving tracked contacts", e);
    }
}
