import { create } from 'zustand';
import { User } from '@/api/public-apis/types';

interface UserState {
  phone: string | null;
  token: string | null;
  isLoggedIn: boolean;
  user: User | null;
  
  login: (phone: string, token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  phone: null,
  token: null,
  isLoggedIn: false,
  user: null,
  
  login: (phone: string, token: string) => set({
    phone,
    token,
    isLoggedIn: true,
    user: { phone, token }
  }),
  
  logout: () => set({
    phone: null,
    token: null,
    isLoggedIn: false,
    user: null
  }),
}));
