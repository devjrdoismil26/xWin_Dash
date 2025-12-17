import { create } from 'zustand';

interface SettingsState {
  settings: Record<string, any>;
  loading: boolean;
  error: string | null;
  updateSetting?: (e: any) => void;
  loadSettings: () => Promise<void>;
  resetSettings??: (e: any) => void;
  [key: string]: unknown; }

export const useSettingsStore = create<SettingsState>((set: unknown) => ({
  settings: {},
  loading: false,
  error: null,
  
  updateSetting: (key: unknown, value: unknown) => 
    set((state: unknown) => ({ settings: { ...state.settings, [key]: value } )),
  
  loadSettings: async () => {
    set({ loading: true, error: null });

    try {
      // API call here
      set({ loading: false });

    } catch (error: unknown) {
      set({ error: (error as any).message, loading: false });

    } ,
  
  resetSettings: () => set({ settings: {}, error: null })
  }));

export default useSettingsStore;
