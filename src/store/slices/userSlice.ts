
import { StateCreator } from 'zustand';
import { User } from '@/types';
import { userAPI } from '@/services/api';
import { toast } from 'sonner';

export interface UserSlice {
  users: User[];
  
  // Data fetching
  fetchUsers: () => Promise<void>;
  
  // User management
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
}

export const createUserSlice: StateCreator<
  UserSlice & { isLoading: boolean }
> = (set, get) => ({
  users: [],
  
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const users = await userAPI.getAll();
      set({ users });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      set({ isLoading: false });
    }
  },
  
  addUser: async (user) => {
    set({ isLoading: true });
    try {
      await userAPI.create(user);
      await get().fetchUsers(); // Refresh the users list
      toast.success('User added successfully');
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error('Failed to add user');
    } finally {
      set({ isLoading: false });
    }
  },
  
  removeUser: async (userId) => {
    set({ isLoading: true });
    try {
      await userAPI.delete(userId);
      await get().fetchUsers(); // Refresh the users list
      toast.success('User removed successfully');
    } catch (error) {
      console.error('Failed to remove user:', error);
      toast.error('Failed to remove user');
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateUser: async (userId, updates) => {
    set({ isLoading: true });
    try {
      await userAPI.update(userId, updates);
      await get().fetchUsers(); // Refresh the users list
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    } finally {
      set({ isLoading: false });
    }
  },
});
