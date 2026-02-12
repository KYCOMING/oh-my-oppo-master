import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function Header({ title, showBack = false, onBack }: HeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea} testID="header">
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {showBack && (
            <Text
              style={styles.backText}
              onPress={onBack}
              testID="header-back"
            >
              ←
            </Text>
          )}
          <Text
            style={styles.title}
            testID="header-title"
          >
            {title}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#000000',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#ff5111',
    fontSize: 16,
    marginRight: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
