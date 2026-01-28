import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Image, 
  Video, 
  Mic, 
  FileText, 
  Download, 
  Upload,
  Crop,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Filter,
  Palette,
  Scissors,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Settings,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  BarChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
const MediaProcessingNode = ({ data, isConnectable, selected }) => {
  const getMediaIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Mic className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'resize':
        return <ZoomIn className="h-4 w-4" />;
      case 'crop':
        return <Crop className="h-4 w-4" />;
      case 'rotate':
        return <RotateCw className="h-4 w-4" />;
      case 'filter':
        return <Filter className="h-4 w-4" />;
      case 'compress':
        return <Download className="h-4 w-4" />;
      case 'convert':
        return <Settings className="h-4 w-4" />;
      case 'watermark':
        return <Palette className="h-4 w-4" />;
      case 'thumbnail':
        return <Image className="h-4 w-4" />;
      case 'transcode':
        return <Video className="h-4 w-4" />;
      case 'extract':
        return <Scissors className="h-4 w-4" />;
      case 'merge':
        return <Play className="h-4 w-4" />;
      default:
        return <Image className="h-4 w-4" />;
    }
  };
  const getMediaColor = (type) => {
    switch (type) {
      case 'image':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'video':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'audio':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'document':
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
      case 'resize':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'crop':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'rotate':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'filter':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'compress':
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
      case 'convert':
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
      case 'watermark':
        return 'border-teal-300 bg-gradient-to-br from-teal-50 to-teal-100';
      case 'thumbnail':
        return 'border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100';
      case 'transcode':
        return 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100';
      case 'extract':
        return 'border-rose-300 bg-gradient-to-br from-rose-50 to-rose-100';
      case 'merge':
        return 'border-violet-300 bg-gradient-to-br from-violet-50 to-violet-100';
      default:
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
    }
  };
  const mediaType = data?.mediaType || 'image';
  const mediaName = data?.name || 'Processamento de Mídia';
  const mediaDescription = data?.description || 'Processa arquivos de mídia';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getMediaColor(mediaType),
      selected && 'selected shadow-lg ring-2 ring-blue-500'
    )}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="workflow-node-handle target"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="workflow-node-handle source"
      />
      <div className="workflow-node-header">
        <div className="workflow-node-icon bg-pink-500">
          {getMediaIcon(mediaType)}
        </div>
        <div className="workflow-node-title">
          {mediaName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {mediaDescription}
        </p>
        {data?.mediaType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {mediaType}
            </span>
          </div>
        )}
        {data?.operation && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Operação:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.operation}
            </span>
          </div>
        )}
        {data?.inputFormat && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Formato Entrada:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.inputFormat}
            </span>
          </div>
        )}
        {data?.outputFormat && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Formato Saída:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.outputFormat}
            </span>
          </div>
        )}
        {data?.quality && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Qualidade:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              data.quality === 'high' && 'bg-green-100 text-green-800',
              data.quality === 'medium' && 'bg-yellow-100 text-yellow-800',
              data.quality === 'low' && 'bg-red-100 text-red-800'
            )}>
              {data.quality}
            </span>
          </div>
        )}
        {data?.dimensions && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Dimensões:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.dimensions}
            </span>
          </div>
        )}
        {data?.duration && (
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              Duração: {data.duration}
            </span>
          </div>
        )}
        {data?.filters && data.filters.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Filtros:</span>
            <div className="mt-1 space-y-1">
              {data.filters.slice(0, 2).map((filter, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  {filter}
                </div>
              ))}
              {data.filters.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{data.filters.length - 2} mais...
                </div>
              )}
            </div>
          </div>
        )}
        {data?.watermark && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Marca d&apos;água:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.watermark}
            </span>
          </div>
        )}
        {data?.compression && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Compressão:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.compression}%
            </span>
          </div>
        )}
        {data?.bitrate && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Bitrate:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.bitrate} kbps
            </span>
          </div>
        )}
        {data?.fps && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">FPS:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.fps}
            </span>
          </div>
        )}
        {data?.status && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Status:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              data.status === 'processing' && 'bg-blue-100 text-blue-800',
              data.status === 'completed' && 'bg-green-100 text-green-800',
              data.status === 'failed' && 'bg-red-100 text-red-800',
              data.status === 'queued' && 'bg-yellow-100 text-yellow-800'
            )}>
              {data.status}
            </span>
          </div>
        )}
        {data?.progress && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">Progresso:</span>
              <span className="text-xs text-gray-600">{data.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${data.progress}%` }}
              ></div>
            </div>
          </div>
        )}
        {data?.batch !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.batch ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.batch ? 'Processamento em Lote' : 'Processamento Individual'}
            </span>
          </div>
        )}
      </div>
      <div className="workflow-node-footer">
        <div className="flex items-center gap-1">
          <Image className="h-3 w-3 text-pink-600" />
          <span className="text-xs text-pink-600 font-medium">MÍDIA</span>
        </div>
      </div>
    </div>
  );
};
export default MediaProcessingNode;
