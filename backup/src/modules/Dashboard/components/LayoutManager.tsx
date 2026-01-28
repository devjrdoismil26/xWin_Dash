import React, { useState, useEffect } from 'react';
import { useDashboardAdvanced } from '../hooks/useDashboardAdvanced';
import { DashboardLayoutItem } from '../types/dashboardTypes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Star,
  Eye,
  Check,
  X
} from 'lucide-react';

interface LayoutManagerProps {
  onLayoutSelect?: (layout: DashboardLayoutItem) => void;
  onLayoutCreate?: () => void;
  className?: string;
}

export const LayoutManager: React.FC<LayoutManagerProps> = ({
  onLayoutSelect,
  onLayoutCreate,
  className = ''
}) => {
  const {
    layouts,
    layoutsLoading,
    layoutsError,
    fetchLayouts,
    createLayout,
    updateLayout,
    deleteLayout,
    setDefaultLayout
  } = useDashboardAdvanced();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLayoutName, setNewLayoutName] = useState('');
  const [newLayoutDescription, setNewLayoutDescription] = useState('');

  useEffect(() => {
    fetchLayouts();
  }, [fetchLayouts]);

  const handleCreateLayout = async () => {
    if (!newLayoutName.trim()) return;

    const success = await createLayout({
      name: newLayoutName,
      description: newLayoutDescription,
      widgets: [],
      is_default: false
    });

    if (success) {
      setNewLayoutName('');
      setNewLayoutDescription('');
      setIsCreating(false);
      onLayoutCreate?.();
    }
  };

  const handleUpdateLayout = async (layoutId: string, name: string, description: string) => {
    const success = await updateLayout(layoutId, { name, description });
    if (success) {
      setEditingId(null);
    }
  };

  const handleDeleteLayout = async (layoutId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este layout?')) {
      await deleteLayout(layoutId);
    }
  };

  const handleSetDefault = async (layoutId: string) => {
    await setDefaultLayout(layoutId);
  };

  if (layoutsLoading) {
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

  if (layoutsError) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-red-600">
          <p>Erro ao carregar layouts: {layoutsError}</p>
          <Button 
            onClick={fetchLayouts}
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
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Gerenciar Layouts
        </h3>
        <Button
          onClick={() => setIsCreating(true)}
          variant="primary"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Layout
        </Button>
      </div>

      {/* Create Layout Form */}
      {isCreating && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">Criar Novo Layout</h4>
          <div className="space-y-3">
            <Input
              placeholder="Nome do layout"
              value={newLayoutName}
              onChange={(e) => setNewLayoutName(e.target.value)}
            />
            <Input
              placeholder="Descrição (opcional)"
              value={newLayoutDescription}
              onChange={(e) => setNewLayoutDescription(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateLayout}
                variant="primary"
                size="sm"
                disabled={!newLayoutName.trim()}
              >
                <Check className="h-4 w-4 mr-1" />
                Criar
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false);
                  setNewLayoutName('');
                  setNewLayoutDescription('');
                }}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Layouts List */}
      <div className="space-y-3">
        {layouts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum layout encontrado</p>
            <p className="text-sm">Crie seu primeiro layout para começar</p>
          </div>
        ) : (
          layouts.map((layout) => (
            <div
              key={layout.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">
                    {editingId === layout.id ? (
                      <Input
                        value={layout.name}
                        onChange={(e) => {
                          // Update local state for editing
                        }}
                        className="text-sm"
                      />
                    ) : (
                      layout.name
                    )}
                  </h4>
                  {layout.is_default && (
                    <Badge variant="success" size="sm">
                      <Star className="h-3 w-3 mr-1" />
                      Padrão
                    </Badge>
                  )}
                </div>
                {layout.description && (
                  <p className="text-sm text-gray-600">{layout.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>{layout.widgets.length} widgets</span>
                  <span>Criado em {new Date(layout.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!layout.is_default && (
                  <Button
                    onClick={() => handleSetDefault(layout.id)}
                    variant="outline"
                    size="sm"
                    title="Definir como padrão"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  onClick={() => onLayoutSelect?.(layout)}
                  variant="outline"
                  size="sm"
                  title="Usar layout"
                >
                  <Eye className="h-4 w-4" />
                </Button>

                <Button
                  onClick={() => setEditingId(layout.id)}
                  variant="outline"
                  size="sm"
                  title="Editar layout"
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                {!layout.is_default && (
                  <Button
                    onClick={() => handleDeleteLayout(layout.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    title="Excluir layout"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default LayoutManager;
