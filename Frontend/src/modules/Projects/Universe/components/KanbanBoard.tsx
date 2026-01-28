import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
import { Button } from "@/components/ui/Button"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Copy,
  Star,
  Clock,
  Users,
  Target,
  TrendingUp,
  Activity,
  Zap,
  Brain,
  Cpu,
  Database,
  Network,
  Globe,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Move,
  MousePointer,
  Hand
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UniverseBlock, UniverseConnection } from '../types/universe';
interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  color: string;
  blocks: UniverseBlock[];
  maxBlocks?: number;
}
interface KanbanBoardProps {
  blocks: UniverseBlock[];
  connections: UniverseConnection[];
  onBlockUpdate: (blockId: string, updates: Partial<UniverseBlock>) => void;
  onBlockMove: (blockId: string, newStatus: string) => void;
  onBlockCreate: (status: string) => void;
  onBlockDelete: (blockId: string) => void;
  onBlockDuplicate: (blockId: string) => void;
  className?: string;
}
const KanbanBoard: React.FC<KanbanBoardProps> = ({
  blocks,
  connections,
  onBlockUpdate,
  onBlockMove,
  onBlockCreate,
  onBlockDelete,
  onBlockDuplicate,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'timeline' | 'gantt'>('kanban');
  const boardRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<HTMLDivElement>(null);
  const columns: KanbanColumn[] = [
    {
      id: 'draft',
      title: 'Rascunho',
      status: 'draft',
      color: 'bg-gray-500/20 border-gray-500/30',
      blocks: blocks.filter(block => block.status === 'draft'),
    },
    {
      id: 'active',
      title: 'Ativo',
      status: 'active',
      color: 'bg-green-500/20 border-green-500/30',
      blocks: blocks.filter(block => block.status === 'active'),
    },
    {
      id: 'processing',
      title: 'Processando',
      status: 'processing',
      color: 'bg-blue-500/20 border-blue-500/30',
      blocks: blocks.filter(block => block.status === 'processing'),
    },
    {
      id: 'paused',
      title: 'Pausado',
      status: 'paused',
      color: 'bg-yellow-500/20 border-yellow-500/30',
      blocks: blocks.filter(block => block.status === 'paused'),
    },
    {
      id: 'error',
      title: 'Erro',
      status: 'error',
      color: 'bg-red-500/20 border-red-500/30',
      blocks: blocks.filter(block => block.status === 'error'),
    },
    {
      id: 'archived',
      title: 'Arquivado',
      status: 'archived',
      color: 'bg-purple-500/20 border-purple-500/30',
      blocks: blocks.filter(block => block.status === 'archived'),
    },
  ];
  const filteredColumns = columns.map(column => ({
    ...column,
    blocks: column.blocks.filter(block =>
      block.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.data.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));
  const getBlockIcon = (type: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      dashboard: Target,
      analytics: TrendingUp,
      crm: Users,
      ecommerce: Globe,
      landingPage: Globe,
      emailMarketing: Network,
      leads: Users,
      workflows: Zap,
      mediaLibrary: Database,
      aiAgent: Brain,
      aiLaboratory: Brain,
      aiContext: Brain,
      aura: Star,
      socialBuffer: Network,
      adsTool: Target,
      webBrowser: Globe,
      products: Globe,
      integrations: Network,
    };
    return iconMap[type] || Cpu;
  };
  const getBlockColor = (type: string) => {
    const colorMap: Record<string, string> = {
      dashboard: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      analytics: 'from-green-500/20 to-green-600/20 border-green-500/30',
      crm: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      ecommerce: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
      landingPage: 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
      emailMarketing: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
      leads: 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30',
      workflows: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
      mediaLibrary: 'from-teal-500/20 to-teal-600/20 border-teal-500/30',
      aiAgent: 'from-violet-500/20 to-violet-600/20 border-violet-500/30',
      aiLaboratory: 'from-violet-500/20 to-violet-600/20 border-violet-500/30',
      aiContext: 'from-violet-500/20 to-violet-600/20 border-violet-500/30',
      aura: 'from-amber-500/20 to-amber-600/20 border-amber-500/30',
      socialBuffer: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
      adsTool: 'from-red-500/20 to-red-600/20 border-red-500/30',
      webBrowser: 'from-sky-500/20 to-sky-600/20 border-sky-500/30',
      products: 'from-rose-500/20 to-rose-600/20 border-rose-500/30',
      integrations: 'from-slate-500/20 to-slate-600/20 border-slate-500/30',
    };
    return colorMap[type] || 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
  };
  const handleZoom = useCallback((delta: number, center?: { x: number; y: number }) => {
    setZoom(prev => {
      const newZoom = Math.max(0.1, Math.min(3, prev + delta));
      if (center && boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        const centerX = center.x - rect.left;
        const centerY = center.y - rect.top;
        setPan(prevPan => ({
          x: centerX - (centerX - prevPan.x) * (newZoom / prev),
          y: centerY - (centerY - prevPan.y) * (newZoom / prev)
        }));
      }
      return newZoom;
    });
  }, []);
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    handleZoom(delta, { x: e.clientX, y: e.clientY });
  }, [handleZoom]);
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+Left
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, []);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint]);
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);
  const handleBlockDragStart = useCallback((e: React.DragEvent, blockId: string) => {
    setDraggedBlock(blockId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);
  const handleColumnDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  }, []);
  const handleColumnDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);
  const handleColumnDrop = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedBlock) {
      onBlockMove(draggedBlock, columnId);
      setDraggedBlock(null);
      setDragOverColumn(null);
    }
  }, [draggedBlock, onBlockMove]);
  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);
  const fitToView = useCallback(() => {
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      setZoom(0.8);
      setPan({
        x: rect.width / 2 - (columns.length * 300) / 2,
        y: rect.height / 2 - 200
      });
    }
  }, [columns.length]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBlocks([]);
        setDraggedBlock(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="backdrop-blur-xl bg-white/10 rounded-lg p-2 border border-white/20 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleZoom(-0.1)}
            className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-white text-sm px-2">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleZoom(0.1)}
            className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <Button
            size="sm"
            variant="outline"
            onClick={resetView}
            className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={fitToView}
            className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="backdrop-blur-xl bg-white/10 rounded-lg p-2 border border-white/20 flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar blocos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 text-sm w-48"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowMiniMap(!showMiniMap)}
            className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {showMiniMap ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {/* Mini Map */}
      <AnimatePresence>
        {showMiniMap && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 right-4 z-20 w-48 h-32 backdrop-blur-xl bg-white/10 rounded-lg border border-white/20 p-2"
          >
            <div className="text-xs text-white mb-2 font-medium">Mini Mapa</div>
            <div
              ref={miniMapRef}
              className="w-full h-full bg-gray-900/50 rounded border border-white/10 relative overflow-hidden"
              style={{ transform: `scale(${1/zoom})` }}
            >
              {/* Mini map content would go here */}
              <div className="absolute inset-0 flex">
                {columns.map((column, index) => (
                  <div
                    key={column.id}
                    className="flex-1 border-r border-white/10 last:border-r-0"
                    style={{ width: `${100/columns.length}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Kanban Board */}
      <div
        ref={boardRef}
        className="w-full h-full overflow-auto cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: 'top left',
        }}
      >
        <div className="flex gap-6 p-6 min-w-max">
          {filteredColumns.map((column) => (
            <motion.div
              key={column.id}
              className={cn(
                "w-80 flex-shrink-0 backdrop-blur-xl bg-white/5 rounded-xl border border-white/20 p-4",
                column.color,
                dragOverColumn === column.id && "ring-2 ring-blue-400"
              )}
              layout
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold">{column.title}</h3>
                  <span className="text-gray-400 text-sm bg-white/10 px-2 py-1 rounded-full">
                    {column.blocks.length}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBlockCreate(column.status)}
                  className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {/* Column Content */}
              <div
                className="space-y-3 min-h-96"
                onDragOver={(e) => handleColumnDragOver(e, column.id)}
                onDragLeave={handleColumnDragLeave}
                onDrop={(e) => handleColumnDrop(e, column.id)}
              >
                <AnimatePresence>
                  {column.blocks.map((block) => {
                    const Icon = getBlockIcon(block.type);
                    const blockColor = getBlockColor(block.type);
                    return (
                      <motion.div
                        key={block.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        draggable
                        onDragStart={(e) => handleBlockDragStart(e, block.id)}
                        className={cn(
                          "group relative backdrop-blur-xl bg-white/10 rounded-lg border border-white/20 p-4 cursor-move transition-all duration-200 hover:shadow-2xl",
                          blockColor,
                          selectedBlocks.includes(block.id) && "ring-2 ring-blue-400",
                          draggedBlock === block.id && "opacity-50"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBlocks(prev => 
                            prev.includes(block.id) 
                              ? prev.filter(id => id !== block.id)
                              : [...prev, block.id]
                          );
                        }}
                      >
                        {/* Block Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-white/10">
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium text-sm">
                                {block.data.label}
                              </h4>
                              <p className="text-gray-400 text-xs">
                                {block.type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onBlockDuplicate(block.id);
                              }}
                              className="h-6 w-6 p-0 text-white hover:bg-white/20"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                onBlockDelete(block.id);
                              }}
                              className="h-6 w-6 p-0 text-white hover:bg-white/20"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {/* Block Content */}
                        {block.data.description && (
                          <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                            {block.data.description}
                          </p>
                        )}
                        {/* Block Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              block.status === 'active' && "bg-green-400 animate-pulse",
                              block.status === 'processing' && "bg-blue-400 animate-pulse",
                              block.status === 'paused' && "bg-yellow-400",
                              block.status === 'error' && "bg-red-400",
                              block.status === 'draft' && "bg-gray-400",
                              block.status === 'archived' && "bg-purple-400"
                            )} />
                            <span className="text-gray-400 text-xs capitalize">
                              {block.status}
                            </span>
                          </div>
                          {block.data.progress !== undefined && (
                            <div className="flex items-center gap-1">
                              <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-400 transition-all duration-300"
                                  style={{ width: `${block.data.progress}%` }}
                                />
                              </div>
                              <span className="text-gray-400 text-xs">
                                {block.data.progress}%
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Block Metrics */}
                        {block.data.metrics && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                <span>{block.data.metrics.executions || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{block.data.metrics.uptime || '0s'}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {/* Empty State */}
                {column.blocks.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-gray-400">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📋</div>
                      <p className="text-sm">Nenhum bloco</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Selection Actions */}
      {selectedBlocks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="backdrop-blur-xl bg-white/10 rounded-lg p-3 border border-white/20 flex items-center gap-2">
            <span className="text-white text-sm mr-2">
              {selectedBlocks.length} selecionado(s)
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                selectedBlocks.forEach(blockId => onBlockDelete(blockId));
                setSelectedBlocks([]);
              }}
              className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                selectedBlocks.forEach(blockId => onBlockDuplicate(blockId));
                setSelectedBlocks([]);
              }}
              className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicar
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
export default KanbanBoard;
