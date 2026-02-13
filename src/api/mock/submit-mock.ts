import { CameraParam } from '@/api/public-apis/types';

type SubmitParamPayload = Omit<CameraParam, 'id' | 'createdAt'>;
export const mockSubmit = (param: SubmitParamPayload): Promise<{ id: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = 'sub_' + Date.now().toString(16) + Math.random().toString(16).slice(2, 6);
      resolve({ id });
    }, 200);
  });
};
