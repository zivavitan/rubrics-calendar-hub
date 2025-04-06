
import { create } from 'zustand';
import { DutyWithUser, RubricType, User, Duty } from '../types';
import { addMonths, format, subMonths } from 'date-fns';
import { userAPI, dutyAPI, rubricAPI, authAPI } from '@/services/api';
import { toast } from 'sonner';

interface DutyState {
  currentDate: Date;
  viewMode: 'admin' | 'user';
  duties: DutyWithUser[];
  users: User[];
  rubrics: RubricType[];
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  
  // Actions
  setCurrentDate: (date: Date) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  setViewMode: (mode: 'admin' | 'user') => void;
  
  // Data fetching
  fetchDuties: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchRubrics: () => Promise<void>;
  
  // Duty management
  addDuty: (duty: Omit<Duty, 'id'>) => Promise<void>;
  removeDuty: (dutyId: string) => Promise<void>;
  updateDuty: (dutyId: string, updates: Partial<Duty>) => Promise<void>;
  
  // User management
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  
  // Rubric management
  addRubric: (rubric: RubricType) => Promise<void>;
  removeRubric: (rubric: RubricType) => Promise<void>;
  updateRubric: (oldRubric: RubricType, newRubric: RubricType) => Promise<void>;
  
  // Authentication
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Selectors
  getDutiesForDate: (date: string) => DutyWithUser[];
  getDutiesForMonth: (year: number, month: number) => DutyWithUser[];
}

export const useStore = create<DutyState>((set, get) => ({
  currentDate: new Date(),
  viewMode: 'user',
  duties: [],
  users: [],
  rubrics: [],
  isAuthenticated: false,
  currentUser: null,
  isLoading: false,

  setCurrentDate: (date: Date) => set({ currentDate: date }),
  
  goToPreviousMonth: () => {
    set(state => ({ currentDate: subMonths(state.currentDate, 1) }));
  },
  
  goToNextMonth: () => {
    set(state => ({ currentDate: addMonths(state.currentDate, 1) }));
  },
  
  setViewMode: (mode: 'admin' | 'user') => set({ viewMode: mode }),
  
  // Data fetching functions
  fetchDuties: async () => {
    set({ isLoading: true });
    try {
      const duties = await dutyAPI.getAll();
      set({ duties });
    } catch (error) {
      console.error('Failed to fetch duties:', error);
      toast.error('Failed to load duties');
    } finally {
      set({ isLoading: false });
    }
  },
  
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
  
  fetchRubrics: async () => {
    set({ isLoading: true });
    try {
      const rubrics = await rubricAPI.getAll();
      set({ rubrics });
    } catch (error) {
      console.error('Failed to fetch rubrics:', error);
      toast.error('Failed to load duty types');
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Duty management
  addDuty: async (duty) => {
    set({ isLoading: true });
    try {
      await dutyAPI.create(duty);
      await get().fetchDuties(); // Refresh the duties list
      toast.success('Duty added successfully');
    } catch (error) {
      console.error('Failed to add duty:', error);
      toast.error('Failed to add duty');
    } finally {
      set({ isLoading: false });
    }
  },
  
  removeDuty: async (dutyId) => {
    set({ isLoading: true });
    try {
      await dutyAPI.delete(dutyId);
      await get().fetchDuties(); // Refresh the duties list
      toast.success('Duty removed successfully');
    } catch (error) {
      console.error('Failed to remove duty:', error);
      toast.error('Failed to remove duty');
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateDuty: async (dutyId, updates) => {
    set({ isLoading: true });
    try {
      await dutyAPI.update(dutyId, updates);
      await get().fetchDuties(); // Refresh the duties list
      toast.success('Duty updated successfully');
    } catch (error) {
      console.error('Failed to update duty:', error);
      toast.error('Failed to update duty');
    } finally {
      set({ isLoading: false });
    }
  },
  
  // User management
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
  
  // Rubric management
  addRubric: async (rubric) => {
    set({ isLoading: true });
    try {
      await rubricAPI.create(rubric);
      await get().fetchRubrics(); // Refresh the rubrics list
      toast.success(`Rubric "${rubric}" added successfully`);
    } catch (error) {
      console.error('Failed to add rubric:', error);
      toast.error('Failed to add duty type');
    } finally {
      set({ isLoading: false });
    }
  },
  
  removeRubric: async (rubric) => {
    set({ isLoading: true });
    try {
      await rubricAPI.delete(rubric);
      await get().fetchRubrics(); // Refresh the rubrics list
      toast.success(`Rubric "${rubric}" removed successfully`);
    } catch (error) {
      console.error('Failed to remove rubric:', error);
      toast.error('Failed to remove duty type');
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateRubric: async (oldRubric, newRubric) => {
    set({ isLoading: true });
    try {
      await rubricAPI.update(oldRubric, newRubric);
      await get().fetchRubrics(); // Refresh the rubrics list
      await get().fetchDuties(); // Also refresh duties as they may reference this rubric
      toast.success(`Duty type updated from "${oldRubric}" to "${newRubric}"`);
    } catch (error) {
      console.error('Failed to update rubric:', error);
      toast.error('Failed to update duty type');
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Authentication
  login: async (email, password) => {
    set({ isLoading: true });
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
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    set({ isAuthenticated: false, currentUser: null });
    toast.success('Logged out successfully');
  },

  // Selectors remain the same
  getDutiesForDate: (date: string) => {
    return get().duties.filter(duty => duty.date === date);
  },
  
  getDutiesForMonth: (year: number, month: number) => {
    return get().duties.filter(duty => {
      const dutyDate = new Date(duty.date);
      return dutyDate.getFullYear() === year && dutyDate.getMonth() === month;
    });
  },
}));
