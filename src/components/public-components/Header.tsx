import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function Header({ title, showBack = false, onBack }: HeaderProps) {
  return (
    <View style={styles.header} testID="header">
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
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
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
