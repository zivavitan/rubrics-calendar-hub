
import { StateCreator } from 'zustand';
import { Duty, DutyWithUser } from '@/types';
import { dutyAPI } from '@/services/api';
import { toast } from 'sonner';

export interface DutySlice {
  duties: DutyWithUser[];
  
  // Data fetching
  fetchDuties: () => Promise<void>;
  
  // Duty management
  addDuty: (duty: Omit<Duty, 'id'>) => Promise<void>;
  removeDuty: (dutyId: string) => Promise<void>;
  updateDuty: (dutyId: string, updates: Partial<Duty>) => Promise<void>;
  
  // Selectors
  getDutiesForDate: (date: string) => DutyWithUser[];
  getDutiesForMonth: (year: number, month: number) => DutyWithUser[];
}

export const createDutySlice: StateCreator<
  DutySlice & { isLoading: boolean }
> = (set, get) => ({
  duties: [],
  
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

  // Selectors
  getDutiesForDate: (date: string) => {
    return get().duties.filter(duty => duty.date === date);
  },
  
  getDutiesForMonth: (year: number, month: number) => {
    return get().duties.filter(duty => {
      const dutyDate = new Date(duty.date);
      return dutyDate.getFullYear() === year && dutyDate.getMonth() === month;
    });
  },
});
