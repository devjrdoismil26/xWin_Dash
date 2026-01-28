import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from "@/components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  RefreshCw,
  Download,
  Calendar
} from 'lucide-react';
import { useWorkflowExecutionQueue } from '../hooks/useWorkflowsAdvanced';

export const WorkflowQueueAnalytics: React.FC = () => {
  const { stats, loading, error, refresh } = useWorkflowExecutionQueue();
  const [timeRange, setTimeRange] = useState('7d');
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        refresh();
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refresh]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  const getSuccessRate = () => {
    if (stats.total === 0) return 0;
    return ((stats.completed / stats.total) * 100);
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      case 'processing': return 'text-blue-600';
      case 'cancelled': return 'text-gray-600';
      case 'retrying': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Activity className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'retrying': return <RefreshCw className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Queue Analytics</h2>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Auto Refresh
          </Button>
          <Button variant="outline" onClick={refresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Total Executions</Card.Title>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatNumber(stats.total)}</div>
                <p className="text-xs text-muted-foreground">
                  All time executions
                </p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Success Rate</Card.Title>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatPercentage(getSuccessRate())}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.completed} of {stats.total} completed
                </p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Error Rate</Card.Title>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatPercentage(stats.errorRate)}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.failed} failed executions
                </p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Throughput</Card.Title>
                <Activity className="h-4 h-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{stats.throughput.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  executions per minute
                </p>
              </Card.Content>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <Card.Header>
                <Card.Title>Execution Status Distribution</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon('completed')}
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stats.completed}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatPercentage((stats.completed / stats.total) * 100)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon('failed')}
                      <span className="text-sm">Failed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stats.failed}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatPercentage((stats.failed / stats.total) * 100)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon('pending')}
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stats.pending}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatPercentage((stats.pending / stats.total) * 100)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon('processing')}
                      <span className="text-sm">Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stats.processing}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatPercentage((stats.processing / stats.total) * 100)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Queue Health</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Success Rate</span>
                      <span>{formatPercentage(getSuccessRate())}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${getSuccessRate()}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Error Rate</span>
                      <span>{formatPercentage(stats.errorRate)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${stats.errorRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Queue Utilization</span>
                      <span>{formatPercentage((stats.processing / Math.max(stats.total, 1)) * 100)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(stats.processing / Math.max(stats.total, 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <Card.Header>
                <Card.Title className="text-sm font-medium">Average Processing Time</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatDuration(stats.averageProcessingTime)}</div>
                <p className="text-xs text-muted-foreground">
                  Per execution
                </p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title className="text-sm font-medium">Average Wait Time</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatDuration(stats.averageWaitTime)}</div>
                <p className="text-xs text-muted-foreground">
                  In queue
                </p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title className="text-sm font-medium">Throughput</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{stats.throughput.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Executions/minute
                </p>
              </Card.Content>
            </Card>
          </div>

          <Card>
            <Card.Header>
              <Card.Title>Performance Metrics</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Processing Efficiency</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Processing Time</span>
                      <span className="text-sm font-medium">{formatDuration(stats.averageProcessingTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Wait Time</span>
                      <span className="text-sm font-medium">{formatDuration(stats.averageWaitTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Time</span>
                      <span className="text-sm font-medium">{formatDuration(stats.averageProcessingTime + stats.averageWaitTime)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Queue Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Current Queue</span>
                      <span className="text-sm font-medium">{stats.pending}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Processing</span>
                      <span className="text-sm font-medium">{stats.processing}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Retrying</span>
                      <span className="text-sm font-medium">{stats.retrying}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <Card.Header>
              <Card.Title>Execution Trends</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                <p>Trend charts will be implemented with a charting library</p>
                <p className="text-sm">Showing trends for the last {timeRange}</p>
              </div>
            </Card.Content>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  System Health
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Overall Health</span>
                    <Badge variant={getSuccessRate() > 95 ? 'default' : getSuccessRate() > 80 ? 'secondary' : 'destructive'}>
                      {getSuccessRate() > 95 ? 'Excellent' : getSuccessRate() > 80 ? 'Good' : 'Poor'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Success Rate</span>
                    <span className="text-sm font-medium">{formatPercentage(getSuccessRate())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Error Rate</span>
                    <span className="text-sm font-medium">{formatPercentage(stats.errorRate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Queue Size</span>
                    <span className="text-sm font-medium">{stats.pending}</span>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Recommendations
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-2">
                  {stats.errorRate > 10 && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      High error rate detected. Consider reviewing failed executions.
                    </div>
                  )}
                  {stats.pending > 100 && (
                    <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                      Large queue size. Consider scaling processing capacity.
                    </div>
                  )}
                  {stats.averageWaitTime > 300 && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      High wait times. Consider optimizing queue processing.
                    </div>
                  )}
                  {stats.errorRate < 5 && stats.pending < 50 && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      System is performing well. No immediate actions needed.
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
