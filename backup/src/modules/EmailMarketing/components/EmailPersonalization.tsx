import React, { useState } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from "@/components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Play, Pause, Eye, Settings } from 'lucide-react';
import { useEmailPersonalization } from '../hooks/useEmailMarketingAdvanced';

export const EmailPersonalization: React.FC = () => {
  const { personalization, loading, error, createPersonalization, updatePersonalization, deletePersonalization } = useEmailPersonalization();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    conditions: [],
    actions: [],
    isActive: true
  });

  const handleCreateRule = async () => {
    try {
      await createPersonalization(newRule);
      setNewRule({ name: '', description: '', conditions: [], actions: [], isActive: true });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating personalization rule:', error);
    }
  };

  const handleUpdateRule = async (id: string, data: any) => {
    try {
      await updatePersonalization(id, data);
      setEditingRule(null);
    } catch (error) {
      console.error('Error updating personalization rule:', error);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this personalization rule?')) {
      try {
        await deletePersonalization(id);
      } catch (error) {
        console.error('Error deleting personalization rule:', error);
      }
    }
  };

  if (loading) return <div>Loading personalization rules...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Personalization</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Personalization Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Enter rule name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Enter rule description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRule}>Create Rule</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Personalization Rules</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4">
            {personalization?.rules?.map((rule: any) => (
              <Card key={rule.id}>
                <Card.Header>
                  <div className="flex justify-between items-start">
                    <div>
                      <Card.Title className="flex items-center gap-2">
                        {rule.name}
                        <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </Card.Title>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rule.description}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingRule(rule)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Conditions</h4>
                      <div className="space-y-2">
                        {rule.conditions?.map((condition: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Badge variant="outline">{condition.field}</Badge>
                            <span>{condition.operator}</span>
                            <Badge variant="secondary">{condition.value}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Actions</h4>
                      <div className="space-y-2">
                        {rule.actions?.map((action: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Badge variant="outline">{action.type}</Badge>
                            <span>{action.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Created: {new Date(rule.createdAt).toLocaleDateString()}</span>
                      <span>Last used: {rule.lastUsed ? new Date(rule.lastUsed).toLocaleDateString() : 'Never'}</span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <Card.Header>
                <Card.Title className="text-sm font-medium">Total Rules</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{personalization?.performance?.totalRules || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active: {personalization?.performance?.activeRules || 0}
                </p>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title className="text-sm font-medium">Emails Sent</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{personalization?.performance?.emailsSent || 0}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title className="text-sm font-medium">Open Rate</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">
                  {personalization?.performance?.openRate ? `${personalization.performance.openRate}%` : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Personalized emails
                </p>
              </Card.Content>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <Card.Header>
              <Card.Title>Personalization Analytics</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Most Used Rules</h4>
                  <div className="space-y-2">
                    {personalization?.analytics?.mostUsedRules?.map((rule: any) => (
                      <div key={rule.id} className="flex justify-between items-center">
                        <span>{rule.name}</span>
                        <Badge variant="outline">{rule.usageCount} uses</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Performance by Rule</h4>
                  <div className="space-y-2">
                    {personalization?.analytics?.rulePerformance?.map((rule: any) => (
                      <div key={rule.id} className="flex justify-between items-center">
                        <span>{rule.name}</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">{rule.openRate}% open</Badge>
                          <Badge variant="outline">{rule.clickRate}% click</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
