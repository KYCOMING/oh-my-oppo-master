import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, Modal, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
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
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  if (loading || params.length === 0) {
    return (
      <View style={styles.loadingContainer} testID="loading-screen">
        <ActivityIndicator size="large" color="#ff5111" testID="loading-spinner" />
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
        ListEmptyComponent={
          <View style={styles.emptyContainer} testID="empty-state">
            <Text style={styles.emptyText}>暂无数据</Text>
          </View>
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
    padding: 32,
    alignItems: 'center',
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
