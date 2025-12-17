import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/Select';
import { Badge } from '@/shared/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Users, MessageSquare, Heart, Eye, TrendingUp, TrendingDown, Target, BarChart3, Activity, Calendar } from 'lucide-react';
import { useSocialAccountAnalytics } from '../hooks/useSocialBufferAdvanced';
import { SocialPlatform } from '../types/socialTypes';

export const SocialAccountAnalytics: React.FC = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  const { analytics, loading, error, refresh } = useSocialAccountAnalytics(selectedAccountId);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();};

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const getPlatformColor = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook': return 'bg-blue-100 text-blue-800';
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'twitter': return 'bg-blue-100 text-blue-800';
      case 'linkedin': return 'bg-blue-100 text-blue-800';
      case 'youtube': return 'bg-red-100 text-red-800';
      case 'tiktok': return 'bg-black text-white';
      case 'pinterest': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    } ;

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Target className="w-4 h-4 text-gray-600" />;};

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';};

  if (loading) return <div>Loading account analytics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h2 className="text-2xl font-bold">Account Analytics</h2>
        <div className=" ">$2</div><Select value={selectedAccountId} onValueChange={ setSelectedAccountId } />
            <SelectTrigger className="w-48" />
              <SelectValue placeholder="Select account" / /></SelectTrigger><SelectContent />
              <SelectItem value="1">Facebook Account</SelectItem>
              <SelectItem value="2">Instagram Account</SelectItem>
              <SelectItem value="3">Twitter Account</SelectItem>
              <SelectItem value="4">LinkedIn Account</SelectItem></SelectContent></Select>
          <Button variant="outline" onClick={ refresh } />
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

      {analytics && (
        <Tabs defaultValue="overview" className="space-y-4" />
          <TabsList />
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="posts">Top Posts</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger></TabsList><TabsContent value="overview" className="space-y-4" />
            <div className=" ">$2</div><Card />
                <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2" />
                  <Card.Title className="text-sm font-medium">Followers</Card.Title>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </Card.Header>
                <Card.Content />
                  <div className="text-2xl font-bold">{formatNumber(analytics.metrics.followers)}</div>
                  <div className="{getTrendIcon(analytics.performance.followersGrowth)}">$2</div>
                    <span className={getTrendColor(analytics.performance.followersGrowth)  }>
        </span>{analytics.performance.followersGrowth > 0 ? '+' : ''}{analytics.performance.followersGrowth.toFixed(1)}%
                    </span></div></Card.Content></Card><Card />
                <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2" />
                  <Card.Title className="text-sm font-medium">Posts</Card.Title>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </Card.Header>
                <Card.Content />
                  <div className="text-2xl font-bold">{formatNumber(analytics.metrics.posts)}</div>
                  <p className="text-xs text-muted-foreground" />
                    Total published
                  </p>
                </Card.Content></Card><Card />
                <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2" />
                  <Card.Title className="text-sm font-medium">Engagement</Card.Title>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </Card.Header>
                <Card.Content />
                  <div className="text-2xl font-bold">{formatNumber(analytics.metrics.engagement)}</div>
                  <div className="{getTrendIcon(analytics.performance.engagementGrowth)}">$2</div>
                    <span className={getTrendColor(analytics.performance.engagementGrowth)  }>
        </span>{analytics.performance.engagementGrowth > 0 ? '+' : ''}{analytics.performance.engagementGrowth.toFixed(1)}%
                    </span></div></Card.Content></Card><Card />
                <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2" />
                  <Card.Title className="text-sm font-medium">Engagement Rate</Card.Title>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </Card.Header>
                <Card.Content />
                  <div className="text-2xl font-bold">{formatPercentage(analytics.metrics.engagementRate)}</div>
                  <p className="text-xs text-muted-foreground" />
                    Average rate
                  </p>
                </Card.Content></Card></div>

            <div className=" ">$2</div><Card />
                <Card.Header />
                  <Card.Title className="text-sm font-medium">Reach</Card.Title>
                </Card.Header>
                <Card.Content />
                  <div className="text-2xl font-bold">{formatNumber(analytics.metrics.reach)}</div>
                  <div className="{getTrendIcon(analytics.performance.reachGrowth)}">$2</div>
                    <span className={getTrendColor(analytics.performance.reachGrowth)  }>
        </span>{analytics.performance.reachGrowth > 0 ? '+' : ''}{analytics.performance.reachGrowth.toFixed(1)}%
                    </span></div></Card.Content></Card><Card />
                <Card.Header />
                  <Card.Title className="text-sm font-medium">Impressions</Card.Title>
                </Card.Header>
                <Card.Content />
                  <div className="text-2xl font-bold">{formatNumber(analytics.metrics.impressions)}</div>
                  <div className="{getTrendIcon(analytics.performance.impressionsGrowth)}">$2</div>
                    <span className={getTrendColor(analytics.performance.impressionsGrowth)  }>
        </span>{analytics.performance.impressionsGrowth > 0 ? '+' : ''}{analytics.performance.impressionsGrowth.toFixed(1)}%
                    </span></div></Card.Content></Card><Card />
                <Card.Header />
                  <Card.Title className="text-sm font-medium">Clicks</Card.Title>
                </Card.Header>
                <Card.Content />
                  <div className="text-2xl font-bold">{formatNumber(analytics.metrics.clicks)}</div>
                  <p className="text-xs text-muted-foreground" />
                    Total clicks
                  </p>
                </Card.Content></Card></div></TabsContent><TabsContent value="performance" className="space-y-4" />
            <div className=" ">$2</div><Card />
                <Card.Header />
                  <Card.Title>Performance Score</Card.Title>
                </Card.Header>
                <Card.Content />
                  <div className=" ">$2</div><div className="text-4xl font-bold mb-2">{analytics.performance.performanceScore.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Out of 100</div>
                </Card.Content></Card><div className=" ">$2</div><Card />
                  <Card.Header />
                    <Card.Title className="text-sm font-medium">Best Performing Post</Card.Title>
                  </Card.Header>
                  <Card.Content />
                    {analytics.performance.bestPerformingPost ? (
                      <div className=" ">$2</div><div className="text-sm line-clamp-2">{analytics.performance.bestPerformingPost.content}</div>
                        <div className=" ">$2</div><Badge className={getPlatformColor(analytics.performance.bestPerformingPost.platform) } />
                            {analytics.performance.bestPerformingPost.platform}
                          </Badge>
                          <span className="{formatNumber(analytics.performance.bestPerformingPost.metrics.engagement)} engagement">$2</span>
                          </span>
      </div>
    </>
  ) : (
                      <div className="text-sm text-muted-foreground">No posts yet</div>
                    )}
                  </Card.Content></Card><Card />
                  <Card.Header />
                    <Card.Title className="text-sm font-medium">Average Performance</Card.Title>
                  </Card.Header>
                  <Card.Content />
                    <div className="text-2xl font-bold">{analytics.performance.averagePerformance.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground" />
                      Average engagement per post
                    </p>
                  </Card.Content></Card></div></TabsContent><TabsContent value="posts" className="space-y-4" />
            <div className="{ analytics.topPosts?.map((post: unknown) => (">$2</div>
                <Card key={post.postId } />
                  <Card.Content className="pt-6" />
                    <div className=" ">$2</div><div className=" ">$2</div><Badge className={getPlatformColor(post.platform) } />
                          {post.platform}
                        </Badge>
                        <div>
           
        </div><div className="font-medium line-clamp-1">{post.content}</div>
                          <div className="{new Date(post.publishedAt).toLocaleDateString()}">$2</div>
                          </div></div><div className=" ">$2</div><div className=" ">$2</div><div className="text-sm font-medium">{formatNumber(post.metrics.engagement)}</div>
                          <div className="text-xs text-muted-foreground">Engagement</div>
                        <div className=" ">$2</div><div className="text-sm font-medium">{formatPercentage(post.metrics.engagementRate)}</div>
                          <div className="text-xs text-muted-foreground">Rate</div>
                        <div className=" ">$2</div><div className="text-sm font-medium">{formatNumber(post.metrics.reach)}</div>
                          <div className="text-xs text-muted-foreground">Reach</div></div></Card.Content>
      </Card>
    </>
  ))}
            </div></TabsContent><TabsContent value="trends" className="space-y-4" />
            <Card />
              <Card.Header />
                <Card.Title>Performance Trends</Card.Title>
              </Card.Header>
              <Card.Content />
                <div className=" ">$2</div><BarChart3 className="w-12 h-12 mx-auto mb-4" />
                  <p>Trend charts will be implemented with a charting library</p>
                  <p className="text-sm">Showing performance trends for {analytics.accountName}</p></div></Card.Content></Card></TabsContent>
      </Tabs>
    </>
  )}

      {!analytics && selectedAccountId && (
        <Card />
          <Card.Content className="pt-6" />
            <div className=" ">$2</div><Users className="w-12 h-12 mx-auto mb-4" />
              <p>Select an account to view analytics</p></div></Card.Content>
      </Card>
    </>
  )}
    </div>);};
