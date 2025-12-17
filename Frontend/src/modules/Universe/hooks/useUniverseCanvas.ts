import { useState, useCallback, useRef, useEffect } from 'react';
import { UniverseBlock, UniverseConnection } from '../types/universe';

export interface CanvasState {
  zoom: number;
  pan: { x: number;
  y: number;
};

  selectedBlocks: string[];
  selectedConnections: string[];
  isDragging: boolean;
  isConnecting: boolean;
  connectionStart: string | null;
  connectionEnd: string | null;
  hoveredBlock: string | null;
  hoveredConnection: string | null;
}

export interface CanvasSettings {
  gridSize: number;
  snapToGrid: boolean;
  showGrid: boolean;
  showMiniMap: boolean;
  showControls: boolean;
  autoSave: boolean;
  theme: 'light' | 'dark' | 'auto';
  backgroundVariant: 'dots' | 'lines' | 'cross' | 'galaxy';
  [key: string]: unknown; }

export const useUniverseCanvas = () => {
  const [blocks, setBlocks] = useState<UniverseBlock[]>([]);

  const [connections, setConnections] = useState<UniverseConnection[]>([]);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    selectedBlocks: [],
    selectedConnections: [],
    isDragging: false,
    isConnecting: false,
    connectionStart: null,
    connectionEnd: null,
    hoveredBlock: null,
    hoveredConnection: null,
  });

  const [settings, setSettings] = useState<CanvasSettings>({
    gridSize: 20,
    snapToGrid: true,
    showGrid: true,
    showMiniMap: true,
    showControls: true,
    autoSave: true,
    theme: 'dark',
    backgroundVariant: 'galaxy',
  });

  const [isRunning, setIsRunning] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const lastPanRef = useRef({ x: 0, y: 0 });

  const lastZoomRef = useRef(1);

  // Zoom functions
  const zoomIn = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 3)
  }));

  }, []);

  const zoomOut = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, 0.1)
  }));

  }, []);

  const resetZoom = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: 1,
      pan: { x: 0, y: 0 } ));

  }, []);

  const fitToView = useCallback(() => {
    if (blocks.length === 0) return;
    
    const bounds = blocks.reduce((acc: unknown, block: unknown) => {
      return {
        minX: Math.min(acc.minX, block.position.x),
        minY: Math.min(acc.minY, block.position.y),
        maxX: Math.max(acc.maxX, block.position.x + 200),
        maxY: Math.max(acc.maxY, block.position.y + 100),};

    }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;

    const canvasWidth = canvasRef.current?.clientWidth || 800;
    const canvasHeight = canvasRef.current?.clientHeight || 600;

    const scaleX = canvasWidth / width;
    const scaleY = canvasHeight / height;
    const scale = Math.min(scaleX, scaleY, 1) * 0.8;

    setCanvasState(prev => ({
      ...prev,
      zoom: scale,
      pan: {
        x: canvasWidth / 2 - centerX * scale,
        y: canvasHeight / 2 - centerY * scale
      } ));

  }, [blocks]);

  // Pan functions
  const panTo = useCallback((x: number, y: number) => {
    setCanvasState(prev => ({
      ...prev,
      pan: { x, y } ));

  }, []);

  const panBy = useCallback((deltaX: number, deltaY: number) => {
    setCanvasState(prev => ({
      ...prev,
      pan: {
        x: prev.pan.x + deltaX,
        y: prev.pan.y + deltaY
      } ));

  }, []);

  // Block functions
  const addBlock = useCallback((block: Omit<UniverseBlock, 'id'>) => {
    const newBlock: UniverseBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,};

    setBlocks(prev => [...prev, newBlock]);

    return newBlock;
  }, []);

  const updateBlock = useCallback((id: string, updates: Partial<UniverseBlock>) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));

  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));

    setConnections(prev => prev.filter(conn => 
      conn.source !== id && conn.target !== id
    ));

    setCanvasState(prev => ({
      ...prev,
      selectedBlocks: prev.selectedBlocks.filter(blockId => blockId !== id),
      hoveredBlock: prev.hoveredBlock === id ? null : prev.hoveredBlock
    }));

  }, []);

  const selectBlock = useCallback((id: string, multiSelect = false) => {
    setCanvasState(prev => ({
      ...prev,
      selectedBlocks: multiSelect 
        ? prev.selectedBlocks.includes(id)
          ? prev.selectedBlocks.filter(blockId => blockId !== id)
          : [...prev.selectedBlocks, id]
        : [id],
      selectedConnections: []
    }));

  }, []);

  const clearSelection = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      selectedBlocks: [],
      selectedConnections: []
    }));

  }, []);

  // Connection functions
  const addConnection = useCallback((connection: Omit<UniverseConnection, 'id'>) => {
    const newConnection: UniverseConnection = {
      ...connection,
      id: `connection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,};

    setConnections(prev => [...prev, newConnection]);

    return newConnection;
  }, []);

  const updateConnection = useCallback((id: string, updates: Partial<UniverseConnection>) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id ? { ...conn, ...updates } : conn
    ));

  }, []);

  const deleteConnection = useCallback((id: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== id));

    setCanvasState(prev => ({
      ...prev,
      selectedConnections: prev.selectedConnections.filter(connId => connId !== id),
      hoveredConnection: prev.hoveredConnection === id ? null : prev.hoveredConnection
    }));

  }, []);

  const selectConnection = useCallback((id: string, multiSelect = false) => {
    setCanvasState(prev => ({
      ...prev,
      selectedConnections: multiSelect 
        ? prev.selectedConnections.includes(id)
          ? prev.selectedConnections.filter(connId => connId !== id)
          : [...prev.selectedConnections, id]
        : [id],
      selectedBlocks: []
    }));

  }, []);

  // Drag and drop
  const startDrag = useCallback((blockId: string, startPosition: { x: number; y: number }) => {
    setCanvasState(prev => ({
      ...prev,
      isDragging: true,
      selectedBlocks: prev.selectedBlocks.includes(blockId) ? prev.selectedBlocks : [blockId]
    }));

    lastPanRef.current = { x: startPosition.x, y: startPosition.y};

  }, []);

  const updateDrag = useCallback((currentPosition: { x: number; y: number }) => {
    if (!canvasState.isDragging) return;

    const deltaX = currentPosition.x - lastPanRef.current.x;
    const deltaY = currentPosition.y - lastPanRef.current.y;

    setBlocks(prev => prev.map(block => {
      if (canvasState.selectedBlocks.includes(block.id)) {
        const newX = block.position.x + deltaX / canvasState.zoom;
        const newY = block.position.y + deltaY / canvasState.zoom;
        
        return {
          ...block,
          position: {
            x: settings.snapToGrid ? Math.round(newX / settings.gridSize) * settings.gridSize : newX,
            y: settings.snapToGrid ? Math.round(newY / settings.gridSize) * settings.gridSize : newY
          } ;

      }
      return block;
    }));

    lastPanRef.current = currentPosition;
  }, [canvasState.isDragging, canvasState.selectedBlocks, canvasState.zoom, settings.snapToGrid, settings.gridSize]);

  const endDrag = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      isDragging: false
    }));

  }, []);

  // Connection creation
  const startConnection = useCallback((blockId: string, handleId?: string) => {
    setCanvasState(prev => ({
      ...prev,
      isConnecting: true,
      connectionStart: blockId,
      connectionEnd: null
    }));

  }, []);

  const updateConnectionEnd = useCallback((blockId: string, handleId?: string) => {
    setCanvasState(prev => ({
      ...prev,
      connectionEnd: blockId
    }));

  }, []);

  const endConnection = useCallback((targetBlockId: string, targetHandleId?: string) => {
    if (!canvasState.connectionStart || canvasState.connectionStart === targetBlockId) {
      setCanvasState(prev => ({
        ...prev,
        isConnecting: false,
        connectionStart: null,
        connectionEnd: null
      }));

      return;
    }

    const newConnection = addConnection({
      source: canvasState.connectionStart,
      target: targetBlockId,
      sourceHandle: 'output',
      targetHandle: targetHandleId || 'input',
      type: 'data',
      data: {
        type: 'data',
        status: 'active'
      },
      animated: true,
      style: {
        stroke: '#8B5CF6',
        strokeWidth: 2
      } );

    setCanvasState(prev => ({
      ...prev,
      isConnecting: false,
      connectionStart: null,
      connectionEnd: null
    }));

    return newConnection;
  }, [canvasState.connectionStart, addConnection]);

  const cancelConnection = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      isConnecting: false,
      connectionStart: null,
      connectionEnd: null
    }));

  }, []);

  // Hover effects
  const setHoveredBlock = useCallback((blockId: string | null) => {
    setCanvasState(prev => ({
      ...prev,
      hoveredBlock: blockId
    }));

  }, []);

  const setHoveredConnection = useCallback((connectionId: string | null) => {
    setCanvasState(prev => ({
      ...prev,
      hoveredConnection: connectionId
    }));

  }, []);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<CanvasSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));

  }, []);

  // Canvas operations
  const duplicateSelection = useCallback(() => {
    const selectedBlocks = blocks.filter(block => 
      canvasState.selectedBlocks.includes(block.id));

    const duplicatedBlocks = selectedBlocks.map(block => ({
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: block.position.x + 50,
        y: block.position.y + 50
      } ));

    setBlocks(prev => [...prev, ...duplicatedBlocks]);

  }, [blocks, canvasState.selectedBlocks]);

  const deleteSelection = useCallback(() => {
    // Delete selected blocks
    setBlocks(prev => prev.filter(block => 
      !canvasState.selectedBlocks.includes(block.id)
    ));

    // Delete selected connections
    setConnections(prev => prev.filter(conn => 
      !canvasState.selectedConnections.includes(conn.id)
    ));

    // Clear selection
    clearSelection();

  }, [canvasState.selectedBlocks, canvasState.selectedConnections, clearSelection]);

  const alignSelection = useCallback((direction: 'left' | 'right' | 'top' | 'bottom' | 'center') => {
    const selectedBlocks = blocks.filter(block => 
      canvasState.selectedBlocks.includes(block.id));

    if (selectedBlocks.length < 2) return;

    let targetValue: number;

    switch (direction) {
      case 'left':
        targetValue = Math.min(...selectedBlocks.map(block => block.position.x));

        break;
      case 'right':
        targetValue = Math.max(...selectedBlocks.map(block => block.position.x + 200));

        break;
      case 'top':
        targetValue = Math.min(...selectedBlocks.map(block => block.position.y));

        break;
      case 'bottom':
        targetValue = Math.max(...selectedBlocks.map(block => block.position.y + 100));

        break;
      case 'center': {
        const centerX = selectedBlocks.reduce((sum: unknown, block: unknown) => sum + block.position.x, 0) / selectedBlocks.length;
        targetValue = centerX;
        break;
      } setBlocks(prev => prev.map(block => {
      if (canvasState.selectedBlocks.includes(block.id)) {
        const newPosition = { ...block.position};

        switch (direction) {
          case 'left':
            newPosition.x = targetValue;
            break;
          case 'right':
            newPosition.x = targetValue - 200;
            break;
          case 'top':
            newPosition.y = targetValue;
            break;
          case 'bottom':
            newPosition.y = targetValue - 100;
            break;
          case 'center':
            newPosition.x = targetValue;
            break;
        }
        
        return { ...block, position: newPosition};

      }
      return block;
    }));

  }, [blocks, canvasState.selectedBlocks]);

  // Auto-save
  useEffect(() => {
    if (settings.autoSave && blocks.length > 0) {
      const timeoutId = setTimeout(() => {
        // Auto-save logic would go here
      }, 2000);

      return () => clearTimeout(timeoutId);

    } , [blocks, connections, settings.autoSave]);

  return {
    // State
    blocks,
    connections,
    canvasState,
    settings,
    isRunning,
    isSaving,
    error,
    canvasRef,
    
    // Zoom functions
    zoomIn,
    zoomOut,
    resetZoom,
    fitToView,
    
    // Pan functions
    panTo,
    panBy,
    
    // Block functions
    addBlock,
    updateBlock,
    deleteBlock,
    selectBlock,
    clearSelection,
    
    // Connection functions
    addConnection,
    updateConnection,
    deleteConnection,
    selectConnection,
    
    // Drag and drop
    startDrag,
    updateDrag,
    endDrag,
    
    // Connection creation
    startConnection,
    updateConnectionEnd,
    endConnection,
    cancelConnection,
    
    // Hover effects
    setHoveredBlock,
    setHoveredConnection,
    
    // Settings
    updateSettings,
    
    // Canvas operations
    duplicateSelection,
    deleteSelection,
    alignSelection,
    
    // Actions
    setBlocks,
    setConnections,
    setIsRunning,
    setIsSaving,
    setError,};
};
