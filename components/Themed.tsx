// Themed.tsx

import { useSettings } from "@/context/SettingsContext";
import { LinearGradient } from "expo-linear-gradient";
import {
  ScrollViewProps as DefaultScrollViewProps,
  ScrollView as RNScrollView,
  Text as RNText,
  View as RNView,
} from "react-native";

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  className?: string;
  lightBorderColor?: string;
  darkBorderColor?: string;
};

export type TextProps = ThemeProps & RNText["props"];
export type ViewProps = ThemeProps & RNView["props"];
export type GradientProps = {
  children?: React.ReactNode;
  className?: string;
  style?: any;
};

function useResolvedTheme() {
  const { resolvedTheme } = useSettings();
  return resolvedTheme;
}


/* -----------------------------
   COLOR RESOLUTION
--------------------------------*/
function resolveColor(
  theme: "light" | "dark",
  lightColor?: string,
  darkColor?: string,
) {
  return theme === "dark" ? darkColor : lightColor;
}

/* --------------------------------------------------
   THEMED SCROLL VIEW
---------------------------------------------------*/
export function ScrollView({
  style,
  lightColor,
  darkColor,
  className,
  ...otherProps
}: DefaultScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
  className?: string;
}) {
  const theme = useResolvedTheme();

  // Background resolves exactly like your Text and View components:
  const backgroundColor =
    resolveColor(theme, lightColor, darkColor) ?? "transparent";

  return (
    <RNScrollView
      className={className}
      style={[{ backgroundColor }, style]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...otherProps}
    />
  );
}

/* --------------------------------------------------
   THEMED TEXT
---------------------------------------------------*/
export function Text({
  lightColor,
  darkColor,
  className,
  style,
  ...rest
}: TextProps) {
  const theme = useResolvedTheme();

  // theme default
  const themeColor =
    resolveColor(theme, lightColor, darkColor) ??
    (theme === "dark" ? "#ffffff" : "#000000");

  return (
    <RNText
      className={className}
      style={[
        // theme fallback only if user didn't override
        { color: themeColor },
        // user’s style always wins
        style,
      ]}
      {...rest}
    />
  );
}

/* --------------------------------------------------
   THEMED VIEW
---------------------------------------------------*/
export function View({
  lightColor,
  darkColor,
  lightBorderColor,
  darkBorderColor,
  className,
  style,
  ...rest
}: ViewProps) {
  const theme = useResolvedTheme();

  const defaultBg = "transparent";
  const overrideBg = resolveColor(theme, lightColor, darkColor);
  const borderColor = resolveColor(theme, lightBorderColor, darkBorderColor);

  return (
    <RNView
      className={className}
      style={[
        // theme background ONLY if user didn't override
        { backgroundColor: overrideBg ?? defaultBg },
        borderColor ? { borderColor } : {},
        style,
      ]}
      {...rest}
    />
  );
}

/* --------------------------------------------------
   THEMED CARD
---------------------------------------------------*/
export function ThemedCard({
  className,
  style,
  lightColor,
  darkColor,
  ...rest
}: ViewProps) {
  const theme = useResolvedTheme();

  const bg = theme === "dark" ? "rgba(0, 0, 0, 0.2)" : "#ffffff";

  const borderColor =
    theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgb(233, 213, 255)";

  return (
    <RNView
      className={`rounded-2xl p-4 ${className ?? ""}`}
      style={[
        { backgroundColor: bg, borderWidth: 1, borderColor },
        style, // user overrides win
      ]}
      {...rest}
    />
  );
}

/* --------------------------------------------------
   THEMED TRACKED CONTACTS GRADIENT
---------------------------------------------------*/
export function ThemedTrackedContactsGradient({
  children,
  className,
  style,
}: GradientProps) {
  const theme = useResolvedTheme();

  const colors: [string, string] =
    theme === "dark"
      ? ["rgba(234, 179, 8, 0.1)", "rgba(249, 115, 22, 0.1)"]
      : ["rgb(254, 249, 195)", "rgb(255, 237, 213)"];

  const borderColor =
    theme === "dark"
      ? "rgba(234, 179, 8, 0.3)"
      : "rgb(253, 224, 71)";

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className={`border p-4 ${className ?? ""}`}
      style={[
        {
          borderColor,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}


/* --------------------------------------------------
   THEMED GRADIENT BACKGROUND
---------------------------------------------------*/
export function ThemedGradientBackground({
  children,
  className,
  style,
}: GradientProps) {
  const theme = useResolvedTheme();
  const colors: [string, string, string] =
    theme === "dark"
      ? ["#020617", "#581c87", "#020617"]
      : ["#faf5ff", "#fce7f3", "#faf5ff"];

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={className}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

/* --------------------------------------------------
   TOP CONTACT GRADIENT CARD
---------------------------------------------------*/
export function ThemedTopContactGradient({
  children,
  className,
  style,
}: GradientProps) {
  const theme = useResolvedTheme();
  const colors: [string, string] = theme === "dark"
    ? ["rgba(168, 85, 247, 0.2)", "rgba(236, 72, 153, 0.2)"]
    : ["rgb(243, 232, 255)", "rgb(252, 231, 243)"];

  const borderColor = theme === "dark" ? "rgba(168, 85, 247, 0.3)" : "rgb(216, 180, 254)";

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className={`p-4 mb-6 ${className ?? ""}`}
      style={[
        {
          borderWidth: 1,
          borderColor,
          borderRadius: 16,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}
