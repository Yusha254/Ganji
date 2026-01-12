import { getSetting, setSetting } from "@/data";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";

export function useAppTheme() {
  const systemScheme = useColorScheme;
  const [mode, setMode] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    const saved = await getSetting("theme");
    if (saved) setMode(saved as any);
  }

  async function changeTheme(value: typeof mode) {
    setMode(value);
    await setSetting("theme", value);
  }

  const resolvedTheme =
    mode === "system" ? systemScheme : mode;

  return {
    mode,
    resolvedTheme,
    changeTheme,
  };
}

