import { CameraParam } from '@/api/public-apis/types';
import { cameraParamDAO } from '@/dao/camera-param-dao';

export function getParamsList(): Promise<CameraParam[]> {
  return cameraParamDAO.getAll();
}
