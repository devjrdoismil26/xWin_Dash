import React, { useState, useEffect } from 'react';
import { useAnalyticsAdvanced } from '../hooks/useAnalyticsAdvanced';
import { AnalyticsDashboardItem } from '../types/analyticsTypes';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Eye,
  Plus,
  Pencil,
  Trash2,
  Settings,
  BarChart3,
  Table,
  LineChart,
  Users,
  Clock,
  Share,
  FileText
} from 'lucide-react';

interface AnalyticsDashboardBuilderProps {
  dashboardId?: string;
  className?: string;
}

interface Widget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'text';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: any;
}

export const AnalyticsDashboardBuilder: React.FC<AnalyticsDashboardBuilderProps> = ({
  dashboardId,
  className = ''
}) => {
  const {
    dashboards,
    currentDashboard,
    dashboardsLoading,
    dashboardsError,
    fetchDashboards,
    getDashboard,
    createDashboard,
    updateDashboard,
    deleteDashboard
  } = useAnalyticsAdvanced();

  const [selectedDashboard, setSelectedDashboard] = useState<AnalyticsDashboardItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newDashboardData, setNewDashboardData] = useState({
    name: '',
    description: '',
    widgets: []
  });
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  useEffect(() => {
    if (dashboardId && dashboards.length > 0) {
      getDashboard(dashboardId);
    }
  }, [dashboardId, dashboards, getDashboard]);

  useEffect(() => {
    if (currentDashboard) {
      setSelectedDashboard(currentDashboard);
      setWidgets(currentDashboard.widgets || []);
    }
  }, [currentDashboard]);

  const handleCreateDashboard = async () => {
    if (!newDashboardData.name.trim()) return;

    const success = await createDashboard(newDashboardData);
    if (success) {
      setNewDashboardData({ name: '', description: '', widgets: [] });
      setIsCreating(false);
    }
  };

  const handleSaveDashboard = async () => {
    if (!selectedDashboard) return;

    const updatedDashboard = {
      ...selectedDashboard,
      widgets: widgets
    };

    const success = await updateDashboard(selectedDashboard.id, updatedDashboard);
    if (success) {
      await fetchDashboards();
      setIsEditing(false);
    }
  };

  const handleAddWidget = (type: string) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: type as any,
      title: `Novo ${type}`,
      position: { x: 0, y: 0, w: 4, h: 3 },
      config: {}
    };

    setWidgets(prev => [...prev, newWidget]);
    setSelectedWidget(newWidget);
  };

  const handleUpdateWidget = (widgetId: string, updates: Partial<Widget>) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId ? { ...widget, ...updates } : widget
    ));
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
    if (selectedWidget?.id === widgetId) {
      setSelectedWidget(null);
    }
  };

  const handleDragStart = (e: React.MouseEvent, widget: Widget) => {
    setIsDragging(true);
    setSelectedWidget(widget);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'chart': return <BarChart3 className="h-5 w-5" />;
      case 'table': return <Table className="h-5 w-5" />;
      case 'metric': return <LineChart className="h-5 w-5" />;
      case 'text': return <FileText className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const getWidgetColor = (type: string) => {
    switch (type) {
      case 'chart': return 'bg-blue-500';
      case 'table': return 'bg-green-500';
      case 'metric': return 'bg-purple-500';
      case 'text': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const renderWidget = (widget: Widget) => {
    const baseClasses = `p-4 border-2 rounded-lg cursor-move transition-all ${
      selectedWidget?.id === widget.id 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200 hover:border-gray-300'
    }`;

    switch (widget.type) {
      case 'chart':
        return (
          <div className={`${baseClasses} ${getWidgetColor(widget.type)} bg-opacity-10`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{widget.title}</h4>
              {getWidgetIcon(widget.type)}
            </div>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500 text-sm">Gráfico de {widget.title}</span>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className={`${baseClasses} ${getWidgetColor(widget.type)} bg-opacity-10`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{widget.title}</h4>
              {getWidgetIcon(widget.type)}
            </div>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500 text-sm">Tabela de {widget.title}</span>
            </div>
          </div>
        );

      case 'metric':
        return (
          <div className={`${baseClasses} ${getWidgetColor(widget.type)} bg-opacity-10`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{widget.title}</h4>
              {getWidgetIcon(widget.type)}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.floor(Math.random() * 10000).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              +{Math.floor(Math.random() * 20)}% vs período anterior
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`${baseClasses} ${getWidgetColor(widget.type)} bg-opacity-10`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{widget.title}</h4>
              {getWidgetIcon(widget.type)}
            </div>
            <div className="text-sm text-gray-600">
              Texto personalizado do widget
            </div>
          </div>
        );

      default:
        return (
          <div className={`${baseClasses} ${getWidgetColor(widget.type)} bg-opacity-10`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{widget.title}</h4>
              {getWidgetIcon(widget.type)}
            </div>
            <div className="text-sm text-gray-600">
              Widget personalizado
            </div>
          </div>
        );
    }
  };

  if (dashboardsLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (dashboardsError) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-red-600">
          <p>Erro ao carregar dashboards: {dashboardsError}</p>
          <Button 
            onClick={fetchDashboards}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Tentar Novamente
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Construtor de Dashboards
            </h2>
            <p className="text-gray-600 mt-1">
              Crie e personalize dashboards de analytics interativos
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedDashboard && (
              <>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? 'primary' : 'outline'}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  {isEditing ? 'Visualizar' : 'Editar'}
                </Button>
                
                {isEditing && (
                  <Button
                    onClick={handleSaveDashboard}
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Salvar
                  </Button>
                )}
              </>
            )}
            
            <Button
              onClick={() => setIsCreating(true)}
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Dashboard
            </Button>
          </div>
        </div>
      </Card>

      {/* Dashboard Selector */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Selecionar Dashboard
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((dashboard) => (
            <div
              key={dashboard.id}
              onClick={() => setSelectedDashboard(dashboard)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedDashboard?.id === dashboard.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  {dashboard.name}
                </h4>
                {dashboard.is_default && (
                  <Badge variant="success" size="sm">
                    Padrão
                  </Badge>
                )}
              </div>
              
              {dashboard.description && (
                <p className="text-sm text-gray-600 mb-2">
                  {dashboard.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {dashboard.widgets.length} widgets
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(dashboard.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Dashboard Form */}
      {isCreating && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Criar Novo Dashboard
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Dashboard
              </label>
              <input
                type="text"
                value={newDashboardData.name}
                onChange={(e) => setNewDashboardData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Ex: Dashboard de Vendas"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={newDashboardData.description}
                onChange={(e) => setNewDashboardData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                rows={3}
                placeholder="Descreva o propósito deste dashboard"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleCreateDashboard}
                variant="primary"
                size="sm"
                disabled={!newDashboardData.name.trim()}
              >
                Criar Dashboard
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false);
                  setNewDashboardData({ name: '', description: '', widgets: [] });
                }}
                variant="outline"
                size="sm"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Dashboard Builder */}
      {selectedDashboard && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDashboard.name}
              </h3>
              {selectedDashboard.description && (
                <p className="text-gray-600 mt-1">
                  {selectedDashboard.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setSelectedDashboard(null)}
                variant="outline"
                size="sm"
              >
                Fechar
              </Button>
            </div>
          </div>

          {/* Widget Toolbar */}
          {isEditing && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Adicionar Widgets
              </h4>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAddWidget('chart')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Gráfico
                </Button>
                <Button
                  onClick={() => handleAddWidget('table')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Table className="h-4 w-4" />
                  Tabela
                </Button>
                <Button
                  onClick={() => handleAddWidget('metric')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LineChart className="h-4 w-4" />
                  Métrica
                </Button>
                <Button
                  onClick={() => handleAddWidget('text')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Texto
                </Button>
              </div>
            </div>
          )}

          {/* Dashboard Grid */}
          <div className="grid grid-cols-12 gap-4 min-h-96">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`col-span-${widget.position.w} row-span-${widget.position.h} ${
                  isEditing ? 'cursor-move' : ''
                }`}
                onMouseDown={(e) => isEditing && handleDragStart(e, widget)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              >
                <div className="relative">
                  {renderWidget(widget)}
                  
                  {isEditing && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        onClick={() => setSelectedWidget(widget)}
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        title="Configurar widget"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteWidget(widget.id)}
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        title="Remover widget"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {widgets.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum widget adicionado</p>
              <p className="text-sm">
                {isEditing 
                  ? 'Use a barra de ferramentas acima para adicionar widgets'
                  : 'Este dashboard não possui widgets configurados'
                }
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Widget Configuration Panel */}
      {selectedWidget && isEditing && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Configurar Widget
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={selectedWidget.title}
                onChange={(e) => handleUpdateWidget(selectedWidget.id, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Largura
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={selectedWidget.position.w}
                  onChange={(e) => handleUpdateWidget(selectedWidget.id, { 
                    position: { ...selectedWidget.position, w: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={selectedWidget.position.h}
                  onChange={(e) => handleUpdateWidget(selectedWidget.id, { 
                    position: { ...selectedWidget.position, h: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedWidget(null)}
                variant="outline"
                size="sm"
              >
                Fechar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!selectedDashboard && !isCreating && dashboards.length === 0 && (
        <Card className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum dashboard encontrado</p>
            <p className="text-sm">Crie seu primeiro dashboard para começar</p>
            <Button
              onClick={() => setIsCreating(true)}
              variant="primary"
              size="sm"
              className="mt-4"
            >
              Criar Primeiro Dashboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboardBuilder;
