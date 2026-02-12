import { CameraParam } from '../public-apis/types';
import { mockDetail } from '../mock/detail-mock';

// 获取参数详情
export function getDetail(id: string): Promise<CameraParam> {
  return mockDetail(id);
}
