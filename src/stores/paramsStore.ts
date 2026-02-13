import { create } from 'zustand';
import { CameraParam } from '@/api/public-apis/types';
import { cameraParamDAO } from '@/dao/camera-param-dao';

interface ParamsState {
  params: CameraParam[];
  loading: boolean;
  setParams: (params: CameraParam[]) => void;
  addParam: (param: CameraParam) => void;
  getParam: (id: string) => CameraParam | undefined;
  loadFromDatabase: () => Promise<void>;
}

export const useParamsStore = create<ParamsState>((set, get) => ({
  params: [],
  loading: true,

  setParams: (params: CameraParam[]) => set({ params }),

  addParam: (param: CameraParam) => set((state) => ({
    params: [param, ...state.params]
  })),

  getParam: (id: string) => {
    return get().params.find((p) => p.id === id);
  },

  loadFromDatabase: async () => {
    try {
      const params = await cameraParamDAO.getAll();
      set({ params, loading: false });
    } catch (error) {
      console.error('Failed to load params from database:', error);
      set({ loading: false });
    }
  },
}));
