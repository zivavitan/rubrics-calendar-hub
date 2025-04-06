
import { create } from 'zustand';
import { createDutySlice, DutySlice } from './slices/dutySlice';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createRubricSlice, RubricSlice } from './slices/rubricSlice';
import { createAuthSlice, AuthSlice } from './slices/authSlice';
import { createUISlice, UISlice } from './slices/uiSlice';

// Combine all store slices
export type StoreState = DutySlice & UserSlice & RubricSlice & AuthSlice & UISlice;

// Create the combined store
export const useStore = create<StoreState>((...a) => ({
  ...createDutySlice(...a),
  ...createUserSlice(...a),
  ...createRubricSlice(...a),
  ...createAuthSlice(...a),
  ...createUISlice(...a),
}));
