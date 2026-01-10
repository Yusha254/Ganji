import { Text, ThemedCard, View } from "@/components/Themed";
import { AutoSmsProps } from "@/interfaces";
import { Feather } from "@expo/vector-icons";

export default function AutoSmsScan({
  smsPermission,
  onToggle,
}: AutoSmsProps) {
  return (
    <ThemedCard className="mb-4">
      {/* Main Row */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3 flex-1">
          {/* Icon */}
          <View
            className="p-2 rounded-xl"
            lightColor={
              smsPermission
                ? "rgba(74,222,128,0.15)"
                : "rgb(243,244,246)"
            }
            darkColor={
              smsPermission
                ? "rgba(74,222,128,0.2)"
                : "rgba(107,114,128,0.2)"
            }
          >
            <Feather
              name="message-square"
              size={20}
              color={
                smsPermission
                  ? "rgb(74,222,128)"
                  : "rgb(156,163,175)"
              }
            />
          </View>

          {/* Labels */}
          <View className="flex-1">
            <Text className="font-medium">
              Auto SMS Scanning
            </Text>
            <Text
              className="text-sm"
              lightColor="rgb(75,85,99)"
              darkColor="rgb(156,163,175)"
            >
              Automatically track new transactions
            </Text>
          </View>
        </View>

        {/* Toggle */}
        <View
          onTouchEnd={onToggle}
          className="w-12 h-6 rounded-full p-1"
          lightColor={
            smsPermission
              ? "rgb(34,197,94)"
              : "rgb(229,231,235)"
          }
          darkColor={
            smsPermission
              ? "rgb(34,197,94)"
              : "rgb(75,85,99)"
          }
        >
          <View
            className={`h-4 w-4 rounded-full bg-white ${
              smsPermission ? "ml-auto" : ""
            }`}
          />
        </View>
      </View>

      {/* Info Box */}
      <View
        className="flex-row gap-2 rounded-xl p-3"
        lightColor={
          smsPermission
            ? "rgba(34,197,94,0.1)"
            : "rgba(251,146,60,0.1)"
        }
        darkColor={
          smsPermission
            ? "rgba(34,197,94,0.15)"
            : "rgba(251,146,60,0.15)"
        }
      >
        <Feather
          name="info"
          size={16}
          color={
            smsPermission
              ? "rgb(34,197,94)"
              : "rgb(251,146,60)"
          }
        />

        <View className="flex-1">
          <Text
            className="text-xs"
            lightColor={
              smsPermission
                ? "rgb(21,128,61)"
                : "rgb(194,65,12)"
            }
            darkColor={
              smsPermission
                ? "rgb(134,239,172)"
                : "rgb(253,186,116)"
            }
          >
            {smsPermission
              ? "Auto-scan is enabled. New payment messages will be automatically detected and logged."
              : "Auto-scan is disabled. You can still manually scan messages below."}
          </Text>

          {smsPermission && (
            <Text
              className="text-xs mt-2"
              lightColor="rgb(21,128,61)"
              darkColor="rgb(134,239,172)"
            >
              We only read payment-related messages and never store or share your personal SMS data.
            </Text>
          )}
        </View>
      </View>
    </ThemedCard>
  );
}
