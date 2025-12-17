import React from 'react';
import SettingsModule from './SettingsModule';

// =========================================
// COMPONENTE PRINCIPAL REFATORADO
// =========================================

const SettingsIndex: React.FC = () => {
  return <SettingsModule />;};

// =========================================
// EXPORTS
// =========================================

export default SettingsIndex;

// Re-exportar componentes principais
export { default as SettingsModule } from './SettingsModule';
export { SettingsDashboard } from './components/SettingsDashboard';
export { default as SettingsCreateEdit } from './components/SettingsCreateEdit';

// Re-exportar hooks
export { useSettings } from './hooks/useSettings';
export { useSettingsStore } from './hooks/useSettingsStore';

// Re-exportar services
export { settingsService } from './services/settingsService';

// Re-exportar types
export * from './types/settingsTypes';
