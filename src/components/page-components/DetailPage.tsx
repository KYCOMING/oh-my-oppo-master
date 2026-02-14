import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useParamsStore } from '@/stores/paramsStore';
import { getDetail } from '@/api/page-apis/detail-api';
import { Header } from '@/components/public-components';
import { CameraParam } from '@/api/public-apis/types';
import { FILTER_OPTIONS, SHOOT_MODE_OPTIONS, SOFT_LIGHT_OPTIONS } from '@/utils/camera-options';

const { width } = Dimensions.get('window');

interface DetailPageProps {
  id: string;
}

export default function DetailPage({ id }: DetailPageProps) {
  const router = useRouter();
  const { params } = useParamsStore();
  const [param, setParam] = useState<CameraParam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      const storeParam = params.find((p: CameraParam) => p.id === id);
      if (storeParam) {
        setParam(storeParam);
        setLoading(false);
        return;
      }

      try {
        const data = await getDetail(id);
        setParam(data);
      } catch (error) {
        console.error('Failed to fetch detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id, params]);

  if (loading) {
    return (
      <View style={styles.loadingContainer} testID="loading-screen">
        <ActivityIndicator size="large" color="#ff5111" testID="loading-spinner" />
      </View>
    );
  }

  if (!param) {
    return (
      <View style={styles.container} testID="error-screen">
        <Header title="参数详情" showBack onBack={() => router.back()} />
        <View style={styles.errorContainer} testID="error-container">
          <Text style={styles.errorText}>参数不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="detail-screen">
      <Header title="参数详情" showBack onBack={() => router.back()} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.title} testID="detail-title">
            {param.title}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.description} testID="detail-description">
            {param.description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>图片</Text>
          <View style={styles.imageGrid} testID="detail-images">
            {param.images.map((url: string, index: number) => (
              <Image
                key={index}
                source={{ uri: url }}
                alt={`图片${index + 1}`}
                style={styles.image}
                resizeMode="cover"
                testID={`detail-image-${index}`}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基础参数</Text>
          <View style={styles.settingsCard} testID="detail-settings">
            <ParamRow label="拍摄模式" value={SHOOT_MODE_OPTIONS.find(opt => opt.value === param.cameraSettings.shootMode)?.label || param.cameraSettings.shootMode} />
            <ParamRow label="滤镜风格" value={FILTER_OPTIONS.find(opt => opt.value === param.cameraSettings.filter)?.label || param.cameraSettings.filter} />
            <ParamRow label="柔光效果" value={SOFT_LIGHT_OPTIONS.find(opt => opt.value === param.cameraSettings.softLight)?.label || param.cameraSettings.softLight} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>调色参数</Text>
          <View style={styles.settingsCard} testID="detail-settings">
            <ParamRow label="影调" value={String(param.cameraSettings.tone)} />
            <ParamRow label="饱和度" value={String(param.cameraSettings.saturation)} />
            <ParamRow label="冷暖" value={String(param.cameraSettings.temperature)} />
            <ParamRow label="青品" value={String(param.cameraSettings.tint)} />
            <ParamRow label="锐度" value={String(param.cameraSettings.sharpness)} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>其他</Text>
          <View style={styles.settingsCard} testID="detail-settings">
            <ParamRow label="暗角" value={param.cameraSettings.vignette === 'on' ? '开启' : '关闭'} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ParamRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.paramRow} testID={`param-${label}`}>
      <Text style={styles.paramLabel}>{label}</Text>
      <Text style={styles.paramValue}>{value || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    color: '#a3a3a3',
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  image: {
    width: (width - 48) / 3,
    height: 120,
    borderRadius: 8,
  },
  settingsCard: {
    backgroundColor: '#000000',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262626',
    padding: 16,
  },
  paramRow: {
    marginBottom: 12,
  },
  paramLabel: {
    color: '#a3a3a3',
    fontSize: 14,
    marginBottom: 4,
  },
  paramValue: {
    color: '#ffffff',
    fontSize: 16,
  },
});