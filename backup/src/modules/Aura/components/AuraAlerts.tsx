import React, { useState } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from "@/components/ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Bell, 
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Settings
} from 'lucide-react';
import { useAuraAlerts } from '../hooks/useAuraAdvanced';

export const AuraAlerts: React.FC = () => {
  const { alerts, loading, error, createAlert, updateAlert, deleteAlert, toggleAlert } = useAuraAlerts();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const [newAlert, setNewAlert] = useState({
    name: '',
    description: '',
    type: 'metric',
    condition: {
      metric: 'response_time',
      operator: 'greater_than',
      value: 5,
      timeWindow: 60,
      threshold: 3
    },
    severity: 'medium',
    isActive: true,
    recipients: []
  });

  const handleCreateAlert = async () => {
    try {
      await createAlert(newAlert);
      setNewAlert({
        name: '',
        description: '',
        type: 'metric',
        condition: {
          metric: 'response_time',
          operator: 'greater_than',
          value: 5,
          timeWindow: 60,
          threshold: 3
        },
        severity: 'medium',
        isActive: true,
        recipients: []
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const handleUpdateAlert = async (id: string, data: any) => {
    try {
      await updateAlert(id, data);
      setEditingAlert(null);
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await deleteAlert(id);
      } catch (error) {
        console.error('Error deleting alert:', error);
      }
    }
  };

  const handleToggleAlert = async (id: string) => {
    try {
      await toggleAlert(id);
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <Info className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <XCircle className="w-4 h-4" />;
      case 'critical': return <XCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'metric': return 'default';
      case 'threshold': return 'secondary';
      case 'anomaly': return 'outline';
      case 'trend': return 'destructive';
      default: return 'default';
    }
  };

  const getOperatorLabel = (operator: string) => {
    switch (operator) {
      case 'greater_than': return '>';
      case 'less_than': return '<';
      case 'equals': return '=';
      case 'not_equals': return '≠';
      case 'contains': return 'contains';
      case 'not_contains': return 'not contains';
      default: return operator;
    }
  };

  if (loading) return <div>Loading alerts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Alerts</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Analytics Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Alert Name</Label>
                <Input
                  id="name"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                  placeholder="Enter alert name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                  placeholder="Enter alert description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Alert Type</Label>
                  <Select value={newAlert.type} onValueChange={(value) => setNewAlert({ ...newAlert, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric</SelectItem>
                      <SelectItem value="threshold">Threshold</SelectItem>
                      <SelectItem value="anomaly">Anomaly</SelectItem>
                      <SelectItem value="trend">Trend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={newAlert.severity} onValueChange={(value) => setNewAlert({ ...newAlert, severity: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metric">Metric</Label>
                  <Select value={newAlert.condition.metric} onValueChange={(value) => setNewAlert({ ...newAlert, condition: { ...newAlert.condition, metric: value } })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="response_time">Response Time</SelectItem>
                      <SelectItem value="engagement_rate">Engagement Rate</SelectItem>
                      <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                      <SelectItem value="error_rate">Error Rate</SelectItem>
                      <SelectItem value="message_count">Message Count</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="operator">Operator</Label>
                  <Select value={newAlert.condition.operator} onValueChange={(value) => setNewAlert({ ...newAlert, condition: { ...newAlert.condition, operator: value } })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="greater_than">Greater Than</SelectItem>
                      <SelectItem value="less_than">Less Than</SelectItem>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="not_equals">Not Equals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newAlert.condition.value}
                    onChange={(e) => setNewAlert({ ...newAlert, condition: { ...newAlert.condition, value: parseFloat(e.target.value) } })}
                  />
                </div>
                <div>
                  <Label htmlFor="timeWindow">Time Window (minutes)</Label>
                  <Input
                    id="timeWindow"
                    type="number"
                    value={newAlert.condition.timeWindow}
                    onChange={(e) => setNewAlert({ ...newAlert, condition: { ...newAlert.condition, timeWindow: parseInt(e.target.value) } })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newAlert.isActive}
                  onCheckedChange={(checked) => setNewAlert({ ...newAlert, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAlert}>Create Alert</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {alerts?.map((alert) => (
          <Card key={alert.id}>
            <Card.Header>
              <div className="flex justify-between items-start">
                <div>
                  <Card.Title className="flex items-center gap-2">
                    {alert.name}
                    <Badge variant={getSeverityColor(alert.severity)} className="flex items-center gap-1">
                      {getSeverityIcon(alert.severity)}
                      {alert.severity}
                    </Badge>
                    <Badge variant={getTypeColor(alert.type)}>
                      {alert.type}
                    </Badge>
                    <Badge variant={alert.isActive ? 'default' : 'secondary'}>
                      {alert.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Card.Title>
                  <p className="text-sm text-muted-foreground mt-1">
                    {alert.description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAlert(alert.id)}
                  >
                    {alert.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingAlert(alert)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAlert(alert.id)}
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
                    <div className="text-sm font-medium">Condition</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.condition.metric} {getOperatorLabel(alert.condition.operator)} {alert.condition.value}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Time Window</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.condition.timeWindow} minutes
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Last Triggered</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.lastTriggered ? new Date(alert.lastTriggered).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Trigger Count</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.triggerCount} times
                    </div>
                  </div>
                </div>
                
                {alert.recipients && alert.recipients.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Recipients</div>
                    <div className="flex flex-wrap gap-2">
                      {alert.recipients.map((recipient: string, index: number) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {recipient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
                  <span>Updated: {new Date(alert.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {editingAlert && (
        <Dialog open={!!editingAlert} onOpenChange={() => setEditingAlert(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Alert Name</Label>
                <Input
                  id="edit-name"
                  value={editingAlert.name}
                  onChange={(e) => setEditingAlert({ ...editingAlert, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingAlert.description}
                  onChange={(e) => setEditingAlert({ ...editingAlert, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-severity">Severity</Label>
                  <Select value={editingAlert.severity} onValueChange={(value) => setEditingAlert({ ...editingAlert, severity: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-value">Value</Label>
                  <Input
                    id="edit-value"
                    type="number"
                    value={editingAlert.condition.value}
                    onChange={(e) => setEditingAlert({ 
                      ...editingAlert, 
                      condition: { ...editingAlert.condition, value: parseFloat(e.target.value) }
                    })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={editingAlert.isActive}
                  onCheckedChange={(checked) => setEditingAlert({ ...editingAlert, isActive: checked })}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingAlert(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateAlert(editingAlert.id, editingAlert)}>
                  Update Alert
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
