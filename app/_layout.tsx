import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar, View, Text } from 'react-native';
import { GluestackUIProvider } from '../src/components/ui/gluestack-ui-provider';

// Simple TabIcon without gluestack-ui
function TabIcon({ name, color }: { name: string; color: string }) {
  const iconMap: Record<string, string> = {
    'home': '🏠',
    'home-outline': '🏠',
    'add-circle': '➕',
    'add-circle-outline': '➕',
    'person': '👤',
    'person-outline': '👤',
  };
  
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, color }}>
        {iconMap[name] || '•'}
      </Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <Tabs
          screenOptions={({ route }: { route: any }) => ({
            tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => {
              let iconName = 'home';
              if (route.name === 'index') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'submit') {
                iconName = focused ? 'add-circle' : 'add-circle-outline';
              } else if (route.name === 'login') {
                iconName = focused ? 'person' : 'person-outline';
              }
              return <TabIcon name={iconName} color={color} />;
            },
            tabBarActiveTintColor: '#ff5111',
            tabBarInactiveTintColor: '#737373',
            tabBarStyle: {
              backgroundColor: '#1a1a1a',
              borderTopColor: '#333',
              height: 88,
              paddingBottom: 20,
            },
            headerStyle: {
              backgroundColor: '#1a1a1a',
            },
            headerTintColor: '#ffffff',
          })}
        >
          <Tabs.Screen 
            name="index" 
            options={{ 
              title: '首页', 
              headerShown: false,
            }}
          />
          <Tabs.Screen 
            name="submit" 
            options={{ 
              title: '提交',
            }}
          />
          <Tabs.Screen 
            name="login" 
            options={{ 
              title: '我的',
            }}
          />
        </Tabs>
        <StatusBar barStyle="light-content" />
      </View>
    </GluestackUIProvider>
  );
}
