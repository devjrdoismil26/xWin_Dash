/**
 * @module AuraDashboards
 * @description Componente para gerenciar dashboards de analytics do Aura.
 * 
 * Este componente permite criar, editar, excluir e gerenciar dashboards personalizados
 * de analytics. Os dashboards podem conter widgets customizados, ter layouts configur?veis
 * e podem ser marcados como p?blicos ou privados. Tamb?m ? poss?vel definir um dashboard
 * como padr?o.
 * 
 * @example
 * ```tsx
 * <AuraDashboards / />
 * ```
 * 
 * @since 1.0.0
 */

import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Badge } from '@/shared/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/Dialog';
import { Switch } from '@/shared/components/ui/switch';
import { Plus, Edit, Trash2, Eye, Settings, Star, LayoutGrid, BarChart3, PieChart, Activity, Gauge, Map } from 'lucide-react';
import { useAuraDashboards } from '../hooks/useAuraAdvanced';

/**
 * Componente para gerenciar dashboards de analytics do Aura
 * 
 * @returns {JSX.Element} Componente renderizado
 */
export const AuraDashboards: React.FC = () => {
  const { dashboards, loading, error, createDashboard, updateDashboard, deleteDashboard, setDefaultDashboard } = useAuraDashboards();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingDashboard, setEditingDashboard] = useState<any>(null);

  const [newDashboard, setNewDashboard] = useState({
    name: '',
    description: '',
    widgets: [],
    layout: {
      columns: 4,
      rows: 3,
      gap: 16,
      padding: 16
    },
    isPublic: false,
    isDefault: false
  });

  const handleCreateDashboard = async () => {
    try {
      await createDashboard(newDashboard);

      setNewDashboard({
        name: '',
        description: '',
        widgets: [],
        layout: {
          columns: 4,
          rows: 3,
          gap: 16,
          padding: 16
        },
        isPublic: false,
        isDefault: false
      });

      setIsCreateModalOpen(false);

    } catch (error) {
      console.error('Error creating dashboard:', error);

    } ;

  const handleUpdateDashboard = async (id: string, data: unknown) => {
    try {
      await updateDashboard(id, data);

      setEditingDashboard(null);

    } catch (error) {
      console.error('Error updating dashboard:', error);

    } ;

  const handleDeleteDashboard = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this dashboard?')) {
      try {
        await deleteDashboard(id);

      } catch (error) {
        console.error('Error deleting dashboard:', error);

      } };

  const handleSetDefaultDashboard = async (id: string) => {
    try {
      await setDefaultDashboard(id);

    } catch (error) {
      console.error('Error setting default dashboard:', error);

    } ;

  /**
   * Retorna o ?cone apropriado para um tipo de widget
   * 
   * @param {string} type - Tipo do widget (metric, chart, table, gauge, map)
   * @returns {JSX.Element} ?cone renderizado
   */
  const getWidgetIcon = (type: string): JSX.Element => {
    switch (type) {
      case 'metric': return <Activity className="w-4 h-4" />;
      case 'chart': return <BarChart3 className="w-4 h-4" />;
      case 'table': return <LayoutGrid className="w-4 h-4" />;
      case 'gauge': return <Gauge className="w-4 h-4" />;
      case 'map': return <Map className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    } ;

  if (loading) return <div>Loading dashboards...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h2 className="text-2xl font-bold">Analytics Dashboards</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={ setIsCreateModalOpen } />
          <DialogTrigger asChild />
            <Button />
              <Plus className="w-4 h-4 mr-2" />
              Create Dashboard
            </Button></DialogTrigger><DialogContent className="max-w-2xl" />
            <DialogHeader />
              <DialogTitle>Create Analytics Dashboard</DialogTitle></DialogHeader><div className=" ">$2</div><div>
           
        </div><Label htmlFor="name">Dashboard Name</Label>
                <Input
                  id="name"
                  value={ newDashboard.name }
                  onChange={(e: unknown) => setNewDashboard({ ...newDashboard, name: e.target.value })}
                  placeholder="Enter dashboard name" /></div><div>
           
        </div><Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={ newDashboard.description }
                  onChange={(e: unknown) => setNewDashboard({ ...newDashboard, description: e.target.value })}
                  placeholder="Enter dashboard description" /></div><div className=" ">$2</div><div>
           
        </div><Label htmlFor="columns">Columns</Label>
                  <Input
                    id="columns"
                    type="number"
                    min="1"
                    max="12"
                    value={ newDashboard.layout.columns }
                    onChange={ (e: unknown) => setNewDashboard({ 
                      ...newDashboard, 
                      layout: { ...newDashboard.layout, columns: parseInt(e.target.value)  } )} /></div><div>
           
        </div><Label htmlFor="rows">Rows</Label>
                  <Input
                    id="rows"
                    type="number"
                    min="1"
                    max="20"
                    value={ newDashboard.layout.rows }
                    onChange={ (e: unknown) => setNewDashboard({ 
                      ...newDashboard, 
                      layout: { ...newDashboard.layout, rows: parseInt(e.target.value)  } )} /></div><div className=" ">$2</div><div className=" ">$2</div><Switch
                    id="isPublic"
                    checked={ newDashboard.isPublic }
                    onCheckedChange={(checked: unknown) => setNewDashboard({ ...newDashboard, isPublic: checked })} />
                  <Label htmlFor="isPublic">Public</Label></div><div className=" ">$2</div><Switch
                    id="isDefault"
                    checked={ newDashboard.isDefault }
                    onCheckedChange={(checked: unknown) => setNewDashboard({ ...newDashboard, isDefault: checked })} />
                  <Label htmlFor="isDefault">Default</Label></div><div className=" ">$2</div><Button variant="outline" onClick={ () => setIsCreateModalOpen(false)  }>
                  Cancel
                </Button>
                <Button onClick={ handleCreateDashboard }>Create Dashboard</Button></div></DialogContent></Dialog></div>

      <div className="{ dashboards?.map((dashboard: unknown) => (">$2</div>
          <Card key={dashboard.id } />
            <Card.Header />
              <div className=" ">$2</div><div>
           
        </div><Card.Title className="flex items-center gap-2" />
                    {dashboard.name}
                    {dashboard.isDefault && (
                      <Badge variant="default" className="flex items-center gap-1" />
                        <Star className="w-3 h-3" />
                        Default
                      </Badge>
                    )}
                    <Badge variant={ dashboard.isPublic ? 'default' : 'secondary' } />
                      {dashboard.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </Card.Title>
                  <p className="text-sm text-muted-foreground mt-1" />
                    {dashboard.description}
                  </p></div><div className=" ">$2</div><Button
                    variant="outline"
                    size="sm"
                    onClick={ () => handleSetDefaultDashboard(dashboard.id) }
                    disabled={ dashboard.isDefault  }>
                    <Star className="w-4 h-4" /></Button><Button
                    variant="outline"
                    size="sm" />
                    <Eye className="w-4 h-4" /></Button><Button
                    variant="outline"
                    size="sm"
                    onClick={ () => setEditingDashboard(dashboard)  }>
                    <Edit className="w-4 h-4" /></Button><Button
                    variant="outline"
                    size="sm"
                    onClick={ () => handleDeleteDashboard(dashboard.id)  }>
                    <Trash2 className="w-4 h-4" /></Button></div>
            </Card.Header>
            <Card.Content />
              <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><div className="text-sm font-medium">Layout</div>
                    <div className="{dashboard.layout.columns} ? {dashboard.layout.rows}">$2</div>
                    </div>
                  <div>
           
        </div><div className="text-sm font-medium">Widgets</div>
                    <div className="{dashboard.widgets?.length || 0} widgets">$2</div>
                    </div>
                  <div>
           
        </div><div className="text-sm font-medium">Created</div>
                    <div className="{new Date(dashboard.createdAt).toLocaleDateString()}">$2</div>
                    </div>
                  <div>
           
        </div><div className="text-sm font-medium">Updated</div>
                    <div className="{new Date(dashboard.updatedAt).toLocaleDateString()}">$2</div>
                    </div>
                </div>
                
                {dashboard.widgets && dashboard.widgets.length > 0 && (
                  <div>
           
        </div><div className="text-sm font-medium mb-2">Widgets</div>
                    <div className="{(dashboard.widgets || []).map((widget: unknown, index: number) => {">$2</div>
                        const w = widget as { type?: string; title?: string};

                        return (
                                <Badge key={index} variant="outline" className="flex items-center gap-1" />
                          {getWidgetIcon(w.type)}
                          {w.title}
                        </Badge>);

                      })}
                    </div>
                )}
              </div>
            </Card.Content>
      </Card>
    </>
  ))}
      </div>

      {editingDashboard && (
        <Dialog open={!!editingDashboard} onOpenChange={ () => setEditingDashboard(null)  }>
          <DialogContent className="max-w-2xl" />
            <DialogHeader />
              <DialogTitle>Edit Dashboard</DialogTitle></DialogHeader><div className=" ">$2</div><div>
           
        </div><Label htmlFor="edit-name">Dashboard Name</Label>
                <Input
                  id="edit-name"
                  value={ editingDashboard.name }
                  onChange={(e: unknown) => setEditingDashboard({ ...editingDashboard, name: e.target.value })} /></div><div>
           
        </div><Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={ editingDashboard.description }
                  onChange={(e: unknown) => setEditingDashboard({ ...editingDashboard, description: e.target.value })} /></div><div className=" ">$2</div><div className=" ">$2</div><Switch
                    id="edit-isPublic"
                    checked={ editingDashboard.isPublic }
                    onCheckedChange={(checked: unknown) => setEditingDashboard({ ...editingDashboard, isPublic: checked })} />
                  <Label htmlFor="edit-isPublic">Public</Label></div><div className=" ">$2</div><Switch
                    id="edit-isDefault"
                    checked={ editingDashboard.isDefault }
                    onCheckedChange={(checked: unknown) => setEditingDashboard({ ...editingDashboard, isDefault: checked })} />
                  <Label htmlFor="edit-isDefault">Default</Label></div><div className=" ">$2</div><Button variant="outline" onClick={ () => setEditingDashboard(null)  }>
                  Cancel
                </Button>
                <Button onClick={ () => handleUpdateDashboard(editingDashboard.id, editingDashboard)  }>
                  Update Dashboard
                </Button></div></DialogContent>
      </Dialog>
    </>
  )}
    </div>);};
