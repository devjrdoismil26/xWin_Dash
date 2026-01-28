/**
 * Componente de ações do módulo Activity
 * Ações em lote e operações em massa
 */

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Download, 
  Trash2, 
  CheckSquare, 
  Square,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface ActivityActionsProps {
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onExport?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
  className?: string;
}

export const ActivityActions: React.FC<ActivityActionsProps> = ({
  selectedCount,
  onSelectAll,
  onClearSelection,
  onExport,
  onDelete,
  onRefresh,
  className
}) => {
  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm(`Tem certeza que deseja excluir ${selectedCount} atividades?`)) {
      onDelete();
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Card className={`backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 ${className}`}>
      <Card.Content className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="backdrop-blur-sm">
                {selectedCount} selecionado{selectedCount !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onSelectAll}
                className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Selecionar Todos
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
              >
                <Square className="h-4 w-4 mr-2" />
                Limpar Seleção
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="backdrop-blur-sm bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="backdrop-blur-sm bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ActivityActions;
