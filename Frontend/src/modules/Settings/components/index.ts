// =========================================
// EXPORTS - COMPONENTES DO MÓDULO SETTINGS
// =========================================

// Componente principal do módulo
export { SettingsModule } from './SettingsModule';
export type { SettingsModuleProps } from './SettingsModule';

// Componentes principais
export { SettingsDashboard } from './SettingsDashboard';
export type { SettingsDashboardProps, SettingsCategory } from './SettingsDashboard';

export { SettingsHeader } from './SettingsHeader';
export type { SettingsHeaderProps } from './SettingsHeader';

export { SettingsCard } from './SettingsCard';
export type { SettingsCardProps, SettingItem } from './SettingsCard';

export { SettingsToggle } from './SettingsToggle';
export type { SettingsToggleProps } from './SettingsToggle';

// Componentes de criação/edição
export { default as SettingsCreateEdit } from './SettingsCreateEdit';
export { default as SettingsForm } from './SettingsForm';
export { default as SettingsValidation } from './SettingsValidation';
export { default as SettingsDependencies } from './SettingsDependencies';
export { default as SettingsAdvanced } from './SettingsAdvanced';

// Componentes de configuração
export { GeneralSettings } from './GeneralSettings';
export type { GeneralSettingsProps } from './GeneralSettings';

export { AuthSettings } from './AuthSettings';
export type { AuthSettingsProps } from './AuthSettings';

export { UserSettings } from './UserSettings';
export type { UserSettingsProps } from './UserSettings';
