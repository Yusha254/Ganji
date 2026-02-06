import { useSettings } from "@/context/SettingsContext";

export function useAppTheme() {
  const { appearance, resolvedTheme, setAppearance } = useSettings();

  return {
    mode: appearance,
    resolvedTheme,
    changeTheme: setAppearance,
  };
}
