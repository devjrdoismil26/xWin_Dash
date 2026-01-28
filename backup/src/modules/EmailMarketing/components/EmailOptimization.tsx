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
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, TrendingUp, TrendingDown, Target, Zap, BarChart3, Settings } from 'lucide-react';
import { useEmailOptimization } from '../hooks/useEmailMarketingAdvanced';

export const EmailOptimization: React.FC = () => {
  const { optimization, loading, error, runOptimization, getOptimizationRecommendations } = useEmailOptimization();
  const [isRecommendationsModalOpen, setIsRecommendationsModalOpen] = useState(false);
  const [selectedOptimization, setSelectedOptimization] = useState<any>(null);

  const handleRunOptimization = async (type: string) => {
    try {
      await runOptimization(type);
    } catch (error) {
      console.error('Error running optimization:', error);
    }
  };

  const handleGetRecommendations = async () => {
    try {
      await getOptimizationRecommendations();
      setIsRecommendationsModalOpen(true);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }
  };

  if (loading) return <div>Loading optimization data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Optimization</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleGetRecommendations}>
            <Target className="w-4 h-4 mr-2" />
            Get Recommendations
          </Button>
          <Button onClick={() => handleRunOptimization('full')}>
            <Zap className="w-4 h-4 mr-2" />
            Run Full Optimization
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="tests">A/B Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Overall Score</Card.Title>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{optimization?.overview?.overallScore || 0}/100</div>
                <Progress value={optimization?.overview?.overallScore || 0} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {optimization?.overview?.overallScore >= 80 ? 'Excellent' : 
                   optimization?.overview?.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                </p>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Open Rate</Card.Title>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{optimization?.overview?.openRate || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  {optimization?.overview?.openRateChange ? 
                    (optimization.overview.openRateChange > 0 ? '+' : '') + optimization.overview.openRateChange + '%' : 
                    'No change'} from last month
                </p>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Click Rate</Card.Title>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{optimization?.overview?.clickRate || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  {optimization?.overview?.clickRateChange ? 
                    (optimization.overview.clickRateChange > 0 ? '+' : '') + optimization.overview.clickRateChange + '%' : 
                    'No change'} from last month
                </p>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Conversion Rate</Card.Title>
                <Target className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{optimization?.overview?.conversionRate || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  {optimization?.overview?.conversionRateChange ? 
                    (optimization.overview.conversionRateChange > 0 ? '+' : '') + optimization.overview.conversionRateChange + '%' : 
                    'No change'} from last month
                </p>
              </Card.Content>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <Card.Header>
                <Card.Title>Optimization Areas</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {optimization?.overview?.optimizationAreas?.map((area: any) => (
                    <div key={area.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {area.status === 'good' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span>{area.name}</span>
                      </div>
                      <Badge variant={area.status === 'good' ? 'default' : 'secondary'}>
                        {area.score}/100
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Quick Actions</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleRunOptimization('subject-lines')}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Optimize Subject Lines
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleRunOptimization('send-times')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Optimize Send Times
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleRunOptimization('content')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Optimize Content
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <Card.Header>
                <Card.Title>Performance Metrics</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Deliverability Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{optimization?.performance?.deliverabilityRate || 0}%</span>
                      {optimization?.performance?.deliverabilityTrend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bounce Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{optimization?.performance?.bounceRate || 0}%</span>
                      {optimization?.performance?.bounceTrend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Unsubscribe Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{optimization?.performance?.unsubscribeRate || 0}%</span>
                      {optimization?.performance?.unsubscribeTrend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Engagement Metrics</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Open Time</span>
                    <span className="font-medium">{optimization?.performance?.avgOpenTime || '0s'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Click Time</span>
                    <span className="font-medium">{optimization?.performance?.avgClickTime || '0s'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Email Shares</span>
                    <span className="font-medium">{optimization?.performance?.shares || 0}</span>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            {optimization?.recommendations?.map((recommendation: any) => (
              <Card key={recommendation.id}>
                <Card.Header>
                  <div className="flex justify-between items-start">
                    <div>
                      <Card.Title className="flex items-center gap-2">
                        {recommendation.title}
                        <Badge variant={recommendation.priority === 'high' ? 'destructive' : 
                                      recommendation.priority === 'medium' ? 'default' : 'secondary'}>
                          {recommendation.priority}
                        </Badge>
                      </Card.Title>
                      <p className="text-sm text-muted-foreground mt-1">
                        {recommendation.description}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Expected Impact</h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <span>Open Rate: +{recommendation.expectedImpact?.openRate || 0}%</span>
                        <span>Click Rate: +{recommendation.expectedImpact?.clickRate || 0}%</span>
                        <span>Conversion: +{recommendation.expectedImpact?.conversion || 0}%</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Implementation Steps</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        {recommendation.steps?.map((step: string, index: number) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <div className="grid gap-4">
            {optimization?.abTests?.map((test: any) => (
              <Card key={test.id}>
                <Card.Header>
                  <div className="flex justify-between items-start">
                    <div>
                      <Card.Title className="flex items-center gap-2">
                        {test.name}
                        <Badge variant={test.status === 'running' ? 'default' : 
                                      test.status === 'completed' ? 'secondary' : 'outline'}>
                          {test.status}
                        </Badge>
                      </Card.Title>
                      <p className="text-sm text-muted-foreground mt-1">
                        {test.description}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Control</h4>
                        <div className="space-y-1 text-sm">
                          <div>Open Rate: {test.control?.openRate || 0}%</div>
                          <div>Click Rate: {test.control?.clickRate || 0}%</div>
                          <div>Conversions: {test.control?.conversions || 0}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Variant</h4>
                        <div className="space-y-1 text-sm">
                          <div>Open Rate: {test.variant?.openRate || 0}%</div>
                          <div>Click Rate: {test.variant?.clickRate || 0}%</div>
                          <div>Conversions: {test.variant?.conversions || 0}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Confidence Level: {test.confidenceLevel || 0}%</span>
                      <span>Winner: {test.winner || 'TBD'}</span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
