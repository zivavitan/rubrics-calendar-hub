
import { StateCreator } from 'zustand';
import { User } from '@/types';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

export interface AuthSlice {
  isAuthenticated: boolean;
  currentUser: User | null;
  
  // Authentication actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  isAuthenticated: false,
  currentUser: null,
  
  login: async (email, password) => {
    try {
      const { user, token } = await authAPI.login(email, password);
      set({ isAuthenticated: true, currentUser: user });
      // Store the token in localStorage
      localStorage.setItem('authToken', token);
      toast.success(`Welcome, ${user.name}!`);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    set({ isAuthenticated: false, currentUser: null });
    toast.success('Logged out successfully');
  },
});
