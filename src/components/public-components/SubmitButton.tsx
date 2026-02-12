import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface SubmitButtonProps {
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}

export function SubmitButton({
  onPress,
  label = '提交',
  disabled = false,
  loading = false,
  testID
}: SubmitButtonProps) {
  return (
    <View style={styles.buttonContainer} testID={testID}>
      <Pressable
        style={[styles.button, (disabled || loading) && styles.buttonDisabled]}
        onPress={onPress}
        disabled={disabled || loading}
        testID={testID ? `${testID}-press` : undefined}
      >
        <Text style={styles.buttonText}>
          {loading ? '提交中...' : label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    backgroundColor: '#ff5111',
    minHeight: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
