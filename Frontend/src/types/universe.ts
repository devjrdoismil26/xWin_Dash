export interface UniverseInstance {
  id: string;
  user_id: number;
  template_id?: string;
  project_id?: string;
  name: string;
  description?: string;
  modules_config: Record<string, any>;
  blocks_config: string[];
  canvas_state: CanvasState;
  is_active: boolean;
  last_accessed_at: string;
  created_at: string;
  updated_at: string; }

export interface UniverseBlock {
  id: string;
  instance_id: string;
  block_type: string;
  config: Record<string, any>;
  position: { x: number;
  y: number;
};

  is_active: boolean;
  connections?: BlockConnection[];
}

export interface BlockConnection {
  id: string;
  source_block_id: string;
  target_block_id: string;
  connection_type: string;
  config: Record<string, any>; }

export interface CanvasState {
  zoom: number;
  pan: { x: number;
  y: number;
};

  viewport?: { width: number; height: number};

}

export interface UniverseTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview_image?: string;
  demo_url?: string;
  is_public: boolean;
  is_featured: boolean;
  usage_count: number;
  average_rating: number; }

export interface BlockMarketplace {
  id: string;
  name: string;
  description: string;
  category: string;
  block_type: string;
  icon?: string;
  version: string;
  is_verified: boolean;
  is_featured: boolean;
  rating: number;
  download_count: number;
  price: number; }
