import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../src/stores/userStore';
import { useParamsStore } from '../src/stores/paramsStore';
import { submitParam } from '../src/api/page-apis/submit-api';
import { Header, CameraParamInput, SubmitButton } from '../src/components/public-components';

export default function SubmitScreen() {
  const router = useRouter();
  const { phone } = useUserStore();
  const { addParam } = useParamsStore();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>(Array(9).fill(''));
  const [cameraSettings, setCameraSettings] = useState({
    iso: '',
    shutterSpeed: '',
    aperture: '',
    whiteBalance: '',
    focus: '',
    exposure: '',
  });

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleSettingChange = (key: string, value: string) => {
    setCameraSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!title || title.length > 20) {
      Alert.alert('提示', '标题不能为空，且不能超过20字');
      return;
    }
    if (!description || description.length > 300) {
      Alert.alert('提示', '描述不能为空，且不能超过300字');
      return;
    }

    const validImages = images.filter((img) => img.trim() !== '');
    if (validImages.length === 0) {
      Alert.alert('提示', '请至少输入一张图片URL');
      return;
    }

    if (!phone) {
      Alert.alert('提示', '请先登录');
      return;
    }

    setLoading(true);
    try {
      const param = {
        id: Date.now().toString(),
        title,
        description,
        images: validImages,
        thumbnail: validImages[0],
        cameraSettings,
        author: { phone: phone as string },
        createdAt: new Date().toISOString(),
      };

      await submitParam(param);
      addParam(param);
      router.replace('/');
    } catch (error) {
      Alert.alert('错误', '提交失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="submit-screen"
    >
      <Header title="提交参数" />
      
      <ScrollView style={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          {/* Title */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>标题（20字以内）</Text>
            <View style={styles.inputContainer} testID="title-input-container">
              <TextInput
                style={styles.input}
                placeholder="请输入标题"
                placeholderTextColor="#737373"
                value={title}
                onChangeText={setTitle}
                maxLength={20}
                testID="title-input"
              />
            </View>
            <Text style={styles.charCount}>{title.length}/20</Text>
          </View>

          {/* Description */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>图片内容解说（300字以内）</Text>
            <View style={[styles.inputContainer, styles.textarea]} testID="description-input-container">
              <TextInput
                style={[styles.input, styles.textareaInput]}
                placeholder="请输入描述"
                placeholderTextColor="#737373"
                value={description}
                onChangeText={setDescription}
                maxLength={300}
                multiline
                textAlignVertical="top"
                testID="description-input"
              />
            </View>
            <Text style={styles.charCount}>{description.length}/300</Text>
          </View>

          {/* Images */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>图片URL（9张）</Text>
            {images.map((url, index) => (
              <View key={index} style={styles.imageInputContainer} testID={`image-input-container-${index}`}>
                <Text style={styles.imageLabel}>图片{index + 1}</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="请输入图片URL"
                    placeholderTextColor="#737373"
                    value={url}
                    onChangeText={(value) => handleImageChange(index, value)}
                    testID={`image-input-${index}`}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Camera Settings */}
          <Text style={styles.sectionTitle}>相机参数</Text>
          
          <CameraParamInput
            label="ISO（感光度）"
            value={cameraSettings.iso}
            onChange={(value) => handleSettingChange('iso', value)}
            placeholder="如：400"
            testID="iso-input"
          />
          
          <CameraParamInput
            label="快门速度"
            value={cameraSettings.shutterSpeed}
            onChange={(value) => handleSettingChange('shutterSpeed', value)}
            placeholder="如：1/60s"
            testID="shutter-input"
          />
          
          <CameraParamInput
            label="光圈"
            value={cameraSettings.aperture}
            onChange={(value) => handleSettingChange('aperture', value)}
            placeholder="如：f/1.8"
            testID="aperture-input"
          />
          
          <CameraParamInput
            label="白平衡"
            value={cameraSettings.whiteBalance}
            onChange={(value) => handleSettingChange('whiteBalance', value)}
            placeholder="如：Auto"
            testID="wb-input"
          />
          
          <CameraParamInput
            label="对焦"
            value={cameraSettings.focus}
            onChange={(value) => handleSettingChange('focus', value)}
            placeholder="如：AF-C"
            testID="focus-input"
          />
          
          <CameraParamInput
            label="曝光补偿"
            value={cameraSettings.exposure}
            onChange={(value) => handleSettingChange('exposure', value)}
            placeholder="如：+0.3EV"
            testID="exposure-input"
          />

          {/* Submit Button */}
          <SubmitButton
            onPress={handleSubmit}
            label="提交"
            loading={loading}
            testID="submit-button"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flex: 1,
  },
  form: {
    padding: 16,
    paddingBottom: 120,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#a3a3a3',
    fontSize: 14,
    marginBottom: 8,
  },
  charCount: {
    color: '#737373',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
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
    minHeight: 48,
  },
  textarea: {
    minHeight: 100,
  },
  textareaInput: {
    minHeight: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  imageInputContainer: {
    marginBottom: 8,
  },
  imageLabel: {
    color: '#a3a3a3',
    fontSize: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
  },
});
