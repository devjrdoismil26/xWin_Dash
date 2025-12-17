import React from 'react';
import { Upload, Grid, List } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

interface MediaLibraryHeaderProps {
  viewMode: 'grid' | 'list';
  onViewChange?: (e: any) => void;
  onUpload??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const MediaLibraryHeader: React.FC<MediaLibraryHeaderProps> = ({ viewMode,
  onViewChange,
  onUpload
   }) => {
  return (
            <div className=" ">$2</div><h2 className="text-xl font-bold">Biblioteca de Mídia</h2>
      <div className=" ">$2</div><Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={ () => onViewChange('grid')  }>
          <Grid className="w-4 h-4" /></Button><Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={ () => onViewChange('list')  }>
          <List className="w-4 h-4" /></Button><Button onClick={ onUpload } />
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>);};
