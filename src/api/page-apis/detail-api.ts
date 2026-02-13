import { CameraParam } from '@/api/public-apis/types';
import { cameraParamDAO } from '@/dao/camera-param-dao';

export function getDetail(id: string): Promise<CameraParam | null> {
  return cameraParamDAO.getById(id);
}
