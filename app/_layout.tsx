import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface TabItemProps {
  title: string;
  isActive: boolean;
  href: string;
}

function TabItem({ title, isActive, href }: TabItemProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.tabItem, isActive && styles.tabItemActive]}
      onPress={() => router.push(href)}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{title}</Text>
    </TouchableOpacity>
  );
}

function CustomTabBar() {
  const pathname = usePathname();

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        <TabItem
          title="首页"
          isActive={pathname === '/'}
          href="/"
        />
        <TabItem
          title="提交"
          isActive={pathname === '/submit'}
          href="/submit"
        />
        <TabItem
          title="我的"
          isActive={pathname === '/login'}
          href="/login"
        />
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarIcon: () => null,
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: '#a3a3a3',
            tabBarStyle: {
              display: 'none',
            },
            tabBarLabelStyle: {
              display: 'none',
            },
            tabBarButton: () => null,
          }}
        >
          <Tabs.Screen name="index" options={{ title: '首页' }} />
          <Tabs.Screen name="submit" options={{ title: '提交' }} />
          <Tabs.Screen name="login" options={{ title: '我的' }} />
        </Tabs>
        <CustomTabBar />
        <StatusBar barStyle="light-content" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
    pointerEvents: 'auto',
  },
  tabItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 64,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: '#ff5111',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#a3a3a3',
  },
  tabTextActive: {
    color: '#ffffff',
  },
});
