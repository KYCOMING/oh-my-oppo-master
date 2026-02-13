import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { useParamsStore } from '../../stores/paramsStore';
import { getParamsList } from '../../api/page-apis/home-api';
import { ParamCard, Header } from '../public-components';

export default function HomePage() {
  const { params, setParams } = useParamsStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchParams = async () => {
    try {
      const data = await getParamsList();
      setParams(data);
    } catch (error) {
      console.error('Failed to fetch params:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchParams();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchParams();
  };

  const renderItem = ({ item }: { item: any }) => (
    <ParamCard param={item} />
  );

  const keyExtractor = (item: any) => item.id;

  if (loading) {
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