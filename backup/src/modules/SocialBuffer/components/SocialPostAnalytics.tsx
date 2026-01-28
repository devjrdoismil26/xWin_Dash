import React, { useState } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from "@/components/ui/Badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Eye, 
  MousePointer,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  RefreshCw,
  Calendar,
  BarChart3,
  Target
} from 'lucide-react';
import { useSocialPostAnalytics } from '../hooks/useSocialBufferAdvanced';
import { SocialPlatform } from '../types/socialTypes';

export const SocialPostAnalytics: React.FC = () => {
  const { 
    posts, 
    loading, 
    error, 
    filters, 
    sort, 
    pagination, 
    setFilters, 
    setSort, 
    setPage, 
    refresh 
  } = useSocialPostAnalytics();
  
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

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
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Target className="w-4 h-4 text-gray-600" />;
  };

  const handleViewDetails = (post: any) => {
    setSelectedPost(post);
    setIsDetailsModalOpen(true);
  };

  if (loading) return <div>Loading post analytics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Post Analytics</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsFiltersModalOpen(true)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" onClick={refresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <div className="grid gap-4">
            {posts?.map((post) => (
              <Card key={post.postId}>
                <Card.Header>
                  <div className="flex justify-between items-start">
                    <div>
                      <Card.Title className="flex items-center gap-2">
                        <Badge className={getPlatformColor(post.platform)}>
                          {post.platform}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(post.publishedAt)}
                        </span>
                      </Card.Title>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(post)}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <div>
                          <div className="text-sm font-medium">{formatNumber(post.metrics.likes)}</div>
                          <div className="text-xs text-muted-foreground">Likes</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium">{formatNumber(post.metrics.comments)}</div>
                          <div className="text-xs text-muted-foreground">Comments</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-green-500" />
                        <div>
                          <div className="text-sm font-medium">{formatNumber(post.metrics.shares)}</div>
                          <div className="text-xs text-muted-foreground">Shares</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-purple-500" />
                        <div>
                          <div className="text-sm font-medium">{formatNumber(post.metrics.impressions)}</div>
                          <div className="text-xs text-muted-foreground">Impressions</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-medium">Engagement</div>
                        <div className="text-lg font-bold">{formatNumber(post.metrics.engagement)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Engagement Rate</div>
                        <div className="text-lg font-bold">{formatPercentage(post.metrics.engagementRate)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Reach</div>
                        <div className="text-lg font-bold">{formatNumber(post.metrics.reach)}</div>
                      </div>
                    </div>

                    {post.hashtags && post.hashtags.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Hashtags</div>
                        <div className="flex flex-wrap gap-1">
                          {post.hashtags.map((hashtag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{hashtag}
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

          {pagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setPage(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4">
            {posts?.slice(0, 10).map((post) => (
              <Card key={post.postId}>
                <Card.Content className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getPlatformColor(post.platform)}>
                        {post.platform}
                      </Badge>
                      <div>
                        <div className="font-medium line-clamp-1">{post.content}</div>
                        <div className="text-sm text-muted-foreground">{formatDate(post.publishedAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">{formatNumber(post.metrics.engagement)}</div>
                        <div className="text-xs text-muted-foreground">Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{formatPercentage(post.metrics.engagementRate)}</div>
                        <div className="text-xs text-muted-foreground">Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{formatNumber(post.metrics.reach)}</div>
                        <div className="text-xs text-muted-foreground">Reach</div>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <Card.Header>
              <Card.Title>Performance Trends</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                <p>Trend charts will be implemented with a charting library</p>
                <p className="text-sm">Showing performance trends over time</p>
              </div>
            </Card.Content>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post Analytics Details</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getPlatformColor(selectedPost.platform)}>
                  {selectedPost.platform}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDate(selectedPost.publishedAt)}
                </span>
              </div>
              
              <div>
                <Label>Content</Label>
                <div className="text-sm bg-gray-50 p-3 rounded mt-1">
                  {selectedPost.content}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Engagement Metrics</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Likes</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.likes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Comments</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.comments)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Shares</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.shares)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Engagement</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.engagement)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Reach & Impressions</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Reach</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.reach)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Impressions</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.impressions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Clicks</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.clicks)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Engagement Rate</span>
                      <span className="text-sm font-medium">{formatPercentage(selectedPost.metrics.engagementRate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isFiltersModalOpen} onOpenChange={setIsFiltersModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Posts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Platform</Label>
              <Select
                value={filters.platform?.[0] || ''}
                onValueChange={(value) => setFilters({ ...filters, platform: value ? [value as SocialPlatform] : undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="pinterest">Pinterest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Search</Label>
              <Input
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search posts..."
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setFilters({})}>
                Clear Filters
              </Button>
              <Button onClick={() => setIsFiltersModalOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
