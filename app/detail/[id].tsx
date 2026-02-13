import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useParamsStore } from '../../src/stores/paramsStore';
import { getDetail } from '../../src/api/page-apis/detail-api';
import { Header } from '../../src/components/public-components';
import { CameraParam } from '../../src/api/public-apis/types';

const { width } = Dimensions.get('window');

export default function DetailScreen() {
  const searchParams = useLocalSearchParams();
  const id = (searchParams as any).id || '' as string;
  const { params } = useParamsStore();
  const [param, setParam] = useState<CameraParam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      // Try to find in store first
      const storeParam = params.find((p: CameraParam) => p.id === id);
      if (storeParam) {
        setParam(storeParam);
        setLoading(false);
        return;
      }

      // Fetch from API if not in store
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
        <Header title="参数详情" showBack onBack={() => {}} />
        <View style={styles.errorContainer} testID="error-container">
          <Text style={styles.errorText}>参数不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="detail-screen">
      <Header title="参数详情" showBack onBack={() => {}} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.title} testID="detail-title">
            {param.title}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.description} testID="detail-description">
            {param.description}
          </Text>
        </View>

        {/* Images */}
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

        {/* Camera Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>相机参数</Text>
          <View style={styles.settingsCard} testID="detail-settings">
            <ParamRow label="ISO（感光度）" value={param.cameraSettings.iso} />
            <ParamRow label="快门速度" value={param.cameraSettings.shutterSpeed} />
            <ParamRow label="光圈" value={param.cameraSettings.aperture} />
            <ParamRow label="白平衡" value={param.cameraSettings.whiteBalance} />
            <ParamRow label="对焦" value={param.cameraSettings.focus} />
            <ParamRow label="曝光补偿" value={param.cameraSettings.exposure} />
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
    paddingBottom: 120,
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
