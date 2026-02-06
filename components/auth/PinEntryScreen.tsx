import { Text, ThemedCard, ThemedGradientBackground, View } from "@/components/Themed";
import { useSettings } from "@/context/SettingsContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable } from "react-native";

export default function PinEntryScreen({
    onSuccess,
}: { onSuccess?: () => void }) {
    const { pin: storedPin } = useSettings();
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);

    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (pin.length === 4) {
            if (storedPin && pin === storedPin) {
                // If onSuccess is provided, call it. 
                // Otherwise maybe router.replace? But for now strictly designed for locking.
                if (onSuccess) setTimeout(onSuccess, 200);
            } else {
                triggerError();
            }
        }
    }, [pin, storedPin, onSuccess]);

    const triggerError = () => {
        setError(true);

        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start(() => {
            setPin("");
            setError(false);
        });
    };

    const handlePress = (num: number) => {
        if (pin.length < 4) setPin((p) => p + num);
    };

    const handleDelete = () => {
        setPin((p) => p.slice(0, -1));
    };

    return (
        <ThemedGradientBackground className="flex-1 justify-center px-6">
            <ThemedCard
                className="py-8 px-6 items-center"
                lightBorderColor="rgba(168,85,247,0.2)"
                darkBorderColor="rgba(168,85,247,0.3)"
            >
                {/* Lock Icon */}
                <View
                    className="w-20 h-20 rounded-full items-center justify-center mb-6"
                    lightColor="rgba(168,85,247,0.15)"
                    darkColor="rgba(168,85,247,0.2)"
                >
                    <Ionicons name="lock-closed" size={40} color="rgb(192,132,252)" />
                </View>

                <Text className="text-xl font-semibold mb-1">Enter PIN</Text>
                <Text className="text-sm opacity-70 mb-8">
                    Enter your 4-digit PIN to unlock
                </Text>

                {/* PIN dots */}
                <Animated.View
                    className="flex-row gap-4 mb-10"
                    style={{ transform: [{ translateX: shakeAnim }] }}
                >
                    {[0, 1, 2, 3].map((i) => {
                        const filled = i < pin.length;
                        return (
                            <View
                                key={i}
                                className="w-4 h-4 rounded-full"
                                style={{
                                    backgroundColor: error
                                        ? "rgb(239,68,68)"
                                        : filled
                                            ? "rgb(168,85,247)"
                                            : "transparent",
                                    borderWidth: filled ? 0 : 2,
                                    borderColor: error
                                        ? "rgb(239,68,68)"
                                        : "rgba(168,85,247,0.4)",
                                }}
                            />
                        );
                    })}
                </Animated.View>

                {/* Numpad */}
                <View className="flex-row flex-wrap justify-center gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                        <Pressable
                            key={num}
                            onPress={() => handlePress(num)}
                            className="w-20 h-20 rounded-full items-center justify-center"
                            style={({ pressed }) => ({
                                backgroundColor: pressed
                                    ? "rgba(168,85,247,0.15)"
                                    : "rgba(255,255,255,0.05)",
                                borderWidth: 1,
                                borderColor: "rgba(168,85,247,0.3)",
                            })}
                        >
                            <Text className="text-2xl font-medium">{num}</Text>
                        </Pressable>
                    ))}

                    {/* Delete */}
                    <Pressable
                        onPress={handleDelete}
                        disabled={pin.length === 0}
                        className="w-20 h-20 rounded-full items-center justify-center"
                        style={{
                            backgroundColor: "rgba(239,68,68,0.1)",
                            opacity: pin.length === 0 ? 0.3 : 1,
                        }}
                    >
                        <Ionicons name="close" size={26} color="rgb(239,68,68)" />
                    </Pressable>
                </View>

                {error && (
                    <Text className="text-sm text-red-400 mt-6">
                        Incorrect PIN. Please try again.
                    </Text>
                )}
            </ThemedCard>
        </ThemedGradientBackground>
    );
}