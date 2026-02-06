import { Text, ThemedCard, View } from "@/components/Themed";
import { ManualSmsProps } from "@/interfaces";
import { Feather } from "@expo/vector-icons";
import { Alert } from "react-native";

const scanOptions = [
  {
    value: "two_weeks",
    label: "Scan Last Two Weeks",
    description: "Scan messages from the last two weeks",
  },
  {
    value: "month",
    label: "Scan This Month",
    description: "Scan messages from the current month",
  },
  {
    value: "three_months",
    label: "Scan Last Three Months",
    description: "Scan messages from the last three months",
  },
  {
    value: "all",
    label: "Scan All Messages",
    description: "Scan all historical messages",
  },
];

export default function ManualSmsScan({
  isScanning,
  scanComplete,
  onScan,
  onDeleteAll, // 👈 add this
}: ManualSmsProps & {
  onDeleteAll: () => void;
}) {
  function confirmDelete() {
    Alert.alert(
      "Delete all data",
      "This will permanently delete all transactions and debts. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDeleteAll,
        },
      ],
    );
  }

  return (
    <ThemedCard className="mb-8">
      {/* Header */}
      <View className="mb-3">
        <Text className="font-medium">Manual Message Scan</Text>
        <Text
          className="text-sm mt-1"
          lightColor="rgb(75,85,99)"
          darkColor="rgb(156,163,175)"
        >
          Scan existing messages for transactions
        </Text>
      </View>

      {/* Options */}
      <View className="gap-3 mb-3">
        {scanOptions.map((option) => (
          <View
            key={option.value}
            onTouchEnd={() => !isScanning && onScan(option.value)}
            className="flex-row items-center gap-3 rounded-xl p-3 border"
            lightColor="#ffffff"
            darkColor="rgba(255,255,255,0.05)"
            lightBorderColor="rgb(233, 213, 255)"
            darkBorderColor="rgba(255, 255, 255, 0.2)"
            style={{
              opacity: isScanning ? 0.6 : 1,
            }}
          >
            <Feather name="search" size={20} color="rgb(192,132,252)" />

            <View className="flex-1">
              <Text className="font-medium">{option.label}</Text>
              <Text
                className="text-xs mt-1"
                lightColor="rgb(75,85,99)"
                darkColor="rgb(156,163,175)"
              >
                {option.description}
              </Text>
            </View>

            {isScanning && (
              <View
                className="w-4 h-4 rounded-full border"
                lightBorderColor="#c084fc"
                darkBorderColor="#c084fc"
              />
            )}
          </View>
        ))}
      </View>

      {/* Scan Complete */}
      {scanComplete && (
        <View
          className="flex-row gap-2 rounded-xl p-3 mb-3"
          lightColor="rgba(34,197,94,0.1)"
          darkColor="rgba(34,197,94,0.15)"
        >
          <Feather name="check" size={16} color="rgb(34,197,94)" />
          <Text
            className="text-sm"
            lightColor="rgb(21,128,61)"
            darkColor="rgb(134,239,172)"
          >
            Scan complete! Found and imported transaction messages.
          </Text>
        </View>
      )}

      {/* DELETE BUTTON */}
      <View
        onTouchEnd={confirmDelete}
        className="
          flex-row items-center gap-3 
          rounded-xl p-3 mb-3
          border
        "
        darkColor="#f5656519"
        lightColor="#f5656519"
        lightBorderColor="rgb(239 68 68 / 0.3)"
        darkBorderColor="rgb(239 68 68 / 0.3)"
      >
        <Feather name="trash-2" size={18} color="rgb(239,68,68)" />

        <Text className="font-medium" lightColor="#f87171" darkColor="#f87171">
          Delete all data
        </Text>
      </View>

      {/* Info */}
      <View
        className="flex-row gap-2 rounded-xl p-3"
        lightColor="rgb(239,246,255)"
        darkColor="rgba(59,130,246,0.1)"
      >
        <Feather name="info" size={16} color="rgb(59,130,246)" />
        <Text
          className="text-xs flex-1"
          lightColor="rgb(29,78,216)"
          darkColor="rgb(147,197,253)"
        >
          Use manual scan to import historical transactions. This is useful for
          testing or one-time imports without enabling auto-scan.
        </Text>
      </View>
    </ThemedCard>
  );
}
