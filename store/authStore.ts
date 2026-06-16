import { deleteItem, getItem, setItem } from '@/lib/secureStore';
import { create } from 'zustand';
import { AuthState, User } from '../types/auth';

const TOKEN_KEY = 'calzado_jyr_token';
const USER_KEY = 'calzado_jyr_user';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user: User, token: string) => {
    try {
      await setItem(TOKEN_KEY, token)
      await setItem(USER_KEY, JSON.stringify(user))
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Error saving auth credentials:', error);
    }
  },

  clearAuth: async () => {
    try {
      await deleteItem(TOKEN_KEY)
      await deleteItem(USER_KEY)
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.error('Error clearing auth credentials:', error);
    }
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      const token = await getItem(TOKEN_KEY)
      const userStr = await getItem(USER_KEY)

      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
