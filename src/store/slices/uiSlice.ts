
import { StateCreator } from 'zustand';
import { addMonths, subMonths } from 'date-fns';

export interface UISlice {
  currentDate: Date;
  viewMode: 'admin' | 'user';
  isLoading: boolean;
  
  // Actions
  setCurrentDate: (date: Date) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  setViewMode: (mode: 'admin' | 'user') => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  currentDate: new Date(),
  viewMode: 'user',
  isLoading: false,

  setCurrentDate: (date: Date) => set({ currentDate: date }),
  
  goToPreviousMonth: () => {
    set(state => ({ currentDate: subMonths(state.currentDate, 1) }));
  },
  
  goToNextMonth: () => {
    set(state => ({ currentDate: addMonths(state.currentDate, 1) }));
  },
  
  setViewMode: (mode: 'admin' | 'user') => set({ viewMode: mode }),
});
