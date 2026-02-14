import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useParamsStore } from '@/stores/paramsStore';
import { submitParam } from '@/api/page-apis/submit-api';
import { Header, CameraParamSlider, CameraParamPicker, FilterPicker, SubmitButton, ImagePickerComponent } from '@/components/public-components';
import { copyImagesToDocuments } from '@/utils/image-storage';
import {
  FILTER_OPTIONS,
  SHOOT_MODE_OPTIONS,
  SOFT_LIGHT_OPTIONS,
  VIGNETTE_OPTIONS,
  TONE_OPTIONS,
  SATURATION_OPTIONS,
  TEMPERATURE_OPTIONS,
  TINT_OPTIONS,
  SHARPNESS_OPTIONS,
} from '@/utils/camera-options';

export default function SubmitPage() {
  const router = useRouter();
  const { addParam } = useParamsStore();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [cameraSettings, setCameraSettings] = useState({
    shootMode: 'AUTO' as const,
    filter: FILTER_OPTIONS[0].value,
    softLight: 'none' as const,
    tone: 50,
    saturation: 50,
    temperature: 50,
    tint: 50,
    sharpness: 50,
    vignette: 'off' as const,
  });

  const handleSettingChange = (key: string, value: string | number) => {
    setCameraSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!title || title.length > 20) {
      Alert.alert('提示', '标题不能为空，且不能超过20字');
      return;
    }
    if (!description || description.length > 300) {
      Alert.alert('提示', '描述不能为空，且不能超过300字');
      return;
    }

    if (images.length === 0) {
      Alert.alert('提示', '请至少选择一张图片');
      return;
    }

    setLoading(true);
    try {
      const persistedImages = await copyImagesToDocuments(images);
      
      const param = {
        title,
        description,
        images: persistedImages,
        thumbnail: persistedImages[0],
        cameraSettings,
        author: { phone: 'anonymous' },
      };

      const { id } = await submitParam(param);
      addParam({
        ...param,
        id,
        createdAt: new Date().toISOString(),
      });
      router.replace('/');
    } catch {
      Alert.alert('错误', '提交失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      testID="submit-screen"
    >
      <Header title="影调预设" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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
            <Text style={styles.label}>图片（最多3张）</Text>
            <ImagePickerComponent
              images={images}
              onImagesChange={setImages}
              maxImages={3}
            />
          </View>

          {/* Camera Settings */}
          <Text style={styles.sectionTitle}>基础参数</Text>
          
          <CameraParamPicker
            label="拍摄模式"
            value={cameraSettings.shootMode}
            options={SHOOT_MODE_OPTIONS}
            onChange={(value) => handleSettingChange('shootMode', value)}
            testID="shoot-mode-picker"
          />
          
          <FilterPicker
            label="滤镜风格"
            value={cameraSettings.filter}
            options={FILTER_OPTIONS}
            onChange={(value) => handleSettingChange('filter', value)}
            testID="filter-picker"
          />
          
          <CameraParamPicker
            label="柔光效果"
            value={cameraSettings.softLight}
            options={SOFT_LIGHT_OPTIONS}
            onChange={(value) => handleSettingChange('softLight', value)}
            testID="soft-light-picker"
          />

          <Text style={styles.sectionTitle}>调色参数</Text>
          
          <CameraParamSlider
            label="影调"
            value={String(cameraSettings.tone)}
            options={TONE_OPTIONS}
            onChange={(value) => handleSettingChange('tone', parseInt(value, 10))}
            testID="tone-slider"
          />
          
          <CameraParamSlider
            label="饱和度"
            value={String(cameraSettings.saturation)}
            options={SATURATION_OPTIONS}
            onChange={(value) => handleSettingChange('saturation', parseInt(value, 10))}
            testID="saturation-slider"
          />
          
          <CameraParamSlider
            label="冷暖"
            value={String(cameraSettings.temperature)}
            options={TEMPERATURE_OPTIONS}
            onChange={(value) => handleSettingChange('temperature', parseInt(value, 10))}
            testID="temperature-slider"
          />
          
          <CameraParamSlider
            label="青品"
            value={String(cameraSettings.tint)}
            options={TINT_OPTIONS}
            onChange={(value) => handleSettingChange('tint', parseInt(value, 10))}
            testID="tint-slider"
          />
          
          <CameraParamSlider
            label="锐度"
            value={String(cameraSettings.sharpness)}
            options={SHARPNESS_OPTIONS}
            onChange={(value) => handleSettingChange('sharpness', parseInt(value, 10))}
            testID="sharpness-slider"
          />

          <Text style={styles.sectionTitle}>其他</Text>
          
          <CameraParamPicker
            label="暗角"
            value={cameraSettings.vignette}
            options={VIGNETTE_OPTIONS}
            onChange={(value) => handleSettingChange('vignette', value)}
            testID="vignette-picker"
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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