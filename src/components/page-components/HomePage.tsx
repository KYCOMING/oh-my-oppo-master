import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useParamsStore } from '@/stores/paramsStore';
import { getParamsList } from '@/api/page-apis/home-api';
import { cameraParamDAO } from '@/dao/camera-param-dao';
import { ParamCard, Header } from '@/components/public-components';

export default function HomePage() {
  const params = useParamsStore((state) => state.params);
  const loading = useParamsStore((state) => state.loading);
  const setParams = useParamsStore((state) => state.setParams);
  const removeParam = useParamsStore((state) => state.removeParam);
  const [refreshing, setRefreshing] = useState(false);

  const fetchParams = async () => {
    try {
      const data = await getParamsList();
      setParams(data);
    } catch (error) {
      console.error('Failed to fetch params:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!loading && params.length === 0) {
      fetchParams();
    }
  }, [loading, params.length]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchParams();
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      '确认删除',
      '确定要删除这条数据吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await cameraParamDAO.delete(id);
              removeParam(id);
            } catch (error) {
              console.error('Failed to delete:', error);
              Alert.alert('错误', '删除失败');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <ParamCard param={item} onLongPress={handleDelete} />
  );

  const keyExtractor = (item: any) => item.id;

  if (loading || params.length === 0) {
    return (
      <View style={styles.loadingContainer} testID="loading-screen">
        <ActivityIndicator size="large" color="#ff5111" testID="loading-spinner" />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="home-screen">
      <Header title="相机参数" />
      <FlatList
        data={params}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#ff5111"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer} testID="empty-state">
            <Text style={styles.emptyText}>暂无数据</Text>
          </View>
        }
      />
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
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#737373',
    fontSize: 16,
  },
});