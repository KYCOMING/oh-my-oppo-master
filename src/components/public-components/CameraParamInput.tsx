import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

interface CameraParamInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  testID?: string;
}

export function CameraParamInput({
  label,
  value,
  onChange,
  placeholder = '',
  testID
}: CameraParamInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer} testID={testID}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#737373"
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#a3a3a3',
    fontSize: 14,
    marginBottom: 4,
  },
  inputContainer: {
    backgroundColor: '#000000',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#262626',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
});
