import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Download, Trash2 } from 'lucide-react';

interface MediaContentToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll??: (e: any) => void;
  onDownload??: (e: any) => void;
  onDelete??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const MediaContentToolbar: React.FC<MediaContentToolbarProps> = ({ selectedCount,
  totalCount,
  onSelectAll,
  onDownload,
  onDelete
   }) => {
  if (totalCount === 0) return null;

  return (
            <div className=" ">$2</div><div className=" ">$2</div><label className="flex items-center gap-2 text-sm text-gray-400" />
          <input
            type="checkbox"
            checked={ selectedCount === totalCount }
            onChange={ onSelectAll }
            className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
          / />
          Selecionar todos
        </label>
        {selectedCount > 0 && (
          <Badge variant="outline" className="backdrop-blur-sm bg-blue-500/20 text-blue-400 border-blue-500/30" />
            {selectedCount} selecionados
          </Badge>
        )}
      </div>
      
      {selectedCount > 0 && (
        <div className=" ">$2</div><Button onClick={onDownload} variant="outline" size="sm" className="backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20" />
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </Button>
          <Button onClick={onDelete} variant="outline" size="sm" className="backdrop-blur-sm bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30" />
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
      </div>
    </>
  )}
    </div>);};
