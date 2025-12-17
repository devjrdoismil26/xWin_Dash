// Types for ProjectsCore module - Basic project operations
export interface ProjectCore {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string; }

export type ProjectStatus = 'active' | 'inactive' | 'archived' | 'draft';

export interface ProjectCoreFilters {
  status?: ProjectStatus;
  search?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string; }

export interface ProjectCoreMetrics {
  totalProjects: number;
  activeProjects: number;
  inactiveProjects: number;
  archivedProjects: number;
  projectsCreatedThisMonth: number;
  projectsUpdatedThisWeek: number; }

export interface ProjectCoreActivity {
  id: string;
  projectId: string;
  type: ProjectCoreActivityType;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  metadata?: Record<string, any>; }

export type ProjectCoreActivityType = 
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'deleted'
  | 'restored'
  | 'archived'
  | 'unarchived';

export interface ProjectCoreResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];

  error?: string;
}

export interface ProjectCorePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  pagination?: { page?: number;
  limit?: number;
  total?: number; };

  count?: number;
}

export interface ProjectCoreSearchResult {
  projects: ProjectCore[];
  pagination: ProjectCorePagination;
  filters: ProjectCoreFilters;
  total?: number;
  count?: number; }
