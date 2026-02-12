import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import { GluestackUIProvider } from '../src/components/ui/gluestack-ui-provider';

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <Tabs
          screenOptions={{
            tabBarIcon: () => null,
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: '#a3a3a3',
            tabBarLabelStyle: {
              fontSize: 15,
              fontWeight: '600',
            },
            tabBarItemStyle: {
              paddingVertical: 8,
              marginHorizontal: 4,
              borderRadius: 16,
            },
            tabBarStyle: {
              backgroundColor: '#1a1a1a',
              borderTopColor: '#333',
              height: 88,
              paddingBottom: 20,
              paddingHorizontal: 16,
              marginHorizontal: 16,
              borderRadius: 20,
              position: 'absolute',
              bottom: 20,
              left: 0,
              right: 0,
            },
            headerStyle: {
              backgroundColor: '#1a1a1a',
            },
            headerTintColor: '#ffffff',
          }}
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
