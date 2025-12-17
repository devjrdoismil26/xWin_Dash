import type { MediaFile, MediaFolder, MediaType } from './core.types';

export interface MediaSearchFilters {
  query?: string;
  type?: MediaType;
  folder_id?: string;
  tags?: string[];
  date_range?: { start: string;
  end: string;
};

  size_range?: { min: number; max: number};

  dimensions?: {
    min_width?: number;
    min_height?: number;
    max_width?: number;
    max_height?: number;};

  duration_range?: { min: number; max: number};

  is_public?: boolean;
  is_featured?: boolean;
  uploaded_by?: string;
  sort_by?: 'name' | 'size' | 'date' | 'type' | 'downloads' | 'views';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface MediaSearchResult {
  files: MediaFile[];
  folders: MediaFolder[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  facets: {
    types: { [key: string]: number;
};

    folders: { [key: string]: number};

    tags: { [key: string]: number};

    dates: { [key: string]: number};

    sizes: { [key: string]: number};
};

  suggestions: string[];
  search_time: number;
}
