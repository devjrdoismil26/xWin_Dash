/**
 * @module modules/Dashboard/components/LayoutManager
 * @description
 * Componente gerenciador de layouts do dashboard.
 * 
 * Gerencia layouts personalizados do dashboard:
 * - Listar, criar, editar e excluir layouts
 * - Definir layout padrão
 * - Selecionar layout para uso
 * 
 * @example
 * ```typescript
 * <LayoutManager
 *   onLayoutSelect={ (layout: unknown) =>  }
 *   onLayoutCreate={ () =>  }
 *   className="p-4"
 * />
 * ```
 * 
 * @since 1.0.0
 */
import React, { useState, useEffect } from 'react';
import { useDashboardAdvanced } from '../hooks/useDashboardAdvanced';
import { DashboardLayoutItem } from '../types/dashboardTypes';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Plus, Pencil, Trash2, Star, Eye, Check, X } from 'lucide-react';

/**
 * Props do gerenciador de layouts
 * @interface LayoutManagerProps
 */
interface LayoutManagerProps {
  /** Callback quando um layout é selecionado */
onLayoutSelect??: (e: any) => void;
  /** Callback quando um novo layout é criado */
onLayoutCreate???: (e: any) => void;
  /** Classe CSS adicional */
className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const LayoutManager: React.FC<LayoutManagerProps> = ({ onLayoutSelect,
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

    } ;

  const handleUpdateLayout = async (layoutId: string, name: string, description: string) => {
    const success = await updateLayout(layoutId, { name, description });

    if (success) {
      setEditingId(null);

    } ;

  const handleDeleteLayout = async (layoutId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este layout?')) {
      await deleteLayout(layoutId);

    } ;

  const handleSetDefault = async (layoutId: string) => {
    await setDefaultLayout(layoutId);};

  if (layoutsLoading) {
    return (
        <>
      <Card className={`p-6 ${className} `} />
      <div className=" ">$2</div><div className=" ">$2</div><div className="{[1, 2, 3].map(i => (">$2</div>
      <div key={i} className="h-16 bg-gray-200 rounded">
    </>
  ))}
        </div>
          </div>
      </Card>);

  }

  if (layoutsError) {
    return (
        <>
      <Card className={`p-6 ${className} `} />
      <div className=" ">$2</div><p>Erro ao carregar layouts: {layoutsError}</p>
          <Button 
            onClick={ fetchLayouts }
            variant="outline"
            size="sm"
            className="mt-2" />
            Tentar Novamente
          </Button></div></Card>);

  }

  return (
        <>
      <Card className={`p-6 ${className} `} />
      <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900" />
          Gerenciar Layouts
        </h3>
        <Button
          onClick={ () => setIsCreating(true) }
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
        <div className=" ">$2</div><h4 className="font-medium text-gray-900 mb-3">Criar Novo Layout</h4>
          <div className=" ">$2</div><Input
              placeholder="Nome do layout"
              value={ newLayoutName }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setNewLayoutName(e.target.value) } />
            <Input
              placeholder="Descrição (opcional)"
              value={ newLayoutDescription }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setNewLayoutDescription(e.target.value) } />
            <div className=" ">$2</div><Button
                onClick={ handleCreateLayout }
                variant="primary"
                size="sm"
                disabled={ !newLayoutName.trim() } />
                <Check className="h-4 w-4 mr-1" />
                Criar
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false);

                  setNewLayoutName('');

                  setNewLayoutDescription('');

                } variant="outline"
                size="sm"
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button></div></div>
      )}

      {/* Layouts List */}
      <div className="{layouts.length === 0 ? (">$2</div>
          <div className=" ">$2</div><Eye className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum layout encontrado</p>
            <p className="text-sm">Crie seu primeiro layout para começar</p>
      </div>
    </>
  ) : (
          (layouts || []).map((layout: unknown) => (
            <div
              key={ layout.id }
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><h4 className="font-medium text-gray-900" />
                    {editingId === layout.id ? (
                      <Input
                        value={ layout.name }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          // Update local state for editing
                        } className="text-sm" />
                    ) : (
                      layout.name
                    )}
                  </h4>
                  {layout.is_default && (
                    <Badge variant="success" size="sm" />
                      <Star className="h-3 w-3 mr-1" />
                      Padrão
                    </Badge>
                  )}
                </div>
                {layout.description && (
                  <p className="text-sm text-gray-600">{layout.description}</p>
                )}
                <div className=" ">$2</div><span>{layout.widgets.length} widgets</span>
                  <span>Criado em {new Date(layout.created_at).toLocaleDateString('pt-BR')}</span></div><div className="{!layout.is_default && (">$2</div>
                  <Button
                    onClick={ () => handleSetDefault(layout.id) }
                    variant="outline"
                    size="sm"
                    title="Definir como padrão"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  onClick={ () => onLayoutSelect?.(layout) }
                  variant="outline"
                  size="sm"
                  title="Usar layout"
                >
                  <Eye className="h-4 w-4" /></Button><Button
                  onClick={ () => setEditingId(layout.id) }
                  variant="outline"
                  size="sm"
                  title="Editar layout"
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                {!layout.is_default && (
                  <Button
                    onClick={ () => handleDeleteLayout(layout.id) }
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    title="Excluir layout"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
          ))
        )}
      </div>
    </Card>);};

export default LayoutManager;
