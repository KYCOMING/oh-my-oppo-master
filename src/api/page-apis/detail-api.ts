import { CameraParam } from '@/api/public-apis/types';
import { mockDetail } from '@/api/mock/detail-mock';

// 获取参数详情
export function getDetail(id: string): Promise<CameraParam> {
  return mockDetail(id);
}
