import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, Modal, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useParamsStore } from '@/stores/paramsStore';
import { getParamsList } from '@/api/page-apis/home-api';
import { cameraParamDAO, reinitializeData } from '@/dao';
import { ParamCard, Header } from '@/components/public-components';

export default function HomePage() {
  const params = useParamsStore((state) => state.params);
  const setParams = useParamsStore((state) => state.setParams);
  const removeParam = useParamsStore((state) => state.removeParam);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchParams = async () => {
    try {
      const data = await getParamsList();
      setParams(data);
      setIsEmpty(data.length === 0);
    } catch (error) {
      console.error('Failed to fetch params:', error);
    } finally {
      setRefreshing(false);
      setInitialLoading(false);
    }
  };

  const handleInitialize = async () => {
    try {
      await reinitializeData();
      await fetchParams();
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  };

  useEffect(() => {
    fetchParams();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchParams();
  };

  const handleLongPress = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedId(id);
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;
    try {
      await cameraParamDAO.delete(selectedId);
      removeParam(selectedId);
      await fetchParams();
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setDeleteDialogVisible(false);
      setSelectedId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogVisible(false);
    setSelectedId(null);
  };

  const renderItem = ({ item }: { item: any }) => (
    <ParamCard param={item} onLongPress={handleLongPress} />
  );

  const keyExtractor = (item: any) => item.id;

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer} testID="loading-screen">
        <ActivityIndicator size="large" color="#ff5111" testID="loading-spinner" />
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.container} testID="home-screen">
        <Header title="影调" />
        <View style={styles.emptyWrapper}>
          <Pressable style={styles.initButton} onPress={handleInitialize}>
            <Text style={styles.initButtonText}>暂无数据，是否初始化？</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="home-screen">
      <Header title="影调" />
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
      />
      <Modal
        visible={deleteDialogVisible}
        transparent
        animationType="fade"
        onRequestClose={handleDeleteCancel}
      >
        <Pressable style={styles.modalOverlay} onPress={handleDeleteCancel}>
          <Pressable style={styles.dialogContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.dialogTitle}>确认删除</Text>
            <Text style={styles.dialogBody}>确定要删除这条数据吗？</Text>
            <View style={styles.dialogFooter}>
              <Pressable style={styles.cancelButton} onPress={handleDeleteCancel}>
                <Text style={styles.cancelButtonText}>取消</Text>
              </Pressable>
              <Pressable style={styles.deleteButton} onPress={handleDeleteConfirm}>
                <Text style={styles.deleteButtonText}>删除</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initButton: {
    backgroundColor: '#ff5111',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  initButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyText: {
    color: '#737373',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContent: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
  },
  dialogTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  dialogBody: {
    color: '#a3a3a3',
    fontSize: 16,
    marginBottom: 20,
  },
  dialogFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#262626',
  },
  cancelButtonText: {
    color: '#a3a3a3',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#dc2626',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
