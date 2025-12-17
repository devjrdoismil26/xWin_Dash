/**
 * Gerenciador de Widgets do Dashboard
 *
 * @description
 * Componente completo para gerenciar widgets do dashboard incluindo
 * criação, edição, exclusão, reorganização e controle de visibilidade.
 * Suporta busca e filtros de widgets.
 *
 * @module modules/Dashboard/components/WidgetManager
 * @since 1.0.0
 */

import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Input } from '@/shared/components/ui/Input';
import Select, { SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/Select';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { Plus, Settings, Eye, EyeOff, Trash2, Move, LayoutGrid, List, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardWidget } from '../types/dashboardTypes';

/**
 * Props do componente WidgetManager
 *
 * @interface WidgetManagerProps
 * @property {DashboardWidget[]} [widgets] - Lista de widgets
 * @property {boolean} [loading] - Se está carregando dados
 * @property {string} [error] - Mensagem de erro
 * @property {(widget: Omit<DashboardWidget, 'id'>) => void} [onAddWidget] - Callback para adicionar widget
 * @property {(id: string, updates: Partial<DashboardWidget>) => void} [onUpdateWidget] - Callback para atualizar widget
 * @property {(id: string) => void} [onDeleteWidget] - Callback para excluir widget
 * @property {(id: string) => void} [onToggleVisibility] - Callback para alternar visibilidade
 * @property {string} [className] - Classes CSS adicionais
 */
interface WidgetManagerProps {
  widgets?: DashboardWidget[];
  loading?: boolean;
  error?: string;
  onAddWidget??: (e: any) => void;
  onUpdateWidget??: (e: any) => void;
  onDeleteWidget??: (e: any) => void;
  onToggleVisibility??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente WidgetManager
 *
 * @description
 * Renderiza interface de gerenciamento de widgets com grid responsivo,
 * busca, filtros e controles para criar, editar e organizar widgets.
 *
 * @param {WidgetManagerProps} props - Props do componente
 * @returns {JSX.Element} Gerenciador de widgets
 */
export const WidgetManager: React.FC<WidgetManagerProps> = ({ widgets = [] as unknown[],
  loading = false,
  error,
  onAddWidget,
  onUpdateWidget,
  onDeleteWidget,
  onToggleVisibility,
  className
   }) => { const [searchTerm, setSearchTerm] = useState('');

  const [filterType, setFilterType] = useState<string>('all');

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (loading) {
    return (
        <>
      <div className={cn("flex items-center justify-center h-64", className)  }>
      </div><LoadingSpinner size="lg" / />
      </div>);

  }

  if (error) {
    return (
              <ErrorState
        title="Erro ao carregar widgets"
        description={ error }
        className={className} / />);

  }

  const filteredWidgets = (widgets || []).filter(widget => {
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
      settings: {} ;

    onAddWidget?.(newWidget);};

  return (
        <>
      <div className={cn("space-y-6", className)  }>
      </div>{/* Header */}
      <div className=" ">$2</div><div>
           
        </div><h2 className="text-2xl font-bold text-gray-900 dark:text-white" />
            Gerenciador de Widgets
          </h2>
          <p className="text-gray-600 dark:text-gray-300" />
            Gerencie e organize os widgets do seu dashboard
          </p></div><Button
          onClick={ handleAddWidget }
          className="backdrop-blur-sm bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-600" />
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Widget
        </Button>
      </div>

      {/* Filters and Search */}
      <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar widgets..."
            value={ searchTerm }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value) }
            className="pl-10 backdrop-blur-sm bg-white/10 border-white/20 focus:bg-white/20" /></div><Select value={filterType} onValueChange={ setFilterType } />
          <SelectTrigger className="min-w-[150px] backdrop-blur-sm bg-white/10 border-white/20 focus:bg-white/20" />
            <SelectValue placeholder="Filtrar por tipo" / /></SelectTrigger><SelectContent />
            <SelectItem value="all">Todos os tipos</SelectItem>
            {(widgetTypes || []).map(type => (
              <SelectItem key={type} value={ type } />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent></Select><div className=" ">$2</div><Button
            variant={ viewMode === 'grid' ? 'default' : 'outline' }
            size="sm"
            onClick={ () => setViewMode('grid') }
            className="backdrop-blur-sm"
          >
            <LayoutGrid className="h-4 w-4" /></Button><Button
            variant={ viewMode === 'list' ? 'default' : 'outline' }
            size="sm"
            onClick={ () => setViewMode('list') }
            className="backdrop-blur-sm"
          >
            <List className="h-4 w-4" /></Button></div>

      {/* Widgets List */}
      {filteredWidgets.length === 0 ? (
        <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
          <Card.Content className="p-8 text-center" />
            <div className="{searchTerm || filterType !== 'all' ">$2</div>
                ? 'Nenhum widget encontrado com os filtros aplicados'
                : 'Nenhum widget criado ainda'
              }
            </div>
            {!searchTerm && filterType === 'all' && (
              <Button
                onClick={ handleAddWidget }
                className="mt-4 backdrop-blur-sm bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30 text-blue-600" />
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Widget
              </Button>
            )}
          </Card.Content>
      </Card>
    </>
  ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        )  }>
        </div>{(filteredWidgets || []).map((widget: unknown) => (
            <Card 
              key={ widget.id }
              className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300" />
              <Card.Header />
                <div className=" ">$2</div><div className=" ">$2</div><Card.Title className="text-gray-900 dark:text-white" />
                      {widget.title}
                    </Card.Title>
                    <Badge variant="outline" className="backdrop-blur-sm bg-white/10 border-white/20" />
                      {widget.type}
                    </Badge></div><div className=" ">$2</div><Button
                      variant="ghost"
                      size="sm"
                      onClick={ () => onToggleVisibility?.(widget.id) }
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
                      <Settings className="h-4 w-4" /></Button><Button
                      variant="ghost"
                      size="sm"
                      onClick={ () => onDeleteWidget?.(widget.id) }
                      className="backdrop-blur-sm bg-red-500/10 hover:bg-red-500/20 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" /></Button></div>
              </Card.Header>
              <Card.Content />
                <div className=" ">$2</div><div className=" ">$2</div><span className="text-gray-600 dark:text-gray-300">Posição:</span>
                    <span className="{widget.position.x}, {widget.position.y}">$2</span>
                    </span></div><div className=" ">$2</div><span className="text-gray-600 dark:text-gray-300">Tamanho:</span>
                    <span className="{widget.size.width} × {widget.size.height}">$2</span>
                    </span></div><div className=" ">$2</div><span className="text-gray-600 dark:text-gray-300">Status:</span>
                    <Badge 
                      variant={ widget.visible ? 'default' : 'secondary' }
                      className="text-xs" />
                      {widget.visible ? 'Visível' : 'Oculto'}
                    </Badge></div></Card.Content>
      </Card>
    </>
  ))}
        </div>
      )}
    </div>);};

export default WidgetManager;
