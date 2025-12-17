import React from 'react';
import { Handle, Position } from 'reactflow';
import { Image, Video, Mic, FileText, Download, Upload, Crop, RotateCw, RotateCcw, ZoomIn, ZoomOut, Filter, Palette, Scissors, Play, Pause, Square, Volume2, VolumeX, Settings, Zap, CheckCircle, XCircle, Clock, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
const MediaProcessingNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getMediaIcon = (type: unknown) => {
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
    } ;

  const getMediaColor = (type: unknown) => {
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
    } ;

  const mediaType = data?.mediaType || 'image';
  const mediaName = data?.name || 'Processamento de Mídia';
  const mediaDescription = data?.description || 'Processa arquivos de mídia';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getMediaColor(mediaType),
      selected && 'selected shadow-lg ring-2 ring-blue-500'
    )  }>
      </div><Handle
        type="target"
        position={ Position.Left }
        isConnectable={ isConnectable }
        className="workflow-node-handle target"
      / />
      <Handle
        type="source"
        position={ Position.Right }
        isConnectable={ isConnectable }
        className="workflow-node-handle source"
      / />
      <div className=" ">$2</div><div className="{getMediaIcon(mediaType)}">$2</div>
        </div>
        <div className="{mediaName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {mediaDescription}
        </p>
        {data?.mediaType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="{mediaType}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.operation && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Operação:</span>
            <span className="{data.operation}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.inputFormat && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Formato Entrada:</span>
            <span className="{data.inputFormat}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.outputFormat && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Formato Saída:</span>
            <span className="{data.outputFormat}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.quality && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Qualidade:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              (data as any).quality === 'high' && 'bg-green-100 text-green-800',
              (data as any).quality === 'medium' && 'bg-yellow-100 text-yellow-800',
              (data as any).quality === 'low' && 'bg-red-100 text-red-800'
            )  }>
        </span>{data.quality}
            </span>
      </div>
    </>
  )}
        {data?.dimensions && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Dimensões:</span>
            <span className="{data.dimensions}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.duration && (
          <div className=" ">$2</div><Clock className="h-3 w-3 text-gray-500" />
            <span className="Duração: {data.duration}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.filters && (data as any).filters.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Filtros:</span>
            <div className="{data.filters.slice(0, 2).map((filter: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
            {filter}
          </div>
              ))}
              {data.filters.length > 2 && (
                <div className="+{data.filters.length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.watermark && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Marca d&apos;água:</span>
            <span className="{data.watermark}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.compression && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Compressão:</span>
            <span className="{data.compression}%">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.bitrate && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Bitrate:</span>
            <span className="{data.bitrate} kbps">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.fps && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">FPS:</span>
            <span className="{data.fps}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.status && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Status:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              (data as any).status === 'processing' && 'bg-blue-100 text-blue-800',
              (data as any).status === 'completed' && 'bg-green-100 text-green-800',
              (data as any).status === 'failed' && 'bg-red-100 text-red-800',
              (data as any).status === 'queued' && 'bg-yellow-100 text-yellow-800'
            )  }>
        </span>{data.status}
            </span>
      </div>
    </>
  )}
        {data?.progress && (
          <div className=" ">$2</div><div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Progresso:</span>
              <span className="text-xs text-gray-600">{data.progress}%</span></div><div className=" ">$2</div><div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={width: `${data.progress} %` } />
           
        </div></div>
        )}
        { data?.batch !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).batch ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.batch ? 'Processamento em Lote' : 'Processamento Individual'}">$2</span>
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><Image className="h-3 w-3 text-pink-600" />
          <span className="text-xs text-pink-600 font-medium">MÍDIA</span></div></div>);};

export default MediaProcessingNode;
