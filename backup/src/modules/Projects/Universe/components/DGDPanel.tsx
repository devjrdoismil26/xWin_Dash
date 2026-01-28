import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
import { 
  LayoutGrid, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Move, 
  MousePointer, 
  Hand,
  Layers,
  Eye,
  EyeOff,
  Settings,
  Save,
  Download,
  Upload,
  Share2,
  Lock,
  Unlock,
  Star,
  Heart,
  Bookmark,
  Plus,
  Minus,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Zap,
  Brain,
  Cpu,
  Database,
  Network,
  Globe,
  Target,
  TrendingUp,
  Users,
  Activity,
  Clock,
  RefreshCw,
  Play,
  Pause,
  Stop,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Video,
  VideoOff,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Server,
  Cloud,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothOff,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryHigh,
  BatteryFull,
  Signal,
  SignalLow,
  SignalMedium,
  SignalHigh,
  SignalFull,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
  QuestionMarkCircle,
  Lightbulb,
  LightbulbOff,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
  Thermometer,
  Droplets,
  Gauge,
  BarChart3,
  PieChart,
  LineChart,
  AreaChart,
  Scatter,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  Minus as MinusIcon,
  Plus as Plus,
  X,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Mirror,
  Copy,
  Paste,
  Cut,
  Undo,
  Redo,
  Trash2,
  Edit,
  Edit3,
  PenTool,
  Highlighter,
  Eraser,
  Paintbrush,
  Palette,
  Dropper,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Terminal,
  FileText,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  FilePresentation,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  FolderEdit,
  FolderSearch,
  FolderDownload,
  FolderUpload,
  FolderShare,
  FolderLock,
  FolderUnlock,
  FolderHeart,
  FolderStar,
  BookmarkPlus,
  BookmarkMinus,
  BookmarkX,
  BookmarkCheck,
  BookmarkEdit,
  BookmarkSearch,
  BookmarkDownload,
  BookmarkUpload,
  BookmarkShare,
  BookmarkLock,
  BookmarkUnlock,
  BookmarkHeart,
  BookmarkStar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import UniverseBlock from './UniverseBlock';
import { UniverseBlock as UniverseBlockType, UniverseConnection } from '../types/universe';
interface DGDPanelProps {
  blocks: UniverseBlockType[];
  connections: UniverseConnection[];
  onBlockUpdate: (blockId: string, updates: Partial<UniverseBlockType>) => void;
  onBlockCreate: (type: string, position: { x: number; y: number }) => void;
  onBlockDelete: (blockId: string) => void;
  onBlockDuplicate: (blockId: string) => void;
  onConnectionCreate: (source: string, target: string) => void;
  onConnectionDelete: (connectionId: string) => void;
  className?: string;
}
const DGDPanel: React.FC<DGDPanelProps> = ({
  blocks,
  connections,
  onBlockUpdate,
  onBlockCreate,
  onBlockDelete,
  onBlockDuplicate,
  onConnectionCreate,
  onConnectionDelete,
  className
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showLayers, setShowLayers] = useState(false);
  const [activeLayer, setActiveLayer] = useState('default');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [depth, setDepth] = useState(0);
  const [perspective, setPerspective] = useState(1000);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [rotationZ, setRotationZ] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const miniMapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const handleZoom = useCallback((delta: number, center?: { x: number; y: number }) => {
    setZoom(prev => {
      const newZoom = Math.max(0.1, Math.min(5, prev + delta));
      if (center && panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
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
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
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
  const handleBlockSelect = useCallback((blockId: string) => {
    setSelectedBlocks(prev => 
      prev.includes(blockId) 
        ? prev.filter(id => id !== blockId)
        : [...prev, blockId]
    );
  }, []);
  const handleBlockHover = useCallback((blockId: string | null) => {
    setHoveredBlock(blockId);
  }, []);
  const handleConnectionStart = useCallback((blockId: string) => {
    setIsConnecting(true);
    setConnectionStart(blockId);
  }, []);
  const handleConnectionEnd = useCallback((blockId: string) => {
    if (connectionStart && connectionStart !== blockId) {
      onConnectionCreate(connectionStart, blockId);
    }
    setIsConnecting(false);
    setConnectionStart(null);
  }, [connectionStart, onConnectionCreate]);
  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotationX(0);
    setRotationY(0);
    setRotationZ(0);
    setDepth(0);
  }, []);
  const fitToView = useCallback(() => {
    if (panelRef.current && blocks.length > 0) {
      const rect = panelRef.current.getBoundingClientRect();
      const bounds = blocks.reduce((acc, block) => {
        return {
          minX: Math.min(acc.minX, block.position.x),
          minY: Math.min(acc.minY, block.position.y),
          maxX: Math.max(acc.maxX, block.position.x + 300),
          maxY: Math.max(acc.maxY, block.position.y + 200),
        };
      }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
      const centerX = (bounds.minX + bounds.maxX) / 2;
      const centerY = (bounds.minY + bounds.maxY) / 2;
      const width = bounds.maxX - bounds.minX;
      const height = bounds.maxY - bounds.minY;
      const scaleX = rect.width / width;
      const scaleY = rect.height / height;
      const scale = Math.min(scaleX, scaleY, 1) * 0.8;
      setZoom(scale);
      setPan({
        x: rect.width / 2 - centerX * scale,
        y: rect.height / 2 - centerY * scale
      });
    }
  }, [blocks]);
  const toggle3D = useCallback(() => {
    setViewMode(prev => prev === '2d' ? '3d' : '2d');
  }, []);
  const adjustDepth = useCallback((delta: number) => {
    setDepth(prev => Math.max(-500, Math.min(500, prev + delta)));
  }, []);
  const adjustPerspective = useCallback((delta: number) => {
    setPerspective(prev => Math.max(100, Math.min(2000, prev + delta)));
  }, []);
  const adjustRotation = useCallback((axis: 'x' | 'y' | 'z', delta: number) => {
    switch (axis) {
      case 'x':
        setRotationX(prev => (prev + delta) % 360);
        break;
      case 'y':
        setRotationY(prev => (prev + delta) % 360);
        break;
      case 'z':
        setRotationZ(prev => (prev + delta) % 360);
        break;
    }
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBlocks([]);
        setIsConnecting(false);
        setConnectionStart(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        {/* Zoom Controls */}
        <div className="backdrop-blur-xl bg-white/10 rounded-lg p-2 border border-white/20 flex items-center gap-2">
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-1 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-white text-sm px-2 min-w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.1)}
            className="p-1 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <button
            onClick={resetView}
            className="p-1 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={fitToView}
            className="p-1 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
        {/* View Mode Controls */}
        <div className="backdrop-blur-xl bg-white/10 rounded-lg p-2 border border-white/20 flex items-center gap-2">
          <button
            onClick={toggle3D}
            className={cn(
              "px-3 py-1 rounded-md text-sm transition-colors",
              viewMode === '2d' 
                ? "bg-white/20 text-white" 
                : "text-gray-400 hover:text-white hover:bg-white/10"
            )}
          >
            2D
          </button>
          <button
            onClick={toggle3D}
            className={cn(
              "px-3 py-1 rounded-md text-sm transition-colors",
              viewMode === '3d' 
                ? "bg-white/20 text-white" 
                : "text-gray-400 hover:text-white hover:bg-white/10"
            )}
          >
            3D
          </button>
        </div>
        {/* 3D Controls */}
        {viewMode === '3d' && (
          <div className="backdrop-blur-xl bg-white/10 rounded-lg p-2 border border-white/20 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-white text-xs">Depth:</span>
              <button
                onClick={() => adjustDepth(-10)}
                className="p-1 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-white text-xs w-8 text-center">{depth}</span>
              <button
                onClick={() => adjustDepth(10)}
                className="p-1 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <div className="w-px h-6 bg-white/20 mx-1" />
            <div className="flex items-center gap-1">
              <span className="text-white text-xs">Perspective:</span>
              <button
                onClick={() => adjustPerspective(-100)}
                className="p-1 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-white text-xs w-12 text-center">{perspective}</span>
              <button
                onClick={() => adjustPerspective(100)}
                className="p-1 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
        {/* Display Controls */}
        <div className="backdrop-blur-xl bg-white/10 rounded-lg p-2 border border-white/20 flex items-center gap-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={cn(
              "p-1 rounded-md transition-colors",
              showGrid 
                ? "bg-white/20 text-white" 
                : "text-gray-400 hover:text-white hover:bg-white/10"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowMiniMap(!showMiniMap)}
            className={cn(
              "p-1 rounded-md transition-colors",
              showMiniMap 
                ? "bg-white/20 text-white" 
                : "text-gray-400 hover:text-white hover:bg-white/10"
            )}
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowLayers(!showLayers)}
            className={cn(
              "p-1 rounded-md transition-colors",
              showLayers 
                ? "bg-white/20 text-white" 
                : "text-gray-400 hover:text-white hover:bg-white/10"
            )}
          >
            <Layers className="h-4 w-4" />
          </button>
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
              {/* Mini map content */}
              <div className="absolute inset-0">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full"
                    style={{
                      left: `${(block.position.x / 2000) * 100}%`,
                      top: `${(block.position.y / 2000) * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Layers Panel */}
      <AnimatePresence>
        {showLayers && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="absolute top-4 left-4 z-20 w-64 backdrop-blur-xl bg-white/10 rounded-lg border border-white/20 p-4"
          >
            <div className="text-white font-medium mb-3">Camadas</div>
            <div className="space-y-2">
              {['default', 'background', 'foreground', 'overlay'].map((layer) => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    activeLayer === layer
                      ? "bg-white/20 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  )}
                >
                  {layer}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main Panel */}
      <div
        ref={panelRef}
        className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: viewMode === '3d' 
            ? `perspective(${perspective}px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg) translateZ(${depth}px)`
            : 'none',
        }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'top left',
          }}
        >
          {/* Grid */}
          {showGrid && (
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
              }}
            />
          )}
          {/* Connections */}
          <svg
            ref={svgRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {connections.map((connection) => {
              const sourceBlock = blocks.find(b => b.id === connection.source);
              const targetBlock = blocks.find(b => b.id === connection.target);
              if (!sourceBlock || !targetBlock) return null;
              const startX = sourceBlock.position.x + 300;
              const startY = sourceBlock.position.y + 100;
              const endX = targetBlock.position.x;
              const endY = targetBlock.position.y + 100;
              return (
                <motion.line
                  key={connection.id}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="rgba(168, 85, 247, 0.6)"
                  strokeWidth="2"
                  strokeDasharray={connection.animated ? "5,5" : "none"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                  className={connection.animated ? "animate-pulse" : ""}
                />
              );
            })}
          </svg>
          {/* Blocks */}
          <div className="relative">
            {blocks.map((block) => (
              <motion.div
                key={block.id}
                className="absolute"
                style={{
                  left: block.position.x,
                  top: block.position.y,
                  zIndex: selectedBlocks.includes(block.id) ? 10 : 1,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  z: selectedBlocks.includes(block.id) ? 20 : 0,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <UniverseBlock
                  block={block}
                  isSelected={selectedBlocks.includes(block.id)}
                  isHovered={hoveredBlock === block.id}
                  onSelect={handleBlockSelect}
                  onUpdate={onBlockUpdate}
                  onDelete={onBlockDelete}
                  onDuplicate={onBlockDuplicate}
                  onStart={(blockId) => {
                    onBlockUpdate(blockId, { status: 'active' });
                  }}
                  onStop={(blockId) => {
                    onBlockUpdate(blockId, { status: 'paused' });
                  }}
                  onConfigure={(blockId) => {
                    // Configuration modal will be implemented in future iteration
                  }}
                  onView={(blockId) => {
                    // View modal will be implemented in future iteration
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="backdrop-blur-xl bg-white/10 rounded-lg p-2 border border-white/20 flex items-center gap-4 text-xs text-white">
          <div className="flex items-center gap-1">
            <span>Blocos:</span>
            <span className="text-blue-400">{blocks.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Conexões:</span>
            <span className="text-green-400">{connections.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Zoom:</span>
            <span className="text-purple-400">{Math.round(zoom * 100)}%</span>
          </div>
          {viewMode === '3d' && (
            <div className="flex items-center gap-1">
              <span>Profundidade:</span>
              <span className="text-orange-400">{depth}px</span>
            </div>
          )}
        </div>
      </div>
      {/* Selection Actions */}
      {selectedBlocks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 z-20"
        >
          <div className="backdrop-blur-xl bg-white/10 rounded-lg p-3 border border-white/20 flex items-center gap-2">
            <span className="text-white text-sm mr-2">
              {selectedBlocks.length} selecionado(s)
            </span>
            <button
              onClick={() => {
                selectedBlocks.forEach(blockId => onBlockDelete(blockId));
                setSelectedBlocks([]);
              }}
              className="p-1 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                selectedBlocks.forEach(blockId => onBlockDuplicate(blockId));
                setSelectedBlocks([]);
              }}
              className="p-1 rounded-md bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
export default DGDPanel;
