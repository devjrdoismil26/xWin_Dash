// =========================================
// SOCIAL ENGAGEMENT MANAGER COMPONENT
// =========================================

import React, { useState, useCallback, useMemo } from 'react';
import { Card, Button, LoadingSpinner } from '@/components/ui';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { useSocialBufferStore } from '../../hooks';
import { useSocialBufferUI } from '../../hooks/useSocialBufferUI';
import { 
  SocialBufferLoadingSkeleton, 
  SocialBufferErrorState, 
  SocialBufferEmptyState,
  SocialBufferSuccessState 
} from '../ui';

interface EngagementData {
  id: string;
  postId: string;
  platform: string;
  type: 'like' | 'comment' | 'share' | 'retweet' | 'reaction';
  userId: string;
  userName: string;
  userAvatar?: string;
  content?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface EngagementSummary {
  id: string;
  postId: string;
  platform: string;
  totalEngagements: number;
  likes: number;
  comments: number;
  shares: number;
  retweets: number;
  reactions: number;
  engagementRate: number;
  topEngagers: Array<{
    userId: string;
    userName: string;
    engagementCount: number;
  }>;
  lastUpdated: Date;
}

interface SocialEngagementManagerProps {
  className?: string;
  onEngagementTracked?: (engagement: EngagementData) => void;
  onSummaryUpdated?: (summary: EngagementSummary) => void;
}

const SocialEngagementManager: React.FC<SocialEngagementManagerProps> = ({
  className = '',
  onEngagementTracked,
  onSummaryUpdated
}) => {
  const { 
    engagementData, 
    engagementSummaries, 
    loading, 
    error, 
    trackEngagement, 
    updateEngagementSummary,
    getEngagementInsights 
  } = useSocialBufferStore();
  
  const { 
    debouncedSearch, 
    memoizedFilter, 
    handleSearchChange,
    handleFilterChange 
  } = useSocialBufferUI();

  const [selectedEngagements, setSelectedEngagements] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
    end: new Date()
  });

  // ===== HANDLERS =====

  const handleTrackEngagement = useCallback(async (engagementData: Partial<EngagementData>) => {
    try {
      const newEngagement = await trackEngagement(engagementData);
      onEngagementTracked?.(newEngagement);
    } catch (error) {
      console.error('Erro ao rastrear engajamento:', error);
    }
  }, [trackEngagement, onEngagementTracked]);

  const handleUpdateSummary = useCallback(async (postId: string) => {
    try {
      const updatedSummary = await updateEngagementSummary(postId);
      onSummaryUpdated?.(updatedSummary);
    } catch (error) {
      console.error('Erro ao atualizar resumo de engajamento:', error);
    }
  }, [updateEngagementSummary, onSummaryUpdated]);

  const handleGetInsights = useCallback(async (filters: Record<string, any>) => {
    try {
      const insights = await getEngagementInsights(filters);
      return insights;
    } catch (error) {
      console.error('Erro ao obter insights de engajamento:', error);
      return null;
    }
  }, [getEngagementInsights]);

  // ===== MEMOIZED VALUES =====

  const filteredEngagements = useMemo(() => {
    let filtered = memoizedFilter(engagementData, debouncedSearch, ['userName', 'content']);
    
    if (selectedPlatform) {
      filtered = filtered.filter(engagement => engagement.platform === selectedPlatform);
    }
    
    if (selectedType) {
      filtered = filtered.filter(engagement => engagement.type === selectedType);
    }
    
    if (selectedPost) {
      filtered = filtered.filter(engagement => engagement.postId === selectedPost);
    }
    
    // Filtrar por data
    filtered = filtered.filter(engagement => 
      engagement.timestamp >= dateRange.start && engagement.timestamp <= dateRange.end
    );
    
    return filtered;
  }, [engagementData, memoizedFilter, debouncedSearch, selectedPlatform, selectedType, selectedPost, dateRange]);

  const engagementStats = useMemo(() => {
    const totalEngagements = engagementData.length;
    const totalSummaries = engagementSummaries.length;
    const platforms = [...new Set(engagementData.map(e => e.platform))];
    const types = [...new Set(engagementData.map(e => e.type))];
    
    const recentEngagements = engagementData.filter(e => 
      e.timestamp >= new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    const totalEngagementRate = engagementSummaries.length > 0 
      ? engagementSummaries.reduce((sum, s) => sum + s.engagementRate, 0) / engagementSummaries.length
      : 0;
    
    return {
      totalEngagements,
      totalSummaries,
      platforms: platforms.length,
      types: types.length,
      recentEngagements: recentEngagements.length,
      averageEngagementRate: Math.round(totalEngagementRate * 100) / 100
    };
  }, [engagementData, engagementSummaries]);

  const topEngagingPosts = useMemo(() => {
    return engagementSummaries
      .sort((a, b) => b.totalEngagements - a.totalEngagements)
      .slice(0, 5);
  }, [engagementSummaries]);

  const topEngagers = useMemo(() => {
    const engagerCounts = engagementData.reduce((acc, engagement) => {
      const key = `${engagement.userId}-${engagement.userName}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(engagerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([key, count]) => {
        const [userId, userName] = key.split('-');
        return { userId, userName, engagementCount: count };
      });
  }, [engagementData]);

  const engagementByType = useMemo(() => {
    return engagementData.reduce((acc, engagement) => {
      acc[engagement.type] = (acc[engagement.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [engagementData]);

  const engagementByPlatform = useMemo(() => {
    return engagementData.reduce((acc, engagement) => {
      acc[engagement.platform] = (acc[engagement.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [engagementData]);

  const allPlatforms = useMemo(() => {
    return [...new Set(engagementData.map(e => e.platform))].sort();
  }, [engagementData]);

  const allTypes = useMemo(() => {
    return [...new Set(engagementData.map(e => e.type))].sort();
  }, [engagementData]);

  const allPosts = useMemo(() => {
    return [...new Set(engagementData.map(e => e.postId))].sort();
  }, [engagementData]);

  // ===== RENDER STATES =====

  if (loading) {
    return <SocialBufferLoadingSkeleton type="engagement" />;
  }

  if (error) {
    return (
      <SocialBufferErrorState 
        error={error}
        onRetry={() => window.location.reload()}
        title="Erro ao carregar dados de engajamento"
      />
    );
  }

  if (engagementData.length === 0) {
    return (
      <SocialBufferEmptyState
        title="Nenhum engajamento encontrado"
        description="Comece a publicar conteúdo para ver os dados de engajamento"
        actionText="Ver Posts"
        onAction={() => {/* Navegar para posts */}}
      />
    );
  }

  return (
    <PageTransition>
      <div className={`social-engagement-manager ${className}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gerenciador de Engajamento
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitore e analise o engajamento do seu conteúdo
            </p>
          </div>
          <Button
            onClick={() => handleGetInsights({ dateRange, platform: selectedPlatform })}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Obter Insights
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">{engagementStats.totalEngagements}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">{engagementStats.recentEngagements}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Últimas 24h</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-purple-600">{engagementStats.averageEngagementRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Taxa Média</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-orange-600">{engagementStats.platforms}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Plataformas</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-indigo-600">{engagementStats.types}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tipos</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-pink-600">{engagementStats.totalSummaries}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
          </Card>
        </div>

        {/* Top Engaging Posts */}
        {topEngagingPosts.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Posts Mais Engajados
            </h3>
            <div className="space-y-3">
              {topEngagingPosts.map((summary) => (
                <div key={summary.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {summary.platform}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Post {summary.postId}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Taxa: {summary.engagementRate}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{summary.totalEngagements}</div>
                    <div className="text-xs text-gray-500">engajamentos</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Engagement Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Engajamento por Tipo
            </h3>
            <div className="space-y-3">
              {Object.entries(engagementByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {type}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(count / Math.max(...Object.values(engagementByType))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-16 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Engajamento por Plataforma
            </h3>
            <div className="space-y-3">
              {Object.entries(engagementByPlatform).map(([platform, count]) => (
                <div key={platform} className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {platform}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(count / Math.max(...Object.values(engagementByPlatform))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-16 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Engagers */}
        {topEngagers.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Maiores Engajadores
            </h3>
            <div className="space-y-2">
              {topEngagers.map((engager, index) => (
                <div key={engager.userId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {engager.userName}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {engager.engagementCount} interações
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar engajamentos..."
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todas as plataformas</option>
                {allPlatforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todos os tipos</option>
                {allTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={selectedPost}
                onChange={(e) => setSelectedPost(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todos os posts</option>
                {allPosts.map(postId => (
                  <option key={postId} value={postId}>Post {postId}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Engagements List */}
        <div className="space-y-4">
          {filteredEngagements.map((engagement) => (
            <Card key={engagement.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {engagement.userAvatar ? (
                    <img
                      src={engagement.userAvatar}
                      alt={engagement.userName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        {engagement.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {engagement.userName}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      engagement.type === 'like' ? 'bg-red-100 text-red-800' :
                      engagement.type === 'comment' ? 'bg-blue-100 text-blue-800' :
                      engagement.type === 'share' ? 'bg-green-100 text-green-800' :
                      engagement.type === 'retweet' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {engagement.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {engagement.platform}
                    </span>
                  </div>
                  
                  {engagement.content && (
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {engagement.content}
                    </p>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    {engagement.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default SocialEngagementManager;
