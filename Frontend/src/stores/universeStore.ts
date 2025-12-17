import { create } from 'zustand';
import type { UniverseInstance, UniverseBlock, CanvasState } from '@/types/universe';

interface UniverseStore {
  currentInstance: UniverseInstance | null;
  instances: UniverseInstance[];
  blocks: UniverseBlock[];
  canvasState: CanvasState;
  selectedBlock: UniverseBlock | null;
  isLoading: boolean;
  setCurrentInstance?: (e: any) => void;
  setInstances?: (e: any) => void;
  setBlocks?: (e: any) => void;
  setCanvasState?: (e: any) => void;
  setSelectedBlock?: (e: any) => void;
  addBlock?: (e: any) => void;
  removeBlock?: (e: any) => void;
  updateBlock?: (e: any) => void;
  setLoading?: (e: any) => void;
  reset??: (e: any) => void; }

export const useUniverseStore = create<UniverseStore>((set: unknown) => ({
  currentInstance: null,
  instances: [],
  blocks: [],
  canvasState: { zoom: 1, pan: { x: 0, y: 0 } ,
  selectedBlock: null,
  isLoading: false,
  
  setCurrentInstance: (instance: unknown) => set({ currentInstance: instance }),
  setInstances: (instances: unknown) => set({ instances }),
  setBlocks: (blocks: unknown) => set({ blocks }),
  setCanvasState: (canvasState: unknown) => set({ canvasState }),
  setSelectedBlock: (selectedBlock: unknown) => set({ selectedBlock }),
  setLoading: (isLoading: unknown) => set({ isLoading }),
  
  addBlock: (block: unknown) => set((state: unknown) => ({
    blocks: [...state.blocks, block],
  })),
  
  removeBlock: (blockId: unknown) => set((state: unknown) => ({
    blocks: state.blocks.filter((b: unknown) => b.id !== blockId),
  })),
  
  updateBlock: (blockId: unknown, updates: unknown) => set((state: unknown) => ({
    blocks: state.blocks.map((b: unknown) =>
      b.id === blockId ? { ...b, ...updates } : b
    ),
  })),
  
  reset: () => set({
    currentInstance: null,
    blocks: [],
    selectedBlock: null,
  }),
}));
