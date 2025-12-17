// =========================================
// EXPORTS - HOOKS DO MÓDULO SETTINGS
// =========================================

// Hook principal
export { useSettings } from './useSettings';
export type { UseSettingsReturn, UseSettingsState, UseSettingsActions } from './useSettings';

// Hook de otimização
export { useSettingsOptimization } from './useSettingsOptimization';
export type { UseSettingsOptimizationReturn, UseSettingsOptimizationState, UseSettingsOptimizationActions } from './useSettingsOptimization';

// Store Zustand
export { useSettingsStore, useSettingsSelectors } from './useSettingsStore';
export type { SettingsStore, SettingsStoreState, SettingsStoreActions } from './useSettingsStore';

// Hooks dos submódulos
export { useGeneralSettings } from '../GeneralSettings/hooks/useGeneralSettings';
export type { UseGeneralSettingsReturn, UseGeneralSettingsState, UseGeneralSettingsActions } from '../GeneralSettings/hooks/useGeneralSettings';

export { useAuthSettings } from '../AuthSettings/hooks/useAuthSettings';
export type { UseAuthSettingsReturn, UseAuthSettingsState, UseAuthSettingsActions } from '../AuthSettings/hooks/useAuthSettings';

export { useUserSettings } from '../UserSettings/hooks/useUserSettings';
export type { UseUserSettingsReturn, UseUserSettingsState, UseUserSettingsActions } from '../UserSettings/hooks/useUserSettings';
