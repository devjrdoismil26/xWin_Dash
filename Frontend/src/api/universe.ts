import axios from "axios";
import type {
  UniverseInstance,
  UniverseBlock,
  UniverseTemplate,
  BlockMarketplace,
} from "@/types/universe";

const api = axios.create({
  baseURL: "/api/universe",
  headers: {
    "Content-Type": "application/json",
  },
});

export const universeApi = {
  // Instances
  getInstances: (params?: { active?: boolean; search?: string }) =>
    api.get<{ data: UniverseInstance[] }>("/instances", { params }),

  getInstance: (id: string) => api.get<UniverseInstance>(`/instances/${id}`),

  createInstance: (data: Partial<UniverseInstance>) =>
    api.post<UniverseInstance>("/instances", data),

  updateInstance: (id: string, data: Partial<UniverseInstance>) =>
    api.put<UniverseInstance>(`/instances/${id}`, data),

  deleteInstance: (id: string) => api.delete(`/instances/${id}`),

  duplicateInstance: (id: string, newName: string) =>
    api.post<UniverseInstance>(`/instances/${id}/duplicate`, { name: newName }),

  // Blocks
  addBlock: (
    instanceId: string,
    data: {
      block_type: string;
      config: Record<string, any>;
      position: { x: number; y: number};

    },
  ) => api.post<UniverseBlock>(`/instances/${instanceId}/blocks/add`, data),

  removeBlock: (instanceId: string, blockId: string) =>
    api.delete(`/instances/${instanceId}/blocks/${blockId}`),

  updateBlock: (blockId: string, config: Record<string, any>) =>
    api.put<UniverseBlock>(`/blocks/${blockId}`, { config }),

  connectBlocks: (sourceId: string, targetId: string, config?: Record<string, any>) =>
    api.post(`/blocks/${sourceId}/connect/${targetId}`, config),

  // Canvas
  saveCanvas: (instanceId: string, canvasState: Record<string, any>) =>
    api.post(`/instances/${instanceId}/canvas/save`, {
      canvas_state: canvasState,
    }),

  loadCanvas: (instanceId: string) =>
    api.get<{ canvas_state: Record<string, any>; blocks: UniverseBlock[] }>(
      `/instances/${instanceId}/canvas`,
    ),

  // Templates
  getTemplates: (params?: { category?: string; featured?: boolean }) =>
    api.get<{ data: UniverseTemplate[] }>("/templates", { params }),

  installTemplate: (id: string) =>
    api.post<UniverseInstance>(`/templates/${id}/install`),

  // Marketplace
  getMarketplaceBlocks: (params?: { category?: string; search?: string }) =>
    api.get<{ data: BlockMarketplace[] }>("/blocks/marketplace", { params }),

  getFeaturedBlocks: () =>
    api.get<BlockMarketplace[]>("/blocks/marketplace/featured"),

  installBlock: (blockId: string) =>
    api.post(`/blocks/marketplace/${blockId}/install`),

  // AI
  personalizeInstance: (instanceId: string) =>
    api.post("/ai/personalize", { instance_id: instanceId }),

  analyzeInstance: (instanceId: string) => api.get(`/ai/analyze/${instanceId}`),};
