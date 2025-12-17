// Tipos para APIs
export interface BaseEntity {
  id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface User extends BaseEntity {
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
  [key: string]: unknown;
}

export interface Project extends BaseEntity {
  name?: string;
  description?: string;
  status?: string;
  owner_id?: number;
  settings?: Record<string, any>;
  [key: string]: unknown;
}
