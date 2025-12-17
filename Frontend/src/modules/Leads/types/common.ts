// ========================================
// TIPOS COMUNS DO MÓDULO LEADS
// ========================================

/**
 * Interface básica de autenticação
 */
export interface AuthUser {
  id: string | number;
  name: string;
  email: string;
  permissions?: string[];
  roles?: string[];
  avatar?: string; }

/**
 * Interface básica de Tag
 */
export interface Tag {
  id: number | string;
  name: string;
  description?: string;
  color?: string;
  slug?: string;
  type?: string;
  project_id?: number | string;
  usage_count?: number; }

/**
 * Interface básica de Stats
 */
export interface Stats {
  total?: number;
  active?: number;
  inactive?: number;
  [key: string]: number | string | undefined; }

/**
 * Interface básica de Pagination
 */
export interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number; }

/**
 * Interface básica de Filters
 */
export interface Filters {
  search?: string;
  status?: string[];
  [key: string]: string | string[] | number | undefined; }
