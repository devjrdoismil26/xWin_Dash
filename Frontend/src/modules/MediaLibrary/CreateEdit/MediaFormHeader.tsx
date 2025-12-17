import React from 'react';
import { X, Save } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

interface MediaFormHeaderProps {
  mode: 'create' | 'edit' | 'view' | 'upload';
  loading?: boolean;
  onSave??: (e: any) => void;
  onClose???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const MediaFormHeader: React.FC<MediaFormHeaderProps> = ({ mode,
  loading,
  onSave,
  onClose
   }) => {
  const title = {
    create: 'Nova Mídia',
    edit: 'Editar Mídia',
    view: 'Visualizar Mídia',
    upload: 'Upload de Mídia'
  }[mode];

  return (
            <div className=" ">$2</div><h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <div className="{mode !== 'view' && (">$2</div>
          <Button onClick={onSave} disabled={ loading } />
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        )}
        { onClose && (
          <Button variant="outline" onClick={onClose } />
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>);};
