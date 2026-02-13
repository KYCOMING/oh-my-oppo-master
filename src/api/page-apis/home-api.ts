import { CameraParam } from '@/api/public-apis/types';
import { mockParamsList } from '@/api/mock/home-mock';

// 获取参数列表：返回CameraParam数组
export function getParamsList(): Promise<CameraParam[]> {
  // 模拟异步请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockParamsList);
    }, 150);
  });
}
