import React, { useState } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Settings,
  Star,
  LayoutGrid,
  BarChart3,
  PieChart,
  Activity,
  Gauge,
  Map
} from 'lucide-react';
import { useAuraDashboards } from '../hooks/useAuraAdvanced';

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
    }
  };

  const handleUpdateDashboard = async (id: string, data: any) => {
    try {
      await updateDashboard(id, data);
      setEditingDashboard(null);
    } catch (error) {
      console.error('Error updating dashboard:', error);
    }
  };

  const handleDeleteDashboard = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this dashboard?')) {
      try {
        await deleteDashboard(id);
      } catch (error) {
        console.error('Error deleting dashboard:', error);
      }
    }
  };

  const handleSetDefaultDashboard = async (id: string) => {
    try {
      await setDefaultDashboard(id);
    } catch (error) {
      console.error('Error setting default dashboard:', error);
    }
  };

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'metric': return <Activity className="w-4 h-4" />;
      case 'chart': return <BarChart3 className="w-4 h-4" />;
      case 'table': return <LayoutGrid className="w-4 h-4" />;
      case 'gauge': return <Gauge className="w-4 h-4" />;
      case 'map': return <Map className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  if (loading) return <div>Loading dashboards...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboards</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Dashboard
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Analytics Dashboard</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Dashboard Name</Label>
                <Input
                  id="name"
                  value={newDashboard.name}
                  onChange={(e) => setNewDashboard({ ...newDashboard, name: e.target.value })}
                  placeholder="Enter dashboard name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDashboard.description}
                  onChange={(e) => setNewDashboard({ ...newDashboard, description: e.target.value })}
                  placeholder="Enter dashboard description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="columns">Columns</Label>
                  <Input
                    id="columns"
                    type="number"
                    min="1"
                    max="12"
                    value={newDashboard.layout.columns}
                    onChange={(e) => setNewDashboard({ 
                      ...newDashboard, 
                      layout: { ...newDashboard.layout, columns: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="rows">Rows</Label>
                  <Input
                    id="rows"
                    type="number"
                    min="1"
                    max="20"
                    value={newDashboard.layout.rows}
                    onChange={(e) => setNewDashboard({ 
                      ...newDashboard, 
                      layout: { ...newDashboard.layout, rows: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={newDashboard.isPublic}
                    onCheckedChange={(checked) => setNewDashboard({ ...newDashboard, isPublic: checked })}
                  />
                  <Label htmlFor="isPublic">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isDefault"
                    checked={newDashboard.isDefault}
                    onCheckedChange={(checked) => setNewDashboard({ ...newDashboard, isDefault: checked })}
                  />
                  <Label htmlFor="isDefault">Default</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDashboard}>Create Dashboard</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {dashboards?.map((dashboard) => (
          <Card key={dashboard.id}>
            <Card.Header>
              <div className="flex justify-between items-start">
                <div>
                  <Card.Title className="flex items-center gap-2">
                    {dashboard.name}
                    {dashboard.isDefault && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Default
                      </Badge>
                    )}
                    <Badge variant={dashboard.isPublic ? 'default' : 'secondary'}>
                      {dashboard.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </Card.Title>
                  <p className="text-sm text-muted-foreground mt-1">
                    {dashboard.description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefaultDashboard(dashboard.id)}
                    disabled={dashboard.isDefault}
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingDashboard(dashboard)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDashboard(dashboard.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium">Layout</div>
                    <div className="text-sm text-muted-foreground">
                      {dashboard.layout.columns} × {dashboard.layout.rows}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Widgets</div>
                    <div className="text-sm text-muted-foreground">
                      {dashboard.widgets?.length || 0} widgets
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Created</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(dashboard.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Updated</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(dashboard.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {dashboard.widgets && dashboard.widgets.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Widgets</div>
                    <div className="flex flex-wrap gap-2">
                      {dashboard.widgets.map((widget: any, index: number) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {getWidgetIcon(widget.type)}
                          {widget.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {editingDashboard && (
        <Dialog open={!!editingDashboard} onOpenChange={() => setEditingDashboard(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Dashboard</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Dashboard Name</Label>
                <Input
                  id="edit-name"
                  value={editingDashboard.name}
                  onChange={(e) => setEditingDashboard({ ...editingDashboard, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingDashboard.description}
                  onChange={(e) => setEditingDashboard({ ...editingDashboard, description: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isPublic"
                    checked={editingDashboard.isPublic}
                    onCheckedChange={(checked) => setEditingDashboard({ ...editingDashboard, isPublic: checked })}
                  />
                  <Label htmlFor="edit-isPublic">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-isDefault"
                    checked={editingDashboard.isDefault}
                    onCheckedChange={(checked) => setEditingDashboard({ ...editingDashboard, isDefault: checked })}
                  />
                  <Label htmlFor="edit-isDefault">Default</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingDashboard(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateDashboard(editingDashboard.id, editingDashboard)}>
                  Update Dashboard
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
