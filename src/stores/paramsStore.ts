import { create } from 'zustand';
import { CameraParam } from '../api/public-apis/types';

interface ParamsState {
  params: CameraParam[];
  setParams: (params: CameraParam[]) => void;
  addParam: (param: CameraParam) => void;
  getParam: (id: string) => CameraParam | undefined;
}

export const useParamsStore = create<ParamsState>((set, get) => ({
  params: [],
  
  setParams: (params: CameraParam[]) => set({ params }),
  
  addParam: (param: CameraParam) => set((state) => ({
    params: [param, ...state.params]
  })),
  
  getParam: (id: string) => {
    return get().params.find((p) => p.id === id);
  }
}));
