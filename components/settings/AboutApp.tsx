import { Text, ThemedCard, View } from "@/components/Themed";

export function AboutSection() {
  return (
    <View className="mb-8">
      <Text className="text-lg font-semibold mb-4">
        About
      </Text>

      <ThemedCard>
        <View className="flex-row justify-between mb-3">
          <Text
            className="text-sm"
            lightColor="rgb(75,85,99)"
            darkColor="rgb(156,163,175)"
          >
            Version
          </Text>
          <Text className="text-sm font-medium">
            1.0.0
          </Text>
        </View>

        <View
          className="flex-row justify-between pt-3"
          style={{ borderTopWidth: 1, borderColor: "rgba(0,0,0,0.1)" }}
        >
          <Text
            className="text-sm"
            lightColor="rgb(75,85,99)"
            darkColor="rgb(156,163,175)"
          >
            Build
          </Text>
          <Text className="text-sm font-medium">
            2024.12.04
          </Text>
        </View>
      </ThemedCard>
    </View>
  );
}
