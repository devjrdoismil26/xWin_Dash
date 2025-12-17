import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Image, Video, FileText, Music, Archive, Play, Eye, Edit, Trash2, Download } from 'lucide-react';
import { MediaItem } from '../types/basicTypes';

interface MediaItemGridProps {
  items: MediaItem[];
  selectedItems: string[];
  onSelectItem?: (e: any) => void;
  onPreview?: (e: any) => void;
  onEdit?: (e: any) => void;
  onDelete?: (e: any) => void;
  onDownload?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const getFileIcon = (type: string) => {
  switch (type) {
    case 'image': return Image;
    case 'video': return Video;
    case 'document': return FileText;
    case 'audio': return Music;
    default: return Archive;
  } ;

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];};

export const MediaItemGrid: React.FC<MediaItemGridProps> = ({ items,
  selectedItems,
  onSelectItem,
  onPreview,
  onEdit,
  onDelete,
  onDownload
   }) => {
  return (
            <>
      {items.map((item: unknown) => {
        const IconComponent = getFileIcon(item.type);

        const isSelected = selectedItems.includes(item.id);

        return (
                  <div
            key={ item.id }
            className={`group cursor-pointer p-4 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
              isSelected ? 'bg-blue-500/20 border-blue-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            } `}
            onClick={ () => onSelectItem(item.id)  }>
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><IconComponent className="h-8 w-8 text-gray-400" />
                </div>
                {item.type === 'video' && (
                  <div className=" ">$2</div><Play className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
              <h3 className="text-sm font-medium text-white mb-1 truncate w-full">{item.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{formatFileSize(item.size)}</p>
              
              <div className=" ">$2</div><Button onClick={(e: unknown) => { e.stopPropagation(); onPreview(item); } variant="outline" size="sm" className="h-6 w-6 p-0 backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Eye className="h-3 w-3" /></Button><Button onClick={(e: unknown) => { e.stopPropagation(); onEdit(item); } variant="outline" size="sm" className="h-6 w-6 p-0 backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Edit className="h-3 w-3" /></Button><Button onClick={(e: unknown) => { e.stopPropagation(); onDownload([item.id]); } variant="outline" size="sm" className="h-6 w-6 p-0 backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Download className="h-3 w-3" /></Button><Button onClick={(e: unknown) => { e.stopPropagation(); onDelete([item.id]); } variant="outline" size="sm" className="h-6 w-6 p-0 backdrop-blur-sm bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
                  <Trash2 className="h-3 w-3" /></Button></div>
          </div>);

      })}
    </>);};
