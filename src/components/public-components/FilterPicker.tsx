import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

interface Option {
  label: string;
  value: string;
}

interface FilterPickerProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  testID?: string;
}

export function FilterPicker({
  label,
  value,
  options,
  onChange,
  testID,
}: FilterPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);
  const selectedLabel = selectedOption?.label || '请选择';

  const handleClose = () => setIsOpen(false);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    handleClose();
  };

  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={styles.trigger}
        onPress={() => setIsOpen(true)}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        <Text style={styles.triggerText}>{selectedLabel}</Text>
        <Text style={styles.arrow}>▼</Text>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>{label}</Text>
                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {options.map((option) => {
                    const isSelected = option.value === value;
                    return (
                      <Pressable
                        key={option.value}
                        style={[
                          styles.item,
                          isSelected && styles.itemSelected,
                        ]}
                        onPress={() => handleSelect(option.value)}
                      >
                        <Text
                          style={[
                            styles.itemText,
                            isSelected && styles.itemTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: '#a3a3a3',
    fontSize: 14,
    marginBottom: 12,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#262626',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
  },
  triggerText: {
    color: '#ffffff',
    fontSize: 16,
  },
  arrow: {
    color: '#737373',
    fontSize: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#737373',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#262626',
  },
  itemSelected: {
    backgroundColor: '#ff5111',
  },
  itemText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  itemTextSelected: {
    fontWeight: 'bold',
  },
});
