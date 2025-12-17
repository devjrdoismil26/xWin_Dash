/**
 * Índice de tipos do módulo Settings
 */

export * from './base';
export * from './auth';
export * from './user';
export * from './system';
export * from './integrations';
export * from './notifications';

// Re-exportações para compatibilidade
export type { SystemSetting as Setting } from './base';
export type { SettingsResponse as SettingsApiResponse } from './base';
