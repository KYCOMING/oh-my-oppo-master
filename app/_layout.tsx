import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useParamsStore } from '@/stores/paramsStore';
import { initDatabase } from '@/dao/database';

interface TabItemProps {
  title: string;
  isActive: boolean;
  href: string;
}

function TabItem({ title, isActive, href }: TabItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = () => {
    if (pathname === href || pathname === href + '/') {
      return;
    }
    router.push(href);
  };

  return (
    <TouchableOpacity
      style={[styles.tabItem, isActive && styles.tabItemActive]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{title}</Text>
    </TouchableOpacity>
  );
}

function CustomTabBar() {
  const pathname = usePathname();

  if (pathname.startsWith('/detail')) {
    return null;
  }

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        <TabItem
          title="首页"
          isActive={pathname === '/'}
          href="/"
        />
        <TabItem
          title="预设"
          isActive={pathname === '/submit'}
          href="/submit"
        />
        <TabItem
          title="关于"
          isActive={pathname === '/about'}
          href="/about"
        />
      </View>
    </View>
  );
}

export default function RootLayout() {
  const loadFromDatabase = useParamsStore((state) => state.loadFromDatabase);

  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        await loadFromDatabase();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    init();
  }, [loadFromDatabase]);

  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="dark">
        <View style={styles.root}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="submit" />
            <Stack.Screen name="about" />
            <Stack.Screen name="detail/[id]" />
          </Stack>
          <CustomTabBar />
          <StatusBar barStyle="light-content" />
        </View>
      </GluestackUIProvider>
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
