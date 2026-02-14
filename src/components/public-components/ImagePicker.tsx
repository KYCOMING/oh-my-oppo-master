import React from 'react';
import { View, StyleSheet, Alert, Image, Pressable, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerComponentProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImagePickerComponent({
  images,
  onImagesChange,
  maxImages = 9,
}: ImagePickerComponentProps) {
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        '需要相册权限',
        '请在设置中允许访问相册以选择图片',
        [{ text: '确定' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: maxImages,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
    const combined = [...images, ...newImages].slice(0, maxImages);
      onImagesChange(combined);

      if (newImages.length > combined.length - images.length) {
        Alert.alert('提示', `最多只能选择 ${maxImages} 张图片`);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.selectButton}
          onPress={pickImage}
        >
          <Text style={styles.selectButtonText}>选择图片</Text>
        </Pressable>
        <Text style={styles.counterText}>
          {images.length} / {maxImages}
        </Text>
      </View>

      {images.length > 0 && (
        <View style={styles.previewContainer}>
          {images.map((uri, index) => (
            <View key={`${uri}-${index}`} style={styles.imageWrapper}>
              <Image
                source={{ uri }}
                style={styles.thumbnail}
              />
              <Pressable
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectButton: {
    backgroundColor: '#262626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff5111',
  },
  selectButtonText: {
    color: '#ff5111',
    fontSize: 16,
    fontWeight: '500',
  },
  counterText: {
    color: '#a3a3a3',
    fontSize: 14,
  },
  previewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#262626',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff5111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});
