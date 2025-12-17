import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { UploadProgress } from './UploadProgress';
import { UploadQueue } from './UploadQueue';

interface MediaLibraryUploaderProps {
  onUpload??: (e: any) => void;
  maxSize?: number;
  acceptedTypes?: string[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const MediaLibraryUploader: React.FC<MediaLibraryUploaderProps> = ({ onUpload,
  maxSize = 10485760, // 10MB
  acceptedTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf']
   }) => {
  const [uploading, setUploading] = React.useState(false);

  const [queue, setQueue] = React.useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setQueue(prev => [...prev, ...acceptedFiles]);

    onUpload?.(acceptedFiles);

  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedTypes.reduce((acc: unknown, type: unknown) => ({ ...acc, [type]: [] }), {})
  });

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_: unknown, i: unknown) => i !== index));};

  return (
            <div className=" ">$2</div><div
        {...getRootProps()}
        className={`p-8 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
        } `}>
           
        </div><input {...getInputProps()} / />
        <div className=" ">$2</div><Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-white font-medium mb-2" />
            {isDragActive ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
          </p>
          <p className="text-sm text-gray-400" />
            Máximo {(maxSize / 1048576).toFixed(0)}MB por arquivo
          </p>
        </div>

      {queue.length > 0 && (
        <>
          <UploadQueue files={queue} onRemove={ removeFromQueue  }>
          {uploading && <UploadProgress />}
        </>
      )}
    </div>);};
