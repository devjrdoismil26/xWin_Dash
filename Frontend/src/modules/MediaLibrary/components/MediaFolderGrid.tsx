import React from 'react';
import { FolderOpen } from 'lucide-react';

interface Folder {
  id: string;
  name: string;
  itemCount: number; }

interface MediaFolderGridProps {
  folders: Folder[];
  onFolderClick?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const MediaFolderGrid: React.FC<MediaFolderGridProps> = ({ folders, onFolderClick    }) => {
  return (
            <>
      {folders.map((folder: unknown) => (
        <div
          key={ folder.id }
          onClick={ () => onFolderClick(folder) }
          className="group cursor-pointer p-4 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        >
          <div className=" ">$2</div><div className=" ">$2</div><FolderOpen className="h-8 w-8 text-blue-400" /></div><h3 className="text-sm font-medium text-white mb-1 truncate w-full">{folder.name}</h3>
            <p className="text-xs text-gray-400">{folder.itemCount} itens</p>
      </div>
    </>
  ))}
    </>);};
