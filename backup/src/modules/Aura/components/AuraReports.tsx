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
  Download, 
  Calendar,
  Clock,
  FileText,
  Settings,
  Play,
  Pause
} from 'lucide-react';
import { useAuraReports } from '../hooks/useAuraAdvanced';

export const AuraReports: React.FC = () => {
  const { reports, loading, error, createReport, updateReport, deleteReport, generateReport } = useAuraReports();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [newReport, setNewReport] = useState({
    name: '',
    description: '',
    type: 'overview',
    parameters: {},
    schedule: {
      frequency: 'weekly',
      dayOfWeek: 1,
      time: '09:00',
      recipients: []
    },
    isActive: true
  });

  const handleCreateReport = async () => {
    try {
      await createReport(newReport);
      setNewReport({
        name: '',
        description: '',
        type: 'overview',
        parameters: {},
        schedule: {
          frequency: 'weekly',
          dayOfWeek: 1,
          time: '09:00',
          recipients: []
        },
        isActive: true
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  const handleUpdateReport = async (id: string, data: any) => {
    try {
      await updateReport(id, data);
      setEditingReport(null);
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(id);
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  const handleGenerateReport = async (id: string) => {
    try {
      await generateReport(id);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'overview': return 'default';
      case 'connection': return 'secondary';
      case 'flow': return 'outline';
      case 'performance': return 'destructive';
      case 'engagement': return 'default';
      case 'conversion': return 'secondary';
      case 'roi': return 'outline';
      default: return 'default';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      default: return frequency;
    }
  };

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Reports</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Analytics Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Report Name</Label>
                <Input
                  id="name"
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  placeholder="Enter report name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  placeholder="Enter report description"
                />
              </div>
              <div>
                <Label htmlFor="type">Report Type</Label>
                <Select value={newReport.type} onValueChange={(value) => setNewReport({ ...newReport, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="connection">Connection</SelectItem>
                    <SelectItem value="flow">Flow</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                    <SelectItem value="roi">ROI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={newReport.schedule.frequency} onValueChange={(value) => setNewReport({ ...newReport, schedule: { ...newReport.schedule, frequency: value } })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newReport.schedule.time}
                    onChange={(e) => setNewReport({ ...newReport, schedule: { ...newReport.schedule, time: e.target.value } })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newReport.isActive}
                  onCheckedChange={(checked) => setNewReport({ ...newReport, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateReport}>Create Report</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {reports?.map((report) => (
          <Card key={report.id}>
            <Card.Header>
              <div className="flex justify-between items-start">
                <div>
                  <Card.Title className="flex items-center gap-2">
                    {report.name}
                    <Badge variant={getReportTypeColor(report.type)}>
                      {report.type}
                    </Badge>
                    <Badge variant={report.isActive ? 'default' : 'secondary'}>
                      {report.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Card.Title>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.description}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateReport(report.id)}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingReport(report)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteReport(report.id)}
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
                    <div className="text-sm font-medium">Schedule</div>
                    <div className="text-sm text-muted-foreground">
                      {getFrequencyLabel(report.schedule?.frequency || 'manual')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Last Generated</div>
                    <div className="text-sm text-muted-foreground">
                      {report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Next Generation</div>
                    <div className="text-sm text-muted-foreground">
                      {report.nextGeneration ? new Date(report.nextGeneration).toLocaleDateString() : 'Not scheduled'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Created</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {report.schedule && (
                  <div>
                    <div className="text-sm font-medium mb-2">Schedule Details</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {getFrequencyLabel(report.schedule.frequency)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {report.schedule.time}
                      </div>
                      {report.schedule.recipients && report.schedule.recipients.length > 0 && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {report.schedule.recipients.length} recipients
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {editingReport && (
        <Dialog open={!!editingReport} onOpenChange={() => setEditingReport(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Report Name</Label>
                <Input
                  id="edit-name"
                  value={editingReport.name}
                  onChange={(e) => setEditingReport({ ...editingReport, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingReport.description}
                  onChange={(e) => setEditingReport({ ...editingReport, description: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={editingReport.isActive}
                  onCheckedChange={(checked) => setEditingReport({ ...editingReport, isActive: checked })}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingReport(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateReport(editingReport.id, editingReport)}>
                  Update Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
