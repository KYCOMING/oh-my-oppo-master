import { CameraParam } from '@/api/public-apis/types';
import { mockSubmit } from '@/api/mock/submit-mock';

// 提交参数（移除 id、createdAt 字段，交给后端生成）
export function submitParam(param: Omit<CameraParam, 'id' | 'createdAt'>): Promise<{ id: string }> {
  return mockSubmit(param);
}
