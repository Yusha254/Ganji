import { Text, ThemedCard, View } from "@/components/Themed";
import GradientActionButton from "@/components/ui/GradientActionButton";
import { useSettings } from "@/context/SettingsContext";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, TextInput } from "react-native";

export default function SecuritySection() {
  const { pin, setPin, clearPin } = useSettings();
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [pinInput, setPinInput] = useState("");

  const lockPin = !!pin;
  const canConfirm = pinInput.length === 4;

  const handleConfirmPin = async () => {
    if (canConfirm) {
      await setPin(pinInput);
      setIsSettingPin(false);
      setPinInput("");
    }
  };

  const handleRemovePin = async () => {
    await clearPin();
    setPinInput("");
  };

  return (
    <View className="mb-8">
      {/* Section Title */}
      <View className="flex-row items-center gap-2 mb-4">
        <Feather name="lock" size={20} color="rgb(192,132,252)" />
        <Text className="text-lg font-semibold">Security</Text>
      </View>

      <ThemedCard>
        {/* Lock PIN Row */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3 flex-1">
            {/* Icon Box */}
            <View
              className="p-2 rounded-xl"
              lightColor={
                lockPin ? "rgba(74,222,128,0.15)" : "rgb(243,232,255)"
              }
              darkColor={
                lockPin ? "rgba(74,222,128,0.2)" : "rgba(107,114,128,0.2)"
              }
            >
              <Feather
                name="lock"
                size={20}
                color={lockPin ? "rgb(74,222,128)" : "rgb(156,163,175)"}
              />
            </View>

            {/* Text */}
            <View className="flex-1">
              <Text className="font-medium">Lock PIN</Text>
              <Text
                className="text-sm"
                lightColor="rgb(75,85,99)"
                darkColor="rgb(156,163,175)"
              >
                {lockPin ? "PIN is set" : "Set a 4-digit PIN"}
              </Text>
            </View>
          </View>

          {/* Action */}
          {!lockPin && !isSettingPin && (
            <GradientActionButton
              label="Set PIN"
              onPress={() => setIsSettingPin(true)}
            />
          )}

          {lockPin && (
            <Pressable
              onPress={handleRemovePin}
              className="px-4 py-2 rounded-lg"
            >
              <Text className="text-sm" lightColor="rgb(239, 68, 68)" darkColor="rgb(239, 68, 68)">Remove</Text>
            </Pressable>
          )}
        </View>

        {/* PIN Setup */}
        {isSettingPin && (
          <View className="mb-4">
            <View
              className="rounded-xl px-4 py-3 mb-3"
              lightColor="rgb(249,250,251)"
              darkColor="rgba(255,255,255,0.05)"
            >
              <TextInput
                value={pinInput}
                onChangeText={(val) =>
                  setPinInput(val.replace(/\D/g, "").slice(0, 4))
                }
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                autoFocus
                placeholder="••••"
                placeholderTextColor="#9ca3af"
                style={{
                  fontSize: 18,
                  letterSpacing: 8,
                  textAlign: "center",
                  color: "#a855f7",
                }}
              />
            </View>

            <View className="flex-row gap-3">
              <GradientActionButton
                label="Confirm"
                disabled={!canConfirm}
                onPress={handleConfirmPin}
              />

              <Pressable
                onPress={() => {
                  setIsSettingPin(false);
                  setPinInput("");
                }}
                className="px-4 py-3 rounded-lg justify-center"
              >
                <Text className="text-sm opacity-70">Cancel</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* PIN Status */}
        {lockPin && (
          <View
            className="flex-row items-center gap-2 rounded-lg px-3 py-2 mb-4"
            lightColor="rgba(34,197,94,0.1)"
            darkColor="rgba(34,197,94,0.15)"
          >
            <Feather name="lock" size={16} color="rgb(74,222,128)" />
            <Text
              className="text-sm"
              lightColor="rgb(21,128,61)"
              darkColor="rgb(134,239,172)"
            >
              Your app is protected with a 4-digit PIN
            </Text>
          </View>
        )}

        {/* Info Box */}
        <View
          className="flex-row items-start gap-2 rounded-xl p-3"
          lightColor="rgb(239,246,255)"
          darkColor="rgba(59,130,246,0.1)"
        >
          <Feather name="info" size={16} color="rgb(96,165,250)" />
          <Text
            className="text-xs flex-1"
            lightColor="rgb(29,78,216)"
            darkColor="rgb(147,197,253)"
          >
            Secure your financial data with a PIN. You'll be asked to enter it
            when opening the app.
          </Text>
        </View>
      </ThemedCard>
    </View>
  );
}
