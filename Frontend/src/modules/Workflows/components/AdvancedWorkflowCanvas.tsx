import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Square, Save, Download, Upload, Settings, Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, Grid, Layers, Search, Filter, MoreHorizontal } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Badge from '@/shared/components/ui/Badge';
import Modal from '@/shared/components/ui/Modal';
import useToast from '@/shared/components/ui/useToast';
import { nodeConfigs, nodeCategories } from './nodeConfigs';
const AdvancedWorkflowCanvas = ({ 
  workflowId, 
  initialNodes = [] as unknown[], 
  initialEdges = [] as unknown[],
  onSave,
  onExecute,
  onSimulate,
  readOnly = false 
}) => {
  const { toast } = useToast();

  const canvasRef = useRef<any>(null);

  const [nodes, setNodes] = useState(initialNodes);

  const [edges, setEdges] = useState(initialEdges);

  const [selectedNode, setSelectedNode] = useState<any>(null);

  const [draggedNode, setDraggedNode] = useState<any>(null);

  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });

  const [canvasScale, setCanvasScale] = useState(1);

  const [isExecuting, setIsExecuting] = useState(false);

  const [showNodePalette, setShowNodePalette] = useState(false);

  const [showSettings, setShowSettings] = useState(false);

  const [showGrid, setShowGrid] = useState(true);

  const [showMinimap, setShowMinimap] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('all');

  // Canvas settings
  const [settings, setSettings] = useState({
    snapToGrid: true,
    gridSize: 20,
    autoSave: true,
    showConnectionLabels: true,
    showNodeIds: false,
    theme: 'light'
  });

  // Execution state
  const [executionState, setExecutionState] = useState({
    isRunning: false,
    currentNode: null,
    completedNodes: [],
    failedNodes: [],
    logs: []
  });

  // Handle node creation
  const handleCreateNode = useCallback((nodeType: unknown, position: unknown) => {
    const nodeConfig = nodeConfigs[nodeType];
    if (!nodeConfig) return;
    const newNode = {
      id: `node_${Date.now()}`,
      type: nodeType,
      position: {
        x: position.x - canvasPosition.x,
        y: position.y - canvasPosition.y
      },
      data: {
        label: nodeConfig.name,
        config: {} };

    setNodes(prev => [...prev, newNode]);

    toast.success(`Created ${nodeConfig.name} node`);

  }, [canvasPosition, toast]);

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: unknown) => {
    setSelectedNode(nodeId);

  }, []);

  // Handle node update
  const handleNodeUpdate = useCallback((nodeId: unknown, data: unknown) => {
    setNodes(prev => (prev || []).map(node => 
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } : node
    ));

  }, []);

  // Handle node deletion
  const handleNodeDelete = useCallback((nodeId: unknown) => {
    setNodes(prev => (prev || []).filter(node => node.id !== nodeId));

    setEdges(prev => (prev || []).filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    ));

    if (selectedNode === nodeId) {
      setSelectedNode(null);

    }
    toast.success('Node deleted');

  }, [selectedNode, toast]);

  // Handle edge creation
  const handleCreateEdge = useCallback((sourceId, targetId, type = 'default') => {
    const newEdge = {
      id: `edge_${Date.now()}`,
      source: sourceId,
      target: targetId,
      type,
      animated: false};

    setEdges(prev => [...prev, newEdge]);

    toast.success('Connection created');

  }, [toast]);

  // Handle edge deletion
  const handleDeleteEdge = useCallback((edgeId: unknown) => {
    setEdges(prev => (prev || []).filter(edge => edge.id !== edgeId));

    toast.success('Connection deleted');

  }, [toast]);

  // Handle canvas pan
  const handleCanvasPan = useCallback((deltaX: unknown, deltaY: unknown) => {
    setCanvasPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

  }, []);

  // Handle canvas zoom
  const handleCanvasZoom = useCallback((delta: unknown) => {
    setCanvasScale(prev => Math.max(0.1, Math.min(3, prev + delta)));

  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (settings.autoSave && nodes.length > 0) {
      const timer = setTimeout(() => {
        handleSave();

      }, 5000);

      return () => clearTimeout(timer);

    } , [nodes, edges, settings.autoSave]);

  // Handle save
  const handleSave = useCallback(async () => {
    try {
      const workflowData = {
        nodes,
        edges,
        canvasPosition,
        canvasScale,
        settings};

      await onSave?.(workflowData);

      toast.success('Workflow saved');

    } catch (error) {
      toast.error('Failed to save workflow');

    } , [nodes, edges, canvasPosition, canvasScale, settings, onSave, toast]);

  // Handle execute
  const handleExecute = useCallback(async () => {
    if (nodes.length === 0) {
      toast.error('No nodes to execute');

      return;
    }
    setIsExecuting(true);

    setExecutionState({
      isRunning: true,
      currentNode: null,
      completedNodes: [],
      failedNodes: [],
      logs: []
    });

    try {
      await onExecute?.({
        nodes,
        edges
      });

      toast.success('Workflow executed successfully');

    } catch (error) {
      toast.error('Workflow execution failed');

    } finally {
      setIsExecuting(false);

      setExecutionState(prev => ({ ...prev, isRunning: false }));

    } , [nodes, edges, onExecute, toast]);

  // Handle simulate
  const handleSimulate = useCallback(async () => {
    if (nodes.length === 0) {
      toast.error('No nodes to simulate');

      return;
    }
    try {
      await onSimulate?.({
        nodes,
        edges
      });

      toast.success('Workflow simulation completed');

    } catch (error) {
      toast.error('Workflow simulation failed');

    } , [nodes, edges, onSimulate, toast]);

  // Filter nodes for palette
  const filteredNodeTypes = useMemo(() => {
    let filtered = Object.entries(nodeConfigs);

    if (searchQuery) {
      filtered = (filtered || []).filter(([type, config]) =>
        config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.description.toLowerCase().includes(searchQuery.toLowerCase()));

    }
    if (selectedCategory !== 'all') {
      filtered = (filtered || []).filter(([type, config]) =>
        config.category === selectedCategory);

    }
    return filtered;
  }, [searchQuery, selectedCategory]);

  return (
            <div className="{/* Toolbar */}">$2</div>
      <div className=" ">$2</div><div className="{/* Execution Controls */}">$2</div>
          <div className=" ">$2</div><Button
              onClick={ handleExecute }
              disabled={ isExecuting || nodes.length === 0 }
              className="bg-green-600 hover:bg-green-700" />
              {isExecuting ? (
                <>
                  <div className="Running...">$2</div>
      </>
    </>
  ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Execute
                </>
              )}
            </Button>
            <Button
              onClick={ handleSimulate }
              disabled={ isExecuting || nodes.length === 0 }
              variant="outline" />
              <Eye className="w-4 h-4 mr-2" />
              Simulate
            </Button>
            {isExecuting && (
              <Button
                onClick={ () => setIsExecuting(false) }
                variant="outline"
                className="text-red-600"
              >
                <Square className="w-4 h-4 mr-2" />
                Square
              </Button>
            )}
          </div>
          {/* Canvas Controls */}
          <div className=" ">$2</div><Button
              onClick={ () => handleCanvasZoom(0.1) }
              size="sm"
              variant="ghost"
            >
              <ZoomIn className="w-4 h-4" /></Button><Button
              onClick={ () => handleCanvasZoom(-0.1) }
              size="sm"
              variant="ghost"
            >
              <ZoomOut className="w-4 h-4" /></Button><Button
              onClick={ () => setCanvasScale(1) }
              size="sm"
              variant="ghost"
            >
              <RotateCcw className="w-4 h-4" /></Button></div>
          {/* View Controls */}
          <div className=" ">$2</div><Button
              onClick={ () => setShowGrid(!showGrid) }
              size="sm"
              variant={ showGrid ? "default" : "ghost"  }>
              <Grid className="w-4 h-4" /></Button><Button
              onClick={ () => setShowMinimap(!showMinimap) }
              size="sm"
              variant={ showMinimap ? "default" : "ghost"  }>
              <Layers className="w-4 h-4" /></Button></div>
        <div className="{/* Node Count */}">$2</div>
          <Badge variant="secondary" />
            {nodes.length} nodes
          </Badge>
          {/* Save Button */}
          <Button
            onClick={ handleSave }
            variant="outline" />
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          {/* Settings */}
          <Button
            onClick={ () => setShowSettings(true) }
            size="sm"
            variant="ghost"
          >
            <Settings className="w-4 h-4" /></Button></div>
      {/* Main Canvas Area */}
      <div className="{/* Node Palette */}">$2</div>
        {showNodePalette && (
          <div className=" ">$2</div><div className=" ">$2</div><h3 className="font-semibold text-gray-900 mb-2">Node Palette</h3>
              {/* Search */}
              <div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={ searchQuery }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value) }
                  placeholder="Search nodes..."
                  className="pl-10" />
              </div>
              {/* Category Filter */}
              <select
                value={ selectedCategory }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSelectedCategory(e.target.value) }
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {Object.entries(nodeCategories).map(([key, category]) => (
                  <option key={key} value={ key }>{category.name}</option>
                ))}
              </select>
            </div>
            {/* Node Types */}
            <div className="{(filteredNodeTypes || []).map(([type, config]) => (">$2</div>
                <div
                  key={ type }
                  className="node-type-item p-3 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 cursor-pointer hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/20"
                  onClick={() => handleCreateNode(type, { x: 100, y: 100 })}
  >
                  <div className=" ">$2</div><div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                      style={backgroundColor: config.color } >
           
        </div>{config.icon}
                    </div>
                    <div className=" ">$2</div><h4 className="font-medium text-gray-900 text-sm">{config.name}</h4>
                      <p className="text-xs text-gray-500">{config.description}</p></div></div>
              ))}
            </div>
        )}
        {/* Canvas */}
        <div className=" ">$2</div><div
            ref={ canvasRef }
            className="workflow-canvas w-full h-full relative"
            style={backgroundImage: showGrid ? `radial-gradient(circle, #e5e7eb 1px, transparent 1px)` : 'none',
              backgroundSize: `${settings.gridSize * canvasScale} px ${settings.gridSize * canvasScale}px`,
              transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${canvasScale})`,
              transformOrigin: '0 0'
            } >
           
        </div>{/* Render Nodes */}
            {(nodes || []).map(node => (
              <div
                key={ node.id }
                className={`workflow-node absolute ${selectedNode === node.id ? 'selected' : ''} `}
                style={left: node.position.x,
                  top: node.position.y,
                  transform: 'translate(-50%, -50%)'
                } onClick={ () => handleNodeSelect(node.id)  }>
                {/* Node content will be rendered here */}
                <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><span className="font-medium text-sm">{node.data.label}</span></div><div className="{node.type}">$2</div>
                  </div>
    </div>
  ))}
            {/* Render Edges */}
            <svg className="absolute inset-0 pointer-events-none" />
              {(edges || []).map(edge => {
                const sourceNode = nodes.find(n => n.id === edge.source);

                const targetNode = nodes.find(n => n.id === edge.target);

                if (!sourceNode || !targetNode) return null;
                const x1 = sourceNode.position.x;
                const y1 = sourceNode.position.y;
                const x2 = targetNode.position.x;
                const y2 = targetNode.position.y;
                return (
                          <line
                    key={ edge.id }
                    x1={ x1 }
                    y1={ y1 }
                    x2={ x2 }
                    y2={ y2 }
                    stroke="#6b7280"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    className={edge.animated ? 'animate-pulse' : ''} / />);

              })}
              {/* Arrow marker */}
              <defs />
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto" />
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6b7280"
                  / /></marker></defs></svg></div>
          {/* Minimap */}
          {showMinimap && (
            <div className=" ">$2</div><div className="Minimap">$2</div>
              </div>
              <div className="{nodes.length} nodes, {edges.length} connections">$2</div>
    </div>
  )}
        </div>
      {/* Settings Modal */}
      <Modal
        isOpen={ showSettings }
        onClose={ () => setShowSettings(false) }
        title="Canvas Settings"
      >
        <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
              Grid Size
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={ settings.gridSize }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, gridSize: parseInt(e.target.value) }))}
              className="w-full" />
            <div className="text-xs text-gray-500 mt-1">{settings.gridSize}px</div>
          <div className=" ">$2</div><input
              type="checkbox"
              id="snapToGrid"
              checked={ settings.snapToGrid }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, snapToGrid: e.target.checked }))} />
            <label htmlFor="snapToGrid" className="text-sm text-gray-700" />
              Snap to Grid
            </label></div><div className=" ">$2</div><input
              type="checkbox"
              id="autoSave"
              checked={ settings.autoSave }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))} />
            <label htmlFor="autoSave" className="text-sm text-gray-700" />
              Auto Save
            </label></div><div className=" ">$2</div><input
              type="checkbox"
              id="showConnectionLabels"
              checked={ settings.showConnectionLabels }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, showConnectionLabels: e.target.checked }))} />
            <label htmlFor="showConnectionLabels" className="text-sm text-gray-700" />
              Show Connection Labels
            </label></div><div className=" ">$2</div><input
              type="checkbox"
              id="showNodeIds"
              checked={ settings.showNodeIds }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings(prev => ({ ...prev, showNodeIds: e.target.checked }))} />
            <label htmlFor="showNodeIds" className="text-sm text-gray-700" />
              Show Node IDs
            </label></div></Modal>
    </div>);};

export default AdvancedWorkflowCanvas;
