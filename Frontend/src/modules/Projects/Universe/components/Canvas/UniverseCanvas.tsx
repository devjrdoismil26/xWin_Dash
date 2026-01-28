import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  OnConnect,
  ReactFlowProvider,
  Panel,
  NodeOrigin,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { UniverseBlock, UniverseConnection } from '../../types/universe';
import { BaseBlockProps } from '../../types/blocks';
import CustomConnectionLine from './CustomConnectionLine';
import { cn } from '@/lib/utils';
// Import block components
import DashboardBlock from '../../blocks/Core/DashboardBlock';
// import AnalyticsBlock from '../../blocks/Core/AnalyticsBlock';
// import WorkflowsBlock from '../../blocks/Core/WorkflowsBlock';
import AILaboratoryBlock from '../../blocks/AI/AILaboratoryBlock';
// import AIAgentBlock from '../../blocks/AI/AIAgentBlock';
import EmailBlock from '../../blocks/Marketing/EmailBlock';
// import SocialBlock from '../../blocks/Marketing/SocialBlock';
// import LeadsBlock from '../../blocks/Marketing/LeadsBlock';
import AuraBlock from '../../blocks/Integrations/AuraBlock';
// import WebBrowserBlock from '../../blocks/Integrations/WebBrowserBlock';
// import MediaBlock from '../../blocks/Integrations/MediaBlock';
interface UniverseCanvasProps {
  blocks: UniverseBlock[];
  connections: UniverseConnection[];
  onBlocksChange: (blocks: UniverseBlock[]) => void;
  onConnectionsChange: (connections: UniverseConnection[]) => void;
  selectedBlock?: UniverseBlock | null;
  onBlockSelect?: (block: UniverseBlock | null) => void;
  isRunning?: boolean;
  onBlockUpdate?: (blockId: string, data: any) => void;
  onBlockDelete?: (blockId: string) => void;
  className?: string;
}
// Define node types
const nodeTypes = {
  dashboard: DashboardBlock,
  analytics: AnalyticsBlock,
  workflows: WorkflowsBlock,
  aiLaboratory: AILaboratoryBlock,
  aiAgent: AIAgentBlock,
  emailMarketing: EmailBlock,
  socialBuffer: SocialBlock,
  leads: LeadsBlock,
  aura: AuraBlock,
  webBrowser: WebBrowserBlock,
  mediaLibrary: MediaBlock,
};
const UniverseCanvas: React.FC<UniverseCanvasProps> = ({
  blocks,
  connections,
  onBlocksChange,
  onConnectionsChange,
  selectedBlock,
  onBlockSelect,
  isRunning = false,
  onBlockUpdate,
  onBlockDelete,
  className
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [gridSize, setGridSize] = useState(20);
  const [backgroundVariant, setBackgroundVariant] = useState<'dots' | 'lines' | 'cross'>('dots');
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  // Convert blocks to ReactFlow nodes
  useEffect(() => {
    const reactFlowNodes: Node[] = blocks.map(block => ({
      id: block.id,
      type: block.type,
      position: block.position,
      data: {
        ...block.data,
        onUpdate: (data: any) => onBlockUpdate?.(block.id, data),
        onDelete: () => onBlockDelete?.(block.id),
      },
      selected: selectedBlock?.id === block.id,
    }));
    setNodes(reactFlowNodes);
  }, [blocks, selectedBlock, onBlockUpdate, onBlockDelete]);
  // Convert connections to ReactFlow edges
  useEffect(() => {
    const reactFlowEdges: Edge[] = connections.map(connection => ({
      id: connection.id,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      animated: connection.animated,
      style: connection.style,
      data: connection.data,
    }));
    setEdges(reactFlowEdges);
  }, [connections]);
  const onConnect: OnConnect = useCallback(
    (params) => {
      const newConnection: UniverseConnection = {
        id: `connection-${Date.now()}`,
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        type: 'data',
        data: {
          type: 'data',
          status: 'active',
        },
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      };
      const newEdge = {
        ...params,
        id: newConnection.id,
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        data: newConnection.data,
      };
      setEdges((eds) => addEdge(newEdge, eds));
      onConnectionsChange([...connections, newConnection]);
    },
    [connections, onConnectionsChange]
  );
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      if (position) {
        const newBlock: UniverseBlock = {
          id: `${type}-${Date.now()}`,
          type: type as any,
          position,
          data: { 
            label: `${type} block`,
            description: `A ${type} block for your workflow`,
          },
          status: 'active',
          configuration: {},
          connections: [],
          metadata: {
            category: 'core',
            version: '1.0.0',
            dependencies: [],
            permissions: [],
            tags: [],
          },
        };
        onBlocksChange([...blocks, newBlock]);
      }
    },
    [reactFlowInstance, blocks, onBlocksChange]
  );
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const block = blocks.find(b => b.id === node.id);
    onBlockSelect?.(block || null);
  }, [blocks, onBlockSelect]);
  const onPaneClick = useCallback(() => {
    onBlockSelect?.(null);
  }, [onBlockSelect]);
  const nodeOrigin: NodeOrigin = [0.5, 0];
  return (
    <div 
      className={cn("h-full w-full", className)} 
      ref={reactFlowWrapper}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        nodeOrigin={nodeOrigin}
        connectionLineComponent={CustomConnectionLine}
        fitView
        attributionPosition="bottom-left"
        className={cn(
          "bg-gray-50",
          isRunning && "ring-2 ring-green-500 ring-opacity-50"
        )}
      >
        <Background 
          variant={backgroundVariant} 
          gap={gridSize} 
          size={1} 
          color="#64748b20" 
        />
        {showControls && <Controls />}
        {showMiniMap && (
          <MiniMap 
            nodeColor="#3b82f6"
            nodeStrokeWidth={3}
            zoomable
            pannable
            className="bg-white border border-gray-200 rounded-lg"
          />
        )}
        {/* Control Panels */}
        <Panel position="top-left">
          <div className="bg-white rounded-lg shadow-lg p-2 space-y-2">
            <div className="text-xs font-medium text-gray-600 mb-1">Canvas Controls</div>
            <div className="flex gap-1">
              <button
                onClick={() => setBackgroundVariant('dots')}
                className={cn(
                  "px-2 py-1 rounded text-xs transition-colors",
                  backgroundVariant === 'dots' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                )}
              >
                Dots
              </button>
              <button
                onClick={() => setBackgroundVariant('lines')}
                className={cn(
                  "px-2 py-1 rounded text-xs transition-colors",
                  backgroundVariant === 'lines' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                )}
              >
                Lines
              </button>
              <button
                onClick={() => setBackgroundVariant('cross')}
                className={cn(
                  "px-2 py-1 rounded text-xs transition-colors",
                  backgroundVariant === 'cross' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                )}
              >
                Cross
              </button>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setShowMiniMap(!showMiniMap)}
                className={cn(
                  "px-2 py-1 rounded text-xs transition-colors",
                  showMiniMap 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                )}
              >
                MiniMap
              </button>
              <button
                onClick={() => setShowControls(!showControls)}
                className={cn(
                  "px-2 py-1 rounded text-xs transition-colors",
                  showControls 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                )}
              >
                Controls
              </button>
            </div>
          </div>
        </Panel>
        <Panel position="bottom-right">
          <div className="bg-white rounded-lg shadow-lg p-2 text-xs space-y-1">
            <div className="font-medium text-gray-600">Canvas Stats</div>
            <div>Blocks: {blocks.length}</div>
            <div>Connections: {connections.length}</div>
            {selectedBlock && <div>Selected: {selectedBlock.type}</div>}
            {isRunning && (
              <div className="text-green-600 font-medium">● Running</div>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};
export default UniverseCanvas;
