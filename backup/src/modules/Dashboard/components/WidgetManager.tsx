/**
 * Componente de Gerenciador de Widgets
 * Gerencia a criação, edição e organização de widgets do dashboard
 */

import React, { useState } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';
import { 
  Plus, 
  Settings, 
  Eye, 
  EyeOff, 
  Trash2, 
  Move,
  LayoutGrid,
  List,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardWidget } from '../types/dashboardTypes';

interface WidgetManagerProps {
  widgets?: DashboardWidget[];
  loading?: boolean;
  error?: string;
  onAddWidget?: (widget: Omit<DashboardWidget, 'id'>) => void;
  onUpdateWidget?: (id: string, updates: Partial<DashboardWidget>) => void;
  onDeleteWidget?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  className?: string;
}

export const WidgetManager: React.FC<WidgetManagerProps> = ({
  widgets = [],
  loading = false,
  error,
  onAddWidget,
  onUpdateWidget,
  onDeleteWidget,
  onToggleVisibility,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar widgets"
        description={error}
        className={className}
      />
    );
  }

  const filteredWidgets = widgets.filter(widget => {
    const matchesSearch = widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         widget.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || widget.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const widgetTypes = ['metric', 'chart', 'table', 'list', 'gauge', 'progress'];

  const handleAddWidget = () => {
    const newWidget: Omit<DashboardWidget, 'id'> = {
      type: 'metric',
      title: 'Novo Widget',
      data: {},
      position: { x: 0, y: 0 },
      size: { width: 2, height: 1 },
      visible: true,
      settings: {}
    };
    onAddWidget?.(newWidget);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gerenciador de Widgets
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie e organize os widgets do seu dashboard
          </p>
        </div>
        <Button
          onClick={handleAddWidget}
          className="backdrop-blur-sm bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Widget
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar widgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 backdrop-blur-sm bg-white/10 border-white/20 focus:bg-white/20"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <Select.Trigger className="min-w-[150px] backdrop-blur-sm bg-white/10 border-white/20 focus:bg-white/20">
            <Select.Value placeholder="Filtrar por tipo" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="all">Todos os tipos</Select.Item>
            {widgetTypes.map(type => (
              <Select.Item key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="backdrop-blur-sm"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="backdrop-blur-sm"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Widgets List */}
      {filteredWidgets.length === 0 ? (
        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <Card.Content className="p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              {searchTerm || filterType !== 'all' 
                ? 'Nenhum widget encontrado com os filtros aplicados'
                : 'Nenhum widget criado ainda'
              }
            </div>
            {!searchTerm && filterType === 'all' && (
              <Button
                onClick={handleAddWidget}
                className="mt-4 backdrop-blur-sm bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Widget
              </Button>
            )}
          </Card.Content>
        </Card>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        )}>
          {filteredWidgets.map((widget) => (
            <Card 
              key={widget.id}
              className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Card.Title className="text-gray-900 dark:text-white">
                      {widget.title}
                    </Card.Title>
                    <Badge variant="outline" className="backdrop-blur-sm bg-white/10 border-white/20">
                      {widget.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleVisibility?.(widget.id)}
                      className="backdrop-blur-sm bg-white/10 hover:bg-white/20"
                    >
                      {widget.visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdateWidget?.(widget.id, {})}
                      className="backdrop-blur-sm bg-white/10 hover:bg-white/20"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteWidget?.(widget.id)}
                      className="backdrop-blur-sm bg-red-500/10 hover:bg-red-500/20 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Posição:</span>
                    <span className="text-gray-900 dark:text-white">
                      {widget.position.x}, {widget.position.y}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Tamanho:</span>
                    <span className="text-gray-900 dark:text-white">
                      {widget.size.width} × {widget.size.height}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Status:</span>
                    <Badge 
                      variant={widget.visible ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {widget.visible ? 'Visível' : 'Oculto'}
                    </Badge>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WidgetManager;
