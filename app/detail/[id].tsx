import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import DetailPage from '@/components/page-components/DetailPage';

export default function DetailScreen() {
  const searchParams = useLocalSearchParams();
  const id = (searchParams as { id?: string }).id || '';

  return <DetailPage id={id} />;
}
