import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Pressable, Text } from 'react-native';

function TabBarIcon({
  name,
  color,
  isActive,
}: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  isActive: boolean;
}) {
  if (isActive) {
    return (
      <MaskedView
        maskElement={
          <FontAwesome name={name} size={28} color="black" style={{ marginBottom: -3 }} />
        }
      >
        <LinearGradient
          colors={['#a855f7', '#ec4899']}
          start={[0, 0]}
          end={[1, 0]}
          style={{ height: 28, width: 28 }}
        />
      </MaskedView>
    );
  }
  return <FontAwesome name={name} size={28} color={color} style={{ marginBottom: -3 }} />;
}

function GradientHeaderTitle({ title }: { title: string }) {
  return (
    <MaskedView
      maskElement={
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'black', // must be black for masking
          }}
        >
          {title}
        </Text>
      }
    >
      <LinearGradient
        colors={['#a855f7', '#ec4899']}
        start={[0, 0]}
        end={[1, 0]}
        style={{
          height: 24, // matches text size roughly
          width: title.length * 12, // approximate width based on characters
        }}
      />
    </MaskedView>
  );
}



export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
        backgroundColor: isDark ? '#020617' : '#faf5ff',
        borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgb(233, 213, 255)',
        borderBottomWidth: 0.5,
      },
      tabBarStyle: {
        backgroundColor: isDark ? '#020617' : '#faf5ff',
        borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgb(233, 213, 255)',
        borderTopWidth: 0.5,
      },

        tabBarActiveTintColor: isDark ? '#f9a8d4' : '#a855f7',
        tabBarInactiveTintColor: isDark ? '#d1d5db' : '#374151',
        headerTitle: ({ children }) => <GradientHeaderTitle title={String(children)} />,
        headerTitleAlign: 'center',
        headerRight: () => (
          <Pressable
            onPress={() => router.push("/settings")}
            className="mr-4"
            hitSlop={10}
          >
            <TabBarIcon
              name="cog"
              color={isDark ? "#d1d5db" : "#374151"}
              isActive={true}
            />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: () => <GradientHeaderTitle title="Home" />,
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="home" color={color} isActive={focused} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          headerTitle: () => <GradientHeaderTitle title="Transactions" />,
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="list-alt" color={color} isActive={focused} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          headerTitle: () => <GradientHeaderTitle title="Analytics" />,
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="line-chart" color={color} isActive={focused} />,
        }}
      />
    </Tabs>
  );
}
