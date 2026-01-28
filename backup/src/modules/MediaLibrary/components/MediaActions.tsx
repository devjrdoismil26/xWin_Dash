// =========================================
// MEDIA ACTIONS COMPONENT
// =========================================
// Componente para ações em lote de mídia
// Máximo: 150 linhas

import React from 'react';
import { Trash2, Move, Download, Copy, Share, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface MediaActionsProps {
  selectedCount: number;
  onBulkAction: (action: string, ids: string[]) => void;
  loading?: boolean;
  className?: string;
}

export const MediaActions: React.FC<MediaActionsProps> = ({
  selectedCount,
  onBulkAction,
  loading = false,
  className = ''
}) => {
  // =========================================
  // HANDLERS
  // =========================================

  const handleAction = (action: string) => {
    onBulkAction(action, []);
  };

  // =========================================
  // RENDER
  // =========================================

  if (selectedCount === 0) {
    return null;
  }

  return (
    <Card className={`p-4 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {selectedCount} arquivo(s) selecionado(s)
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('download')}
            disabled={loading}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('copy')}
            disabled={loading}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('move')}
            disabled={loading}
          >
            <Move className="w-4 h-4 mr-2" />
            Mover
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('tag')}
            disabled={loading}
          >
            <Tag className="w-4 h-4 mr-2" />
            Tag
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('share')}
            disabled={loading}
          >
            <Share className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('delete')}
            disabled={loading}
            className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MediaActions;
