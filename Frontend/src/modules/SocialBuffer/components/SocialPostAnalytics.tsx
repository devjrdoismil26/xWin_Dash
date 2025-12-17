import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/Select';
import { Badge } from '@/shared/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/Dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Heart, MessageSquare, Share2, Eye, MousePointer, TrendingUp, TrendingDown, Filter, Search, RefreshCw, Calendar, BarChart3, Target } from 'lucide-react';
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
    return num.toString();};

  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();};

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

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Target className="w-4 h-4 text-gray-600" />;};

  const handleViewDetails = (post: unknown) => {
    setSelectedPost(post);

    setIsDetailsModalOpen(true);};

  if (loading) return <div>Loading post analytics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h2 className="text-2xl font-bold">Post Analytics</h2>
        <div className=" ">$2</div><Button variant="outline" onClick={ () => setIsFiltersModalOpen(true)  }>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" onClick={ refresh } />
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button></div><Tabs defaultValue="posts" className="space-y-4" />
        <TabsList />
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger></TabsList><TabsContent value="posts" className="space-y-4" />
          <div className="{ posts?.map((post: unknown) => (">$2</div>
              <Card key={post.postId } />
                <Card.Header />
                  <div className=" ">$2</div><div>
           
        </div><Card.Title className="flex items-center gap-2" />
                        <Badge className={getPlatformColor(post.platform) } />
                          {post.platform}
                        </Badge>
                        <span className="{formatDate(post.publishedAt)}">$2</span>
                        </span>
                      </Card.Title>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2" />
                        {post.content}
                      </p></div><Button
                      variant="outline"
                      size="sm"
                      onClick={ () => handleViewDetails(post)  }>
                      <BarChart3 className="w-4 h-4" /></Button></div>
                </Card.Header>
                <Card.Content />
                  <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Heart className="w-4 h-4 text-red-500" />
                        <div>
           
        </div><div className="text-sm font-medium">{formatNumber(post.metrics.likes)}</div>
                          <div className="text-xs text-muted-foreground">Likes</div></div><div className=" ">$2</div><MessageSquare className="w-4 h-4 text-blue-500" />
                        <div>
           
        </div><div className="text-sm font-medium">{formatNumber(post.metrics.comments)}</div>
                          <div className="text-xs text-muted-foreground">Comments</div></div><div className=" ">$2</div><Share2 className="w-4 h-4 text-green-500" />
                        <div>
           
        </div><div className="text-sm font-medium">{formatNumber(post.metrics.shares)}</div>
                          <div className="text-xs text-muted-foreground">Shares</div></div><div className=" ">$2</div><Eye className="w-4 h-4 text-purple-500" />
                        <div>
           
        </div><div className="text-sm font-medium">{formatNumber(post.metrics.impressions)}</div>
                          <div className="text-xs text-muted-foreground">Impressions</div></div><div className=" ">$2</div><div>
           
        </div><div className="text-sm font-medium">Engagement</div>
                        <div className="text-lg font-bold">{formatNumber(post.metrics.engagement)}</div>
                      <div>
           
        </div><div className="text-sm font-medium">Engagement Rate</div>
                        <div className="text-lg font-bold">{formatPercentage(post.metrics.engagementRate)}</div>
                      <div>
           
        </div><div className="text-sm font-medium">Reach</div>
                        <div className="text-lg font-bold">{formatNumber(post.metrics.reach)}</div>
                    </div>

                    {post.hashtags && post.hashtags.length > 0 && (
                      <div>
           
        </div><div className="text-sm font-medium mb-2">Hashtags</div>
                        <div className="{(post.hashtags || []).map((hashtag: unknown, index: unknown) => (">$2</div>
                            <Badge key={index} variant="outline" className="text-xs" />
                              #{hashtag}
                            </Badge>
                          ))}
                        </div>
                    )}
                  </div>
                </Card.Content>
      </Card>
    </>
  ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className=" ">$2</div><Button
                variant="outline"
                onClick={ () => setPage(pagination.page - 1) }
                disabled={ pagination.page === 1  }>
                Previous
              </Button>
              <span className="Page {pagination.page} of {pagination.totalPages}">$2</span>
              </span>
              <Button
                variant="outline"
                onClick={ () => setPage(pagination.page + 1) }
                disabled={ pagination.page === pagination.totalPages  }>
                Next
              </Button>
      </div>
    </>
  )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4" />
          <div className="{ posts?.slice(0, 10).map((post: unknown) => (">$2</div>
              <Card key={post.postId } />
                <Card.Content className="pt-6" />
                  <div className=" ">$2</div><div className=" ">$2</div><Badge className={getPlatformColor(post.platform) } />
                        {post.platform}
                      </Badge>
                      <div>
           
        </div><div className="font-medium line-clamp-1">{post.content}</div>
                        <div className="text-sm text-muted-foreground">{formatDate(post.publishedAt)}</div></div><div className=" ">$2</div><div className=" ">$2</div><div className="text-sm font-medium">{formatNumber(post.metrics.engagement)}</div>
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
                <p className="text-sm">Showing performance trends over time</p></div></Card.Content></Card></TabsContent></Tabs><Dialog open={isDetailsModalOpen} onOpenChange={ setIsDetailsModalOpen } />
        <DialogContent className="max-w-2xl" />
          <DialogHeader />
            <DialogTitle>Post Analytics Details</DialogTitle>
          </DialogHeader>
          { selectedPost && (
            <div className=" ">$2</div><div className=" ">$2</div><Badge className={getPlatformColor(selectedPost.platform) } />
                  {selectedPost.platform}
                </Badge>
                <span className="{formatDate(selectedPost.publishedAt)}">$2</span>
                </span></div><div>
           
        </div><Label>Content</Label>
                <div className="{selectedPost.content}">$2</div>
                </div>
              
              <div className=" ">$2</div><div>
           
        </div><Label>Engagement Metrics</Label>
                  <div className=" ">$2</div><div className=" ">$2</div><span className="text-sm">Likes</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.likes)}</span></div><div className=" ">$2</div><span className="text-sm">Comments</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.comments)}</span></div><div className=" ">$2</div><span className="text-sm">Shares</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.shares)}</span></div><div className=" ">$2</div><span className="text-sm">Total Engagement</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.engagement)}</span></div></div>
                
                <div>
           
        </div><Label>Reach & Impressions</Label>
                  <div className=" ">$2</div><div className=" ">$2</div><span className="text-sm">Reach</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.reach)}</span></div><div className=" ">$2</div><span className="text-sm">Impressions</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.impressions)}</span></div><div className=" ">$2</div><span className="text-sm">Clicks</span>
                      <span className="text-sm font-medium">{formatNumber(selectedPost.metrics.clicks)}</span></div><div className=" ">$2</div><span className="text-sm">Engagement Rate</span>
                      <span className="text-sm font-medium">{formatPercentage(selectedPost.metrics.engagementRate)}</span></div></div>
    </div>
  )}
        </DialogContent></Dialog><Dialog open={isFiltersModalOpen} onOpenChange={ setIsFiltersModalOpen } />
        <DialogContent />
          <DialogHeader />
            <DialogTitle>Filter Posts</DialogTitle></DialogHeader><div className=" ">$2</div><div>
           
        </div><Label>Platform</Label>
              <Select
                value={ filters.platform?.[0] || '' }
                onValueChange={(value: unknown) => setFilters({ ...filters, platform: value ? [value as SocialPlatform] : undefined })}
  >
                <SelectTrigger />
                  <SelectValue placeholder="Select platform" / /></SelectTrigger><SelectContent />
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="pinterest">Pinterest</SelectItem></SelectContent></Select></div><div>
           
        </div><Label>Search</Label>
              <Input
                value={ filters.search || '' }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search posts..." /></div><div className=" ">$2</div><Button variant="outline" onClick={() => setFilters({})}>
                Clear Filters
              </Button>
              <Button onClick={ () => setIsFiltersModalOpen(false)  }>
                Apply Filters
              </Button></div></DialogContent></Dialog></div>);};
