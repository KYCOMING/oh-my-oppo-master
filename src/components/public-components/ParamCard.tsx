import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraParam } from '@/api/public-apis/types';

interface ParamCardProps {
  param: Pick<CameraParam, 'id' | 'title' | 'thumbnail'>;
}

export function ParamCard({ param }: ParamCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/detail/[id]',
      params: { id: param.id }
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      testID={`param-card-${param.id}`}
      style={styles.card}
    >
      <Image
        source={{ uri: param.thumbnail }}
        alt={param.title}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text
          style={styles.title}
          testID={`param-card-title-${param.id}`}
        >
          {param.title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#000000',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#262626',
  },
  thumbnail: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
