import { CameraParam } from '../public-apis/types';
import { mockParamsList } from './home-mock';

export const mockDetail = (id: string): Promise<CameraParam> => {
  const found = mockParamsList.find((p) => p.id === id);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (found) resolve(found);
      else reject(new Error('Not found'));
    }, 120);
  });
};
