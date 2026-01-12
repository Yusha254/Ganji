

import { Text, ThemedCard, View } from "@/components/Themed";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Feather } from "@expo/vector-icons";

export default function AppearanceSection() {
  const { mode, changeTheme } = useAppTheme();
  const isDark = mode === "dark" || (mode === "system" && useAppTheme().resolvedTheme === "dark");

  return (
    <View className="mb-8">
      {/* Section Title */}
      <View className="flex-row items-center gap-2 mb-4">
        <Feather name="sun" size={20} color="rgb(192,132,252)" />
        <Text className="text-lg font-semibold">
          Appearance
        </Text>
      </View>

      <ThemedCard>
        {/* Theme Row */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3 flex-1">
            {/* Icon Box */}
            <View
              className="p-2 rounded-xl"
              lightColor="rgb(243,232,255)"
              darkColor={
                isDark
                  ? "rgba(168,85,247,0.2)"
                  : "rgba(168,85,247,0.2)"
              }
            >
              <Feather name={isDark ? "moon" : "sun"} size={20} color="rgb(192,132,252)" />
            </View>

            {/* Text */}
            <View className="flex-1">
              <Text className="font-medium">
                Theme
              </Text>
              <Text
                className="text-sm"
                lightColor="rgb(75,85,99)"
                darkColor="rgb(156,163,175)"
              >
                {isDark ? "Dark mode" : "Light mode"}
              </Text>
            </View>
          </View>

          {/* Theme Buttons (static) */}
          <View className="flex-row gap-2">
            <ThemeButton
              icon="sun"
              active={mode === "light"}
              onPress={() => changeTheme("light")}
            />
            <ThemeButton
              icon="moon"
              active={mode === "dark"}
              onPress={() => changeTheme("dark")}
            />
            <ThemeButton
              icon="smartphone"
              active={mode === "system"}
              onPress={() => changeTheme("system")}
            />
          </View>
        </View>

        {/* Info Box */}
        <View
          className="flex-row items-start gap-2 rounded-xl p-3"
          lightColor="rgb(239,246,255)"
          darkColor="rgba(59,130,246,0.1)"
        >
          <Feather
            name="info"
            size={16}
            color={
              isDark
                ? "rgb(96,165,250)"
                : "rgb(37,99,235)"
            }
          />

          <Text
            className="text-xs flex-1"
            lightColor="rgb(29,78,216)"
            darkColor="rgb(147,197,253)"
          >
            Choose your preferred color scheme for the app
          </Text>
        </View>
      </ThemedCard>
    </View>
  );
}


function ThemeButton({
  icon,
  active,
  onPress,
}: any) {
  return (
    <View
      onTouchEnd={onPress}
      className="p-2 rounded-lg"
      lightColor={
        active
          ? "rgb(168,85,247)"
          : "rgb(243,232,255)"
      }
      darkColor={
        active
          ? "rgb(168,85,247)"
          : "rgba(255,255,255,0.05)"
      }
    >
      <Feather
        name={icon}
        size={20}
        color={active ? "#fff" : "#888"}
      />
    </View>
  );
}