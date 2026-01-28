import {
  WorkflowCanvasData,
  WorkflowCanvasNode,
  WorkflowCanvasEdge,
  WorkflowStep,
  WorkflowTrigger
} from '../types/workflowTypes';

// Cache para layouts de canvas
const canvasCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos (layouts mudam menos frequentemente)

// Interface para posição de nó
export interface NodePosition {
  x: number;
  y: number;
}

// Interface para dimensões de nó
export interface NodeDimensions {
  width: number;
  height: number;
}

// Interface para layout otimizado
export interface OptimizedLayout {
  nodes: Array<{
    id: string;
    position: NodePosition;
    dimensions: NodeDimensions;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    path?: string;
  }>;
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  metadata: {
    created_at: string;
    updated_at: string;
    version: string;
    optimization_score: number;
  };
}

// Interface para configuração de layout
export interface LayoutConfig {
  direction: 'horizontal' | 'vertical' | 'mixed';
  spacing: {
    horizontal: number;
    vertical: number;
  };
  alignment: 'left' | 'center' | 'right' | 'justify';
  auto_layout: boolean;
  compact_mode: boolean;
  show_grid: boolean;
  snap_to_grid: boolean;
  grid_size: number;
}

// Interface para estatísticas de canvas
export interface CanvasStats {
  total_nodes: number;
  total_edges: number;
  connected_nodes: number;
  orphan_nodes: number;
  complexity_score: number;
  layout_efficiency: number;
  visual_clarity: number;
}

/**
 * Service para gerenciamento de canvas de workflows
 * Responsável por layouts, otimização e persistência
 */
class WorkflowCanvasService {
  private readonly DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
    direction: 'horizontal',
    spacing: {
      horizontal: 200,
      vertical: 150
    },
    alignment: 'center',
    auto_layout: true,
    compact_mode: false,
    show_grid: true,
    snap_to_grid: true,
    grid_size: 20
  };

  /**
   * Salva layout do canvas
   */
  async saveCanvasLayout(
    workflowId: number,
    canvasData: WorkflowCanvasData,
    config?: LayoutConfig
  ): Promise<OptimizedLayout> {
    try {
      const layoutConfig = config || this.DEFAULT_LAYOUT_CONFIG;
      
      // Otimizar layout
      const optimizedLayout = this.optimizeLayout(canvasData, layoutConfig);
      
      // Salvar no cache
      const cacheKey = `canvas_layout_${workflowId}`;
      canvasCache.set(cacheKey, {
        data: optimizedLayout,
        timestamp: Date.now()
      });

      // Aqui você salvaria no backend
      // await apiClient.post(`/api/workflows/${workflowId}/canvas-layout`, optimizedLayout);
      
      return optimizedLayout;
    } catch (error) {
      console.error(`Erro ao salvar layout do canvas ${workflowId}:`, error);
      throw new Error('Falha ao salvar layout do canvas');
    }
  }

  /**
   * Carrega layout do canvas
   */
  async loadCanvasLayout(workflowId: number): Promise<OptimizedLayout | null> {
    try {
      const cacheKey = `canvas_layout_${workflowId}`;
      const cached = canvasCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      // Aqui você carregaria do backend
      // const response = await apiClient.get(`/api/workflows/${workflowId}/canvas-layout`);
      // return response.data;
      
      return null;
    } catch (error) {
      console.error(`Erro ao carregar layout do canvas ${workflowId}:`, error);
      throw new Error('Falha ao carregar layout do canvas');
    }
  }

  /**
   * Otimiza layout do canvas
   */
  optimizeLayout(canvasData: WorkflowCanvasData, config?: LayoutConfig): OptimizedLayout {
    try {
      const layoutConfig = config || this.DEFAULT_LAYOUT_CONFIG;
      
      // Aplicar algoritmo de layout
      const optimizedNodes = this.applyLayoutAlgorithm(canvasData.nodes || [], layoutConfig);
      const optimizedEdges = this.optimizeEdges(canvasData.edges || [], optimizedNodes);
      
      // Calcular viewport otimizado
      const viewport = this.calculateOptimalViewport(optimizedNodes);
      
      // Calcular score de otimização
      const optimizationScore = this.calculateOptimizationScore(optimizedNodes, optimizedEdges);

      return {
        nodes: optimizedNodes,
        edges: optimizedEdges,
        viewport,
        metadata: {
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: '1.0.0',
          optimization_score: optimizationScore
        }
      };
    } catch (error) {
      console.error('Erro ao otimizar layout:', error);
      throw new Error('Falha ao otimizar layout');
    }
  }

  /**
   * Aplica algoritmo de layout
   */
  private applyLayoutAlgorithm(nodes: WorkflowCanvasNode[], config: LayoutConfig): Array<{
    id: string;
    position: NodePosition;
    dimensions: NodeDimensions;
  }> {
    if (nodes.length === 0) return [];

    // Algoritmo de layout hierárquico
    if (config.direction === 'horizontal') {
      return this.applyHorizontalLayout(nodes, config);
    } else if (config.direction === 'vertical') {
      return this.applyVerticalLayout(nodes, config);
    } else {
      return this.applyMixedLayout(nodes, config);
    }
  }

  /**
   * Aplica layout horizontal
   */
  private applyHorizontalLayout(nodes: WorkflowCanvasNode[], config: LayoutConfig): Array<{
    id: string;
    position: NodePosition;
    dimensions: NodeDimensions;
  }> {
    const result: Array<{
      id: string;
      position: NodePosition;
      dimensions: NodeDimensions;
    }> = [];

    // Agrupar nós por nível hierárquico
    const levels = this.groupNodesByLevel(nodes);
    
    let currentX = 0;
    levels.forEach((levelNodes, levelIndex) => {
      let currentY = 0;
      const levelHeight = Math.max(...levelNodes.map(() => 100)); // Altura padrão
      
      levelNodes.forEach((node, nodeIndex) => {
        result.push({
          id: node.id,
          position: {
            x: currentX,
            y: currentY
          },
          dimensions: {
            width: 200, // Largura padrão
            height: 100  // Altura padrão
          }
        });
        
        currentY += levelHeight + config.spacing.vertical;
      });
      
      currentX += 200 + config.spacing.horizontal;
    });

    return result;
  }

  /**
   * Aplica layout vertical
   */
  private applyVerticalLayout(nodes: WorkflowCanvasNode[], config: LayoutConfig): Array<{
    id: string;
    position: NodePosition;
    dimensions: NodeDimensions;
  }> {
    const result: Array<{
      id: string;
      position: NodePosition;
      dimensions: NodeDimensions;
    }> = [];

    // Agrupar nós por nível hierárquico
    const levels = this.groupNodesByLevel(nodes);
    
    let currentY = 0;
    levels.forEach((levelNodes, levelIndex) => {
      let currentX = 0;
      const levelWidth = Math.max(...levelNodes.map(() => 200)); // Largura padrão
      
      levelNodes.forEach((node, nodeIndex) => {
        result.push({
          id: node.id,
          position: {
            x: currentX,
            y: currentY
          },
          dimensions: {
            width: 200, // Largura padrão
            height: 100  // Altura padrão
          }
        });
        
        currentX += levelWidth + config.spacing.horizontal;
      });
      
      currentY += 100 + config.spacing.vertical;
    });

    return result;
  }

  /**
   * Aplica layout misto
   */
  private applyMixedLayout(nodes: WorkflowCanvasNode[], config: LayoutConfig): Array<{
    id: string;
    position: NodePosition;
    dimensions: NodeDimensions;
  }> {
    // Implementar layout misto baseado na complexidade dos nós
    return this.applyHorizontalLayout(nodes, config);
  }

  /**
   * Agrupa nós por nível hierárquico
   */
  private groupNodesByLevel(nodes: WorkflowCanvasNode[]): WorkflowCanvasNode[][] {
    // Implementar agrupamento hierárquico
    // Por simplicidade, retornar todos os nós em um nível
    return [nodes];
  }

  /**
   * Otimiza arestas
   */
  private optimizeEdges(edges: WorkflowCanvasEdge[], optimizedNodes: Array<{
    id: string;
    position: NodePosition;
    dimensions: NodeDimensions;
  }>): Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    path?: string;
  }> {
    return edges.map(edge => {
      const sourceNode = optimizedNodes.find(n => n.id === edge.source);
      const targetNode = optimizedNodes.find(n => n.id === edge.target);
      
      let path = '';
      if (sourceNode && targetNode) {
        path = this.calculateOptimalPath(sourceNode, targetNode);
      }
      
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        path
      };
    });
  }

  /**
   * Calcula caminho otimizado entre nós
   */
  private calculateOptimalPath(sourceNode: {
    id: string;
    position: NodePosition;
    dimensions: NodeDimensions;
  }, targetNode: {
    id: string;
    position: NodePosition;
    dimensions: NodeDimensions;
  }): string {
    // Implementar algoritmo de caminho otimizado
    // Por simplicidade, retornar linha reta
    const startX = sourceNode.position.x + sourceNode.dimensions.width;
    const startY = sourceNode.position.y + sourceNode.dimensions.height / 2;
    const endX = targetNode.position.x;
    const endY = targetNode.position.y + targetNode.dimensions.height / 2;
    
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  /**
   * Calcula viewport otimizado
   */
  private calculateOptimalViewport(optimizedNodes: Array<{
    id: string;
    position: NodePosition;
    dimensions: NodeDimensions;
  }>): { x: number; y: number; zoom: number } {
    if (optimizedNodes.length === 0) {
      return { x: 0, y: 0, zoom: 1 };
    }

    // Calcular bounding box
    const minX = Math.min(...optimizedNodes.map(n => n.position.x));
    const minY = Math.min(...optimizedNodes.map(n => n.position.y));
    const maxX = Math.max(...optimizedNodes.map(n => n.position.x + n.dimensions.width));
    const maxY = Math.max(...optimizedNodes.map(n => n.position.y + n.dimensions.height));

    // Calcular centro
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Calcular zoom baseado no tamanho
    const width = maxX - minX;
    const height = maxY - minY;
    const maxDimension = Math.max(width, height);
    const zoom = maxDimension > 1000 ? 0.5 : maxDimension > 500 ? 0.75 : 1;

    return {
      x: centerX,
      y: centerY,
      zoom
    };
  }

  /**
   * Calcula score de otimização
   */
  private calculateOptimizationScore(
    optimizedNodes: Array<{
      id: string;
      position: NodePosition;
      dimensions: NodeDimensions;
    }>,
    optimizedEdges: Array<{
      id: string;
      source: string;
      target: string;
      sourceHandle?: string;
      targetHandle?: string;
      path?: string;
    }>
  ): number {
    let score = 100;

    // Penalizar por sobreposição de nós
    const overlaps = this.countNodeOverlaps(optimizedNodes);
    score -= overlaps * 10;

    // Penalizar por arestas longas
    const longEdges = this.countLongEdges(optimizedNodes, optimizedEdges);
    score -= longEdges * 5;

    // Penalizar por nós órfãos
    const orphanNodes = this.countOrphanNodes(optimizedNodes, optimizedEdges);
    score -= orphanNodes * 15;

    return Math.max(0, score);
  }

  /**
   * Conta sobreposições de nós
   */
  private countNodeOverlaps(optimizedNodes: Array<{
    id: string;
    position: NodePosition;
    dimensions: NodeDimensions;
  }>): number {
    let overlaps = 0;
    
    for (let i = 0; i < optimizedNodes.length; i++) {
      for (let j = i + 1; j < optimizedNodes.length; j++) {
        const node1 = optimizedNodes[i];
        const node2 = optimizedNodes[j];
        
        if (this.nodesOverlap(node1, node2)) {
          overlaps++;
        }
      }
    }
    
    return overlaps;
  }

  /**
   * Verifica se dois nós se sobrepõem
   */
  private nodesOverlap(node1: {
    position: NodePosition;
    dimensions: NodeDimensions;
  }, node2: {
    position: NodePosition;
    dimensions: NodeDimensions;
  }): boolean {
    return !(
      node1.position.x + node1.dimensions.width < node2.position.x ||
      node2.position.x + node2.dimensions.width < node1.position.x ||
      node1.position.y + node1.dimensions.height < node2.position.y ||
      node2.position.y + node2.dimensions.height < node1.position.y
    );
  }

  /**
   * Conta arestas longas
   */
  private countLongEdges(
    optimizedNodes: Array<{
      id: string;
      position: NodePosition;
      dimensions: NodeDimensions;
    }>,
    optimizedEdges: Array<{
      id: string;
      source: string;
      target: string;
    }>
  ): number {
    let longEdges = 0;
    const maxDistance = 300; // Distância máxima considerada "longa"
    
    optimizedEdges.forEach(edge => {
      const sourceNode = optimizedNodes.find(n => n.id === edge.source);
      const targetNode = optimizedNodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const distance = Math.sqrt(
          Math.pow(targetNode.position.x - sourceNode.position.x, 2) +
          Math.pow(targetNode.position.y - sourceNode.position.y, 2)
        );
        
        if (distance > maxDistance) {
          longEdges++;
        }
      }
    });
    
    return longEdges;
  }

  /**
   * Conta nós órfãos
   */
  private countOrphanNodes(
    optimizedNodes: Array<{
      id: string;
      position: NodePosition;
      dimensions: NodeDimensions;
    }>,
    optimizedEdges: Array<{
      id: string;
      source: string;
      target: string;
    }>
  ): number {
    const connectedNodes = new Set<string>();
    
    optimizedEdges.forEach(edge => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });
    
    return optimizedNodes.filter(node => !connectedNodes.has(node.id)).length;
  }

  /**
   * Obtém estatísticas do canvas
   */
  getCanvasStats(canvasData: WorkflowCanvasData): CanvasStats {
    const nodes = canvasData.nodes || [];
    const edges = canvasData.edges || [];
    
    const connectedNodes = new Set<string>();
    edges.forEach(edge => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });
    
    const orphanNodes = nodes.filter(node => !connectedNodes.has(node.id)).length;
    const complexityScore = this.calculateComplexityScore(nodes, edges);
    const layoutEfficiency = this.calculateLayoutEfficiency(nodes, edges);
    const visualClarity = this.calculateVisualClarity(nodes, edges);
    
    return {
      total_nodes: nodes.length,
      total_edges: edges.length,
      connected_nodes: connectedNodes.size,
      orphan_nodes: orphanNodes,
      complexity_score: complexityScore,
      layout_efficiency: layoutEfficiency,
      visual_clarity: visualClarity
    };
  }

  /**
   * Calcula score de complexidade
   */
  private calculateComplexityScore(nodes: WorkflowCanvasNode[], edges: WorkflowCanvasEdge[]): number {
    const nodeCount = nodes.length;
    const edgeCount = edges.length;
    const maxComplexity = 100;
    
    // Fórmula simples de complexidade
    const complexity = (nodeCount * 2) + (edgeCount * 1.5);
    return Math.min(maxComplexity, complexity);
  }

  /**
   * Calcula eficiência do layout
   */
  private calculateLayoutEfficiency(nodes: WorkflowCanvasNode[], edges: WorkflowCanvasEdge[]): number {
    // Implementar cálculo de eficiência baseado na distribuição dos nós
    return 75; // Valor padrão
  }

  /**
   * Calcula clareza visual
   */
  private calculateVisualClarity(nodes: WorkflowCanvasNode[], edges: WorkflowCanvasEdge[]): number {
    // Implementar cálculo de clareza visual baseado na organização
    return 80; // Valor padrão
  }

  /**
   * Limpa cache do canvas
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of canvasCache.keys()) {
        if (key.includes(pattern)) {
          canvasCache.delete(key);
        }
      }
    } else {
      canvasCache.clear();
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: canvasCache.size,
      keys: Array.from(canvasCache.keys())
    };
  }
}

// Instância singleton
export const workflowCanvasService = new WorkflowCanvasService();
export default workflowCanvasService;
