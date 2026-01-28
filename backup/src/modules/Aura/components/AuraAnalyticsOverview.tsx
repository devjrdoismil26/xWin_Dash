import React from 'react';
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge"
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Target,
  DollarSign,
  Activity
} from 'lucide-react';
import { useAuraAnalytics } from '../hooks/useAuraAdvanced';

export const AuraAnalyticsOverview: React.FC = () => {
  const { overview, performance, engagement, conversion, roi, loading, error } = useAuraAnalytics();

  if (loading) return <div>Loading analytics overview...</div>;
  if (error) return <div>Error: {error}</div>;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const formatCurrency = (num: number) => `$${num.toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <Badge variant="outline" className="text-sm">
          {overview?.period ? `${new Date(overview.period.start).toLocaleDateString()} - ${new Date(overview.period.end).toLocaleDateString()}` : 'Current Period'}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="roi">ROI</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Total Connections</Card.Title>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatNumber(overview?.totalConnections || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Active: {formatNumber(overview?.activeConnections || 0)}
                </p>
                <Progress 
                  value={overview ? (overview.activeConnections / overview.totalConnections) * 100 : 0} 
                  className="mt-2"
                />
              </Card.Content>
            </Card>

            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Total Flows</Card.Title>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatNumber(overview?.totalFlows || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Active: {formatNumber(overview?.activeFlows || 0)}
                </p>
                <Progress 
                  value={overview ? (overview.activeFlows / overview.totalFlows) * 100 : 0} 
                  className="mt-2"
                />
              </Card.Content>
            </Card>

            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Total Chats</Card.Title>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatNumber(overview?.totalChats || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Active: {formatNumber(overview?.activeChats || 0)}
                </p>
                <Progress 
                  value={overview ? (overview.activeChats / overview.totalChats) * 100 : 0} 
                  className="mt-2"
                />
              </Card.Content>
            </Card>

            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Total Messages</Card.Title>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatNumber(overview?.totalMessages || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  This period
                </p>
              </Card.Content>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <Card.Header>
                <Card.Title className="text-sm font-medium">Response Time</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{overview?.responseTimeAvg ? `${overview.responseTimeAvg.toFixed(1)}s` : '0s'}</div>
                <p className="text-xs text-muted-foreground">
                  Average response time
                </p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title className="text-sm font-medium">Engagement Rate</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatPercentage(overview?.engagementRate || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  User engagement
                </p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title className="text-sm font-medium">Satisfaction Score</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{overview?.satisfactionScore ? `${overview.satisfactionScore.toFixed(1)}/5` : '0/5'}</div>
                <p className="text-xs text-muted-foreground">
                  Customer satisfaction
                </p>
              </Card.Content>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {performance && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">Messages/Hour</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{formatNumber(performance.messagesPerHour)}</div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">Response Time</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{performance.responseTime.toFixed(1)}s</div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">Conversion Rate</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{formatPercentage(performance.conversionRate)}</div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">ROI</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{formatPercentage(performance.roi)}</div>
                </Card.Content>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          {engagement && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">Total Users</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{formatNumber(engagement.totalUsers)}</div>
                  <p className="text-xs text-muted-foreground">
                    Active: {formatNumber(engagement.activeUsers)}
                  </p>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">New Users</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{formatNumber(engagement.newUsers)}</div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">Session Duration</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{engagement.sessionDuration.toFixed(1)}m</div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">Messages/Session</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{engagement.messagesPerSession.toFixed(1)}</div>
                </Card.Content>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          {conversion && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">Total Conversions</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{formatNumber(conversion.totalConversions)}</div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">Conversion Rate</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{formatPercentage(conversion.conversionRate)}</div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">Conversion Value</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{formatCurrency(conversion.conversionValue)}</div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">Avg Conversion Time</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{conversion.avgConversionTime.toFixed(1)}h</div>
                </Card.Content>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          {roi && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">Total Revenue</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{formatCurrency(roi.totalRevenue)}</div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">Total Cost</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{formatCurrency(roi.totalCost)}</div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">ROI</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{formatPercentage(roi.roi)}</div>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title className="text-sm font-medium">Lifetime Value</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="text-2xl font-bold">{formatCurrency(roi.lifetimeValue)}</div>
                </Card.Content>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
