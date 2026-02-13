import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { getOptionIndex, getOptionValue } from '@/utils/camera-options';

interface Option {
  label: string;
  value: string;
}

interface CameraParamSliderProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  testID?: string;
}

export function CameraParamSlider({
  label,
  value,
  options,
  onChange,
  testID,
}: CameraParamSliderProps) {
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (options.length === 0) return;
    const index = getOptionIndex(value, options);
    setSliderValue(index);
  }, [value, options]);

  const handleValueChange = (newValue: number) => {
    const newVal = getOptionValue(newValue, options);
    onChange(newVal);
  };

  const handleSlidingComplete = (newValue: number) => {
    setSliderValue(newValue);
  };

  const currentOption = options[Math.round(sliderValue)];
  const displayValue = currentOption?.label ?? '';

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{displayValue}</Text>
      </View>
      
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={options.length - 1}
        step={1}
        value={sliderValue}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor="#ff5111"
        maximumTrackTintColor="#262626"
        thumbTintColor="#ff5111"
      />
      
      <View style={styles.ticksContainer}>
        {options.length > 0 && [0, Math.floor(options.length / 2), options.length - 1].map((idx) => (
          <Text key={idx} style={styles.tickLabel}>
            {options[idx]?.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#a3a3a3',
    fontSize: 14,
  },
  value: {
    color: '#ff5111',
    fontSize: 18,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  ticksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
    paddingHorizontal: 4,
  },
  tickLabel: {
    color: '#737373',
    fontSize: 11,
  },
});
