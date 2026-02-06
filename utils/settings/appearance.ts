import { AppearanceMode } from "@/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./keys";

export async function loadAppearance() {
    return (await AsyncStorage.getItem(
        STORAGE_KEYS.APPEARANCE
    )) as AppearanceMode | null;
}

export async function saveAppearance(mode: AppearanceMode) {
    await AsyncStorage.setItem(STORAGE_KEYS.APPEARANCE, mode);
}
