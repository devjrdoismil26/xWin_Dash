import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
import { 
  Play, 
  Pause, 
  Settings, 
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
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Lock,
  Unlock,
  Heart,
  Bookmark,
  BookmarkCheck,
  BookmarkX,
  BookmarkPlus,
  BookmarkMinus,
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
import { UniverseBlock as UniverseBlockType, BlockType } from '../types/universe';
interface UniverseBlockProps {
  block: UniverseBlockType;
  isSelected?: boolean;
  isHovered?: boolean;
  isDragging?: boolean;
  onSelect?: (blockId: string) => void;
  onUpdate?: (blockId: string, updates: Partial<UniverseBlockType>) => void;
  onDelete?: (blockId: string) => void;
  onDuplicate?: (blockId: string) => void;
  onStart?: (blockId: string) => void;
  onStop?: (blockId: string) => void;
  onConfigure?: (blockId: string) => void;
  onView?: (blockId: string) => void;
  className?: string;
}
const UniverseBlock: React.FC<UniverseBlockProps> = ({
  block,
  isSelected = false,
  isHovered = false,
  isDragging = false,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onStart,
  onStop,
  onConfigure,
  onView,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isRunning, setIsRunning] = useState(block.status === 'active');
  const [progress, setProgress] = useState(block.data.progress || 0);
  const [metrics, setMetrics] = useState(block.data.metrics || {});
  const blockRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const getBlockIcon = (type: BlockType) => {
    const iconMap: Record<BlockType, React.ComponentType<any>> = {
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
  const getBlockColor = (type: BlockType) => {
    const colorMap: Record<BlockType, string> = {
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
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-400" />;
      default:
        return <Info className="h-4 w-4 text-gray-400" />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  const handleStart = () => {
    setIsRunning(true);
    onStart?.(block.id);
    onUpdate?.(block.id, { status: 'active' });
  };
  const handleStop = () => {
    setIsRunning(false);
    onStop?.(block.id);
    onUpdate?.(block.id, { status: 'paused' });
  };
  const handleConfigure = () => {
    setIsConfiguring(true);
    onConfigure?.(block.id);
  };
  const handleView = () => {
    onView?.(block.id);
  };
  const handleDelete = () => {
    onDelete?.(block.id);
  };
  const handleDuplicate = () => {
    onDuplicate?.(block.id);
  };
  // Simulate progress updates for active blocks
  useEffect(() => {
    if (isRunning && block.status === 'active') {
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 2;
          return newProgress > 100 ? 0 : newProgress;
        });
      }, 1000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isRunning, block.status]);
  // Simulate metrics updates
  useEffect(() => {
    if (isRunning) {
      const metricsInterval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          executions: (prev.executions || 0) + Math.floor(Math.random() * 3),
          uptime: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
          cpuUsage: Math.floor(Math.random() * 100),
          memoryUsage: Math.floor(Math.random() * 1000),
        }));
      }, 5000);
      return () => clearInterval(metricsInterval);
    }
  }, [isRunning]);
  const Icon = getBlockIcon(block.type);
  const blockColor = getBlockColor(block.type);
  return (
    <motion.div
      ref={blockRef}
      className={cn(
        "group relative backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 p-4 cursor-pointer transition-all duration-300 hover:shadow-2xl",
        blockColor,
        isSelected && "ring-2 ring-blue-400 shadow-2xl",
        isHovered && "scale-105 shadow-xl",
        isDragging && "opacity-50 scale-95",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(block.id)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Block Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">
              {block.data.label}
            </h3>
            <p className="text-gray-400 text-xs">
              {block.type} • {block.metadata.category}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs border",
            getStatusColor(block.status)
          )}>
            {getStatusIcon(block.status)}
            <span className="capitalize">{block.status}</span>
          </div>
          {/* Actions */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                {isRunning ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStop();
                    }}
                    className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Pause className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStart();
                    }}
                    className="p-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView();
                  }}
                  className="p-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfigure();
                  }}
                  className="p-1 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate();
                  }}
                  className="p-1 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Block Description */}
      {block.data.description && (
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {block.data.description}
        </p>
      )}
      {/* Progress Bar */}
      {block.status === 'active' && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-xs">Progresso</span>
            <span className="text-gray-400 text-xs">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
      {/* Block Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Activity className="h-3 w-3" />
          <span>{metrics.executions || 0} exec</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          <span>{metrics.uptime || '0s'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Cpu className="h-3 w-3" />
          <span>{metrics.cpuUsage || 0}% CPU</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Database className="h-3 w-3" />
          <span>{metrics.memoryUsage || 0}MB</span>
        </div>
      </div>
      {/* Expandable Content */}
      <div className="border-t border-white/10 pt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="flex items-center justify-between w-full text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-xs">Detalhes</span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2"
            >
              {/* Configuration */}
              <div className="text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Versão:</span>
                  <span className="text-white">{block.metadata.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dependências:</span>
                  <span className="text-white">{block.metadata.dependencies.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tags:</span>
                  <span className="text-white">{block.metadata.tags.length}</span>
                </div>
              </div>
              {/* Tags */}
              {block.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {block.metadata.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/10 text-white text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {/* Last Activity */}
              {block.data.lastActivity && (
                <div className="text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Última atividade: {new Date(block.data.lastActivity).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Connection Points */}
      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};
export default UniverseBlock;
