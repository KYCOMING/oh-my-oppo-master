import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

interface Option {
  label: string;
  value: string;
}

interface CameraParamPickerProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  testID?: string;
}

export function CameraParamPicker({
  label,
  value,
  options,
  onChange,
  testID,
}: CameraParamPickerProps) {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.optionsContainer}
        style={styles.scrollView}
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <Pressable
              key={option.value}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => onChange(option.value)}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollView: {
    flexGrow: 0,
  },
  label: {
    color: '#a3a3a3',
    fontSize: 14,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#262626',
    borderWidth: 1,
    borderColor: '#262626',
  },
  optionSelected: {
    backgroundColor: '#ff5111',
    borderColor: '#ff5111',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
