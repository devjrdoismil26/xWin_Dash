export interface ProductResponse {
  id: number;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  status?: 'active' | 'inactive' | 'draft';
  created_at?: string;
  updated_at?: string; }

export interface ProductsFilter {
  search?: string;
  category?: string;
  status?: string;
  price_min?: number;
  price_max?: number;
  page?: number;
  limit?: number; }
