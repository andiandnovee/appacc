import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { AuthState, User } from '../types';

interface AuthStoreState extends AuthState {
  initAuth: () => Promise<void>;
}

const useAuthStore = create<AuthStoreState>((set) => ({
  user:            null,
  token:           null,
  isAuthenticated: false,
  isLoading:       true,   // true dulu — biar splash screen nunggu

  initAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }
      // Validasi token ke server — import di sini biar tidak circular
      const { getMe } = await import('../api/auth');
      const user = await getMe();
      set({ token, user, isAuthenticated: true, isLoading: false });
    } catch {
      // Token expired atau invalid — clear
      await SecureStore.deleteItemAsync('access_token');
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setAuth: async (user: User, token: string) => {
    await SecureStore.setItemAsync('access_token', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  clearAuth: async () => {
    await SecureStore.deleteItemAsync('access_token');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));

export default useAuthStore;