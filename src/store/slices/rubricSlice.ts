
import { StateCreator } from 'zustand';
import { RubricType } from '@/types';
import { rubricAPI } from '@/services/api';
import { toast } from 'sonner';

export interface RubricSlice {
  rubrics: RubricType[];
  
  // Data fetching
  fetchRubrics: () => Promise<void>;
  
  // Rubric management
  addRubric: (rubric: RubricType) => Promise<void>;
  removeRubric: (rubric: RubricType) => Promise<void>;
  updateRubric: (oldRubric: RubricType, newRubric: RubricType) => Promise<void>;
}

export const createRubricSlice: StateCreator<
  RubricSlice & { isLoading: boolean }
> = (set, get) => ({
  rubrics: [],
  
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
});
