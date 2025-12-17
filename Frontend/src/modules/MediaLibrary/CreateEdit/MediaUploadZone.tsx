import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaUploadZoneProps {
  onFilesSelected?: (e: any) => void;
  dragActive: boolean;
  onDragEnter??: (e: any) => void;
  onDragLeave??: (e: any) => void;
  onDrop?: (e: any) => void;
  accept?: string;
  multiple?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const MediaUploadZone: React.FC<MediaUploadZoneProps> = ({ onFilesSelected,
  dragActive,
  onDragEnter,
  onDragLeave,
  onDrop,
  accept = '*',
  multiple = true
   }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      onFilesSelected(files);

    } ;

  return (
            <div
      onClick={ handleClick }
      onDragEnter={ onDragEnter }
      onDragLeave={ onDragLeave }
      onDragOver={ (e: unknown) => e.preventDefault() }
      onDrop={ onDrop }
      className={cn(
        'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
        dragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      )  }>
      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 mb-2" />
        Arraste arquivos aqui ou clique para selecionar
      </p>
      <p className="text-sm text-gray-500" />
        {multiple ? 'Múltiplos arquivos suportados' : 'Apenas um arquivo'}
      </p>
      <input
        ref={ fileInputRef }
        type="file"
        accept={ accept }
        multiple={ multiple }
        onChange={ handleFileChange }
        className="hidden"
      / />
    </div>);};
