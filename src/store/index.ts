
import { create } from 'zustand';
import { DutyWithUser, RubricType, User } from '../types';
import { addMonths, format, subMonths } from 'date-fns';

interface DutyState {
  currentDate: Date;
  viewMode: 'admin' | 'user';
  duties: DutyWithUser[];
  users: User[];
  rubrics: RubricType[];
  isAuthenticated: boolean;
  currentUser: User | null;
  
  // Actions
  setCurrentDate: (date: Date) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  setViewMode: (mode: 'admin' | 'user') => void;
  addDuty: (duty: DutyWithUser) => void;
  removeDuty: (dutyId: string) => void;
  updateDuty: (dutyId: string, updates: Partial<DutyWithUser>) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  login: (email: string, password: string) => void; // Simple mock login
  logout: () => void;
  
  // Selectors
  getDutiesForDate: (date: string) => DutyWithUser[];
  getDutiesForMonth: (year: number, month: number) => DutyWithUser[];
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1234567890',
    role: 'admin',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567891',
    role: 'user',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567892',
    role: 'user',
  },
];

const today = new Date();

const mockDuties: DutyWithUser[] = [
  {
    id: '1',
    userId: '2',
    type: 'Primary On-Call',
    date: format(today, 'yyyy-MM-dd'),
    user: mockUsers[1],
  },
  {
    id: '2',
    userId: '3',
    type: 'Secondary On-Call',
    date: format(today, 'yyyy-MM-dd'),
    user: mockUsers[2],
  },
  {
    id: '3',
    userId: '2',
    type: 'Operations',
    date: format(addMonths(today, -1), 'yyyy-MM-dd'),
    user: mockUsers[1],
  },
];

export const useStore = create<DutyState>((set, get) => ({
  currentDate: new Date(),
  viewMode: 'user',
  duties: mockDuties,
  users: mockUsers,
  rubrics: ["Primary On-Call", "Secondary On-Call", "Operations", "Support", "Maintenance"],
  isAuthenticated: false,
  currentUser: null,

  setCurrentDate: (date: Date) => set({ currentDate: date }),
  
  goToPreviousMonth: () => {
    set(state => ({ currentDate: subMonths(state.currentDate, 1) }));
  },
  
  goToNextMonth: () => {
    set(state => ({ currentDate: addMonths(state.currentDate, 1) }));
  },
  
  setViewMode: (mode: 'admin' | 'user') => set({ viewMode: mode }),
  
  addDuty: (duty: DutyWithUser) => {
    set(state => ({ duties: [...state.duties, duty] }));
  },
  
  removeDuty: (dutyId: string) => {
    set(state => ({
      duties: state.duties.filter(duty => duty.id !== dutyId)
    }));
  },
  
  updateDuty: (dutyId: string, updates: Partial<DutyWithUser>) => {
    set(state => ({
      duties: state.duties.map(duty => 
        duty.id === dutyId ? { ...duty, ...updates } : duty
      )
    }));
  },
  
  addUser: (user: User) => {
    set(state => ({ users: [...state.users, user] }));
  },
  
  removeUser: (userId: string) => {
    set(state => ({
      users: state.users.filter(user => user.id !== userId)
    }));
  },
  
  updateUser: (userId: string, updates: Partial<User>) => {
    set(state => ({
      users: state.users.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    }));
  },
  
  login: (email: string, password: string) => {
    // Simple mock login - in a real app, this would validate against a backend
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      set({ isAuthenticated: true, currentUser: user });
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({ isAuthenticated: false, currentUser: null });
  },

  getDutiesForDate: (date: string) => {
    return get().duties.filter(duty => duty.date === date);
  },
  
  getDutiesForMonth: (year: number, month: number) => {
    // Month is 0-indexed in JavaScript Date
    return get().duties.filter(duty => {
      const dutyDate = new Date(duty.date);
      return dutyDate.getFullYear() === year && dutyDate.getMonth() === month;
    });
  }
}));
