/**
 * Tipos básicos para o módulo Settings
 */

export interface SystemSetting {
  id: string;
  key: string;
  value: string | number | boolean | Record<string, any> | unknown[];
  description?: string;
  created_at: string;
  updated_at: string; }

export type Setting = SystemSetting;

export interface SettingsResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export type SettingsApiResponse = SettingsResponse;

export interface SettingsFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown; }

export interface SettingsCategory {
  id: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  groups: SettingsGroup[];
  is_visible: boolean;
  permissions: string[];
  [key: string]: unknown; }

export interface SettingsGroup {
  id: string;
  name: string;
  label: string;
  description: string;
  category_id: string;
  order: number;
  settings: SystemSetting[];
  is_visible: boolean;
  permissions: string[]; }
