import { CameraParam } from '@/api/public-apis/types';
import { cameraParamDAO } from '@/dao/camera-param-dao';

export function submitParam(param: Omit<CameraParam, 'id' | 'createdAt'>): Promise<{ id: string }> {
  const id = 'sub_' + Date.now().toString(16) + Math.random().toString(16).slice(2, 6);
  const fullParam: CameraParam = {
    ...param,
    id,
    createdAt: new Date().toISOString(),
  };

  return cameraParamDAO.insert(fullParam).then(() => ({ id }));
}
