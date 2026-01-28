import React from 'react';
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge"
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import { useSocialAnalytics } from '../hooks/useSocialBufferAdvanced';

export const SocialAnalyticsOverview: React.FC = () => {
  const { overview, engagementAnalytics, reachAnalytics, impressionsAnalytics, loading, error } = useSocialAnalytics();

  if (loading) return <div>Loading analytics overview...</div>;
  if (error) return <div>Error: {error}</div>;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const getTrendIcon = (change?: number) => {
    if (!change) return <Activity className="w-4 h-4 text-gray-600" />;
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getTrendColor = (change?: number) => {
    if (!change) return 'text-gray-600';
    if (change > 0) return 'text-green-600';
    return 'text-red-600';
  };

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
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="reach">Reach</TabsTrigger>
          <TabsTrigger value="impressions">Impressions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Total Accounts</Card.Title>
                <Users className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatNumber(overview?.totalAccounts || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Connected accounts
                </p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Total Posts</Card.Title>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatNumber(overview?.totalPosts || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Published posts
                </p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Total Followers</Card.Title>
                <Users className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatNumber(overview?.totalFollowers || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Across all accounts
                </p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Engagement Rate</Card.Title>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatPercentage(overview?.engagementRate || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Average engagement
                </p>
              </Card.Content>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <Card.Header>
                <Card.Title className="text-sm font-medium">Total Engagement</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatNumber(overview?.totalEngagement || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Likes, comments, shares
                </p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title className="text-sm font-medium">Total Reach</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatNumber(overview?.reach || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Unique users reached
                </p>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title className="text-sm font-medium">Total Impressions</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">{formatNumber(overview?.impressions || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Total views
                </p>
              </Card.Content>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          {engagementAnalytics && (
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <Card.Header>
                    <Card.Title className="text-sm font-medium">Total Engagement</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="text-2xl font-bold">{formatNumber(engagementAnalytics.totalEngagement)}</div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title className="text-sm font-medium">Engagement Rate</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="text-2xl font-bold">{formatPercentage(engagementAnalytics.engagementRate)}</div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title className="text-sm font-medium">Average Rate</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="text-2xl font-bold">{formatPercentage(engagementAnalytics.averageEngagementRate)}</div>
                  </Card.Content>
                </Card>
              </div>

              <Card>
                <Card.Header>
                  <Card.Title>Engagement by Platform</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    {engagementAnalytics.engagementByPlatform?.map((platform) => (
                      <div key={platform.platform} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{platform.platform}</Badge>
                          <span className="text-sm">{platform.posts} posts</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">{formatNumber(platform.engagement)}</span>
                          <span className="text-sm text-muted-foreground">{formatPercentage(platform.engagementRate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reach" className="space-y-4">
          {reachAnalytics && (
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <Card.Header>
                    <Card.Title className="text-sm font-medium">Total Reach</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="text-2xl font-bold">{formatNumber(reachAnalytics.totalReach)}</div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title className="text-sm font-medium">Average Reach</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="text-2xl font-bold">{formatNumber(reachAnalytics.averageReach)}</div>
                  </Card.Content>
                </Card>
              </div>

              <Card>
                <Card.Header>
                  <Card.Title>Reach by Platform</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    {reachAnalytics.reachByPlatform?.map((platform) => (
                      <div key={platform.platform} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{platform.platform}</Badge>
                          <span className="text-sm">{platform.posts} posts</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">{formatNumber(platform.reach)}</span>
                          <span className="text-sm text-muted-foreground">avg: {formatNumber(platform.averageReach)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="impressions" className="space-y-4">
          {impressionsAnalytics && (
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <Card.Header>
                    <Card.Title className="text-sm font-medium">Total Impressions</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="text-2xl font-bold">{formatNumber(impressionsAnalytics.totalImpressions)}</div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title className="text-sm font-medium">Average Impressions</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="text-2xl font-bold">{formatNumber(impressionsAnalytics.averageImpressions)}</div>
                  </Card.Content>
                </Card>
              </div>

              <Card>
                <Card.Header>
                  <Card.Title>Impressions by Platform</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    {impressionsAnalytics.impressionsByPlatform?.map((platform) => (
                      <div key={platform.platform} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{platform.platform}</Badge>
                          <span className="text-sm">{platform.posts} posts</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">{formatNumber(platform.impressions)}</span>
                          <span className="text-sm text-muted-foreground">avg: {formatNumber(platform.averageImpressions)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
