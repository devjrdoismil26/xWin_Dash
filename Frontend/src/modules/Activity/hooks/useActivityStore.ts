import { create } from 'zustand';

interface ActivityState {
  activities: string[];
  loading: boolean;
  fetchActivities: () => Promise<void>;
  addActivity?: (e: any) => void; }

export const useActivityStore = create<ActivityState>((set: unknown) => ({
  activities: [],
  loading: false,
  
  fetchActivities: async () => {
    set({ loading: true });

    try {
      // API call
      set({ activities: [] });

    } finally {
      set({ loading: false });

    } ,
  
  addActivity: (activity: unknown) => {
    set((state: unknown) => ({ activities: [...state.activities, activity] }));

  } ));

export default useActivityStore;
