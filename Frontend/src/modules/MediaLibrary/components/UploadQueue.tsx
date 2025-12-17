import React from 'react';
import { X, FileIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

interface UploadQueueProps {
  files: File[];
  onRemove?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const UploadQueue: React.FC<UploadQueueProps> = ({ files, onRemove    }) => {
  return (
            <div className=" ">$2</div><h3 className="text-sm font-medium text-gray-300">Fila de upload ({files.length})</h3>
      {files.map((file: unknown, index: unknown) => (
        <div
          key={ index }
          className="flex items-center justify-between p-3 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10">
           
        </div><div className=" ">$2</div><FileIcon className="h-5 w-5 text-gray-400" />
            <div>
           
        </div><p className="text-sm text-white">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p></div><Button
            onClick={ () => onRemove(index) }
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
          >
            <X className="h-4 w-4" /></Button></div>
      ))}
    </div>);};
