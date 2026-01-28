import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../../hooks/useTranslation';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useAdvancedNotifications } from '../../../hooks/useAdvancedNotifications';
import { useLoadingStates } from '../../../hooks/useLoadingStates';
// Design System
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
import {
  Calendar, Clock, Send, Image, Video, FileText, Hash, Users,
  TrendingUp, BarChart3, Heart, MessageCircle, Share2, Repeat,
  Eye, ThumbsUp, Target, Zap, Globe, Settings, Plus, Search,
  Filter, Grid, List, Edit2, Trash2, Copy, Download, Upload,
  Play, Pause, RotateCcw, CheckCircle2, AlertCircle, XCircle,
  Facebook, Twitter, Instagram, Linkedin, Youtube, Twitch,
  Sparkles, Wand2, Brain, Robot, Camera, Mic, Palette,
  Map, Navigation, Award, Star, Fire, Trending, Activity
} from 'lucide-react';
// Interfaces
interface SocialPost {
  id: string;
  content: string;
  platforms: Platform[];
  media: MediaItem[];
  hashtags: string[];
  mentions: string[];
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  campaign?: string;
  performance: PostPerformance;
  createdAt: string;
  updatedAt: string;
}
interface Platform {
  id: string;
  name: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok';
  account: string;
  connected: boolean;
  lastSync: string;
  permissions: string[];
}
interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnail?: string;
  alt?: string;
  size: number;
  duration?: number;
}
interface PostPerformance {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  engagementRate: number;
  reach: number;
  impressions: number;
}
interface SocialAnalytics {
  totalPosts: number;
  scheduledPosts: number;
  publishedToday: number;
  totalEngagement: number;
  topPerformingPost: string;
  engagementGrowth: number;
  followerGrowth: number;
  reachGrowth: number;
  bestPostingTime: string;
  topHashtags: string[];
  platformPerformance: PlatformStats[];
  recentActivity: ActivityEvent[];
}
interface PlatformStats {
  platform: string;
  followers: number;
  posts: number;
  engagement: number;
  reach: number;
  growth: number;
}
interface ActivityEvent {
  id: string;
  type: 'post_published' | 'post_scheduled' | 'engagement_milestone' | 'follower_milestone';
  message: string;
  timestamp: string;
  platform?: string;
  metadata: Record<string, any>;
}
interface ContentTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  hashtags: string[];
  platforms: string[];
  performance: number;
}
interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  posts: string[];
  budget?: number;
  performance: {
    posts: number;
    reach: number;
    engagement: number;
    conversions: number;
  };
  status: 'active' | 'paused' | 'completed';
}
const AdvancedSocialBufferDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { showNotification, showError, showSuccess } = useAdvancedNotifications();
  const { isLoading, setLoading } = useLoadingStates();
  // Estados principais
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [analytics, setAnalytics] = useState<SocialAnalytics | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'grid' | 'list'>('calendar');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // Ícones de plataformas
  const platformIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    tiktok: Video
  };
  // Cores das plataformas
  const platformColors = {
    facebook: 'bg-blue-600',
    twitter: 'bg-sky-500',
    instagram: 'bg-pink-600',
    linkedin: 'bg-blue-700',
    youtube: 'bg-red-600',
    tiktok: 'bg-black'
  };
  // Templates de conteúdo
  const contentTemplates: ContentTemplate[] = [
    {
      id: '1',
      name: 'Dica de Produtividade',
      category: 'Tips',
      template: '💡 Dica do dia: {tip}\n\n{description}\n\n#produtividade #dicas #empreendedorismo',
      hashtags: ['produtividade', 'dicas', 'empreendedorismo'],
      platforms: ['linkedin', 'twitter'],
      performance: 87
    },
    {
      id: '2',
      name: 'Pergunta Interativa',
      category: 'Engagement',
      template: '🤔 {question}\n\nComenta aí sua opinião! 👇\n\n#discussao #comunidade #opiniao',
      hashtags: ['discussao', 'comunidade', 'opiniao'],
      platforms: ['facebook', 'instagram'],
      performance: 92
    },
    {
      id: '3',
      name: 'Showcase de Produto',
      category: 'Product',
      template: '🚀 Conheça o {product}!\n\n✨ {benefits}\n\n📈 {results}\n\n#produto #inovacao #resultados',
      hashtags: ['produto', 'inovacao', 'resultados'],
      platforms: ['instagram', 'facebook', 'linkedin'],
      performance: 89
    }
  ];
  // Dados simulados
  useEffect(() => {
    const loadData = async () => {
      setLoading('social', true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Plataformas conectadas
      setPlatforms([
        {
          id: '1',
          name: 'instagram',
          account: '@minhaconta',
          connected: true,
          lastSync: '2024-01-20T14:30:00Z',
          permissions: ['publish', 'read', 'insights']
        },
        {
          id: '2',
          name: 'facebook',
          account: 'Minha Página',
          connected: true,
          lastSync: '2024-01-20T14:25:00Z',
          permissions: ['publish', 'read', 'insights']
        },
        {
          id: '3',
          name: 'linkedin',
          account: 'João Silva',
          connected: false,
          lastSync: '',
          permissions: []
        }
      ]);
      // Posts
      setPosts([
        {
          id: '1',
          content: '🚀 Lançando nossa nova ferramenta de automação! Economize até 5 horas por semana com nossa solução inteligente.',
          platforms: [
            { id: '1', name: 'instagram', account: '@minhaconta', connected: true, lastSync: '', permissions: [] },
            { id: '2', name: 'facebook', account: 'Minha Página', connected: true, lastSync: '', permissions: [] }
          ],
          media: [
            {
              id: '1',
              type: 'image',
              url: '/social/automation-tool.jpg',
              size: 1024000,
              alt: 'Ferramenta de automação'
            }
          ],
          hashtags: ['automacao', 'produtividade', 'ferramenta', 'tecnologia'],
          mentions: ['@tecnologia', '@produtividade'],
          scheduledFor: '2024-01-21T10:00:00Z',
          status: 'scheduled',
          campaign: 'product-launch-q1',
          performance: {
            views: 15420,
            likes: 892,
            comments: 156,
            shares: 89,
            saves: 234,
            clicks: 445,
            engagementRate: 8.7,
            reach: 12340,
            impressions: 18750
          },
          createdAt: '2024-01-20T09:00:00Z',
          updatedAt: '2024-01-20T12:30:00Z'
        },
        {
          id: '2',
          content: '💡 Dica de sexta-feira: Use a regra dos 2 minutos - se uma tarefa leva menos de 2 minutos, faça agora!',
          platforms: [
            { id: '1', name: 'linkedin', account: 'João Silva', connected: true, lastSync: '', permissions: [] }
          ],
          media: [],
          hashtags: ['produtividade', 'dicas', 'sextafeira', 'motivacao'],
          mentions: [],
          status: 'published',
          performance: {
            views: 8930,
            likes: 445,
            comments: 67,
            shares: 23,
            saves: 156,
            clicks: 189,
            engagementRate: 9.2,
            reach: 7850,
            impressions: 11200
          },
          createdAt: '2024-01-19T08:00:00Z',
          updatedAt: '2024-01-19T08:00:00Z'
        }
      ]);
      // Campanhas
      setCampaigns([
        {
          id: '1',
          name: 'Lançamento de Produto Q1',
          description: 'Campanha para lançamento da nova ferramenta de automação',
          startDate: '2024-01-15',
          endDate: '2024-02-15',
          posts: ['1'],
          performance: {
            posts: 8,
            reach: 45200,
            engagement: 3240,
            conversions: 89
          },
          status: 'active'
        }
      ]);
      // Analytics
      setAnalytics({
        totalPosts: 156,
        scheduledPosts: 23,
        publishedToday: 4,
        totalEngagement: 45280,
        topPerformingPost: '1',
        engagementGrowth: 12.5,
        followerGrowth: 8.3,
        reachGrowth: 15.7,
        bestPostingTime: '10:00',
        topHashtags: ['produtividade', 'tecnologia', 'automacao', 'dicas', 'empreendedorismo'],
        platformPerformance: [
          {
            platform: 'Instagram',
            followers: 15420,
            posts: 89,
            engagement: 23400,
            reach: 156780,
            growth: 12.5
          },
          {
            platform: 'Facebook',
            followers: 8930,
            posts: 67,
            engagement: 18900,
            reach: 98540,
            growth: 8.7
          }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'post_published',
            message: 'Post "Dica de produtividade" publicado no LinkedIn',
            timestamp: '2024-01-20T14:30:00Z',
            platform: 'linkedin',
            metadata: { postId: '2' }
          }
        ]
      });
      setTemplates(contentTemplates);
      setLoading('social', false);
    };
    loadData();
  }, [setLoading]);
  // Filtros
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesPlatform = filterPlatform === 'all' || 
        post.platforms.some(p => p.name === filterPlatform);
      const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
      const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesPlatform && matchesStatus && matchesSearch;
    });
  }, [posts, filterPlatform, filterStatus, searchQuery]);
  // Handlers
  const handleCreatePost = useCallback(() => {
    setShowCreateModal(true);
  }, []);
  const handlePostAction = useCallback(async (action: string, postId: string) => {
    setLoading(action, true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      switch (action) {
        case 'publish':
          setPosts(prev => prev.map(p => 
            p.id === postId ? { ...p, status: 'published' as const } : p
          ));
          showSuccess('Post publicado com sucesso!');
          break;
        case 'duplicate':
          showSuccess('Post duplicado');
          break;
        case 'delete':
          setPosts(prev => prev.filter(p => p.id !== postId));
          showSuccess('Post excluído');
          break;
        default:
          showSuccess('Ação executada com sucesso');
      }
    } catch (error) {
      showError('Erro ao executar ação');
    } finally {
      setLoading(action, false);
    }
  }, [setLoading, showSuccess, showError]);
  const handleUseTemplate = useCallback((template: ContentTemplate) => {
    showSuccess(`Template "${template.name}" aplicado! Personalize o conteúdo.`);
    setShowCreateModal(true);
  }, [showSuccess]);
  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      published: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  const getStatusIcon = (status: string) => {
    const icons = {
      draft: FileText,
      scheduled: Clock,
      published: CheckCircle2,
      failed: XCircle
    };
    return icons[status] || FileText;
  };
  if (isLoading.social) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <span className="text-gray-600">Carregando mídias sociais...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-6">
      {/* Header Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100">Posts Totais</p>
              <p className="text-3xl font-bold">{analytics?.totalPosts}</p>
              <p className="text-sm text-pink-200 mt-1">
                +{analytics?.engagementGrowth}% este mês
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-pink-200" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl p-6 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Agendados</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.scheduledPosts}</p>
              <p className="text-sm text-blue-600 mt-1">Próximas 24h: 3</p>
            </div>
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl p-6 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Engajamento Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {(analytics?.totalEngagement || 0).toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{analytics?.engagementGrowth}% ↗
              </p>
            </div>
            <Heart className="h-6 w-6 text-red-500" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl p-6 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Melhor Horário</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.bestPostingTime}</p>
              <p className="text-sm text-purple-600 mt-1">Para seu público</p>
            </div>
            <Target className="h-6 w-6 text-purple-600" />
          </div>
        </motion.div>
      </div>
      {/* Plataformas Conectadas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plataformas Conectadas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {platforms.map((platform) => {
            const Icon = platformIcons[platform.name];
            const colorClass = platformColors[platform.name];
            return (
              <motion.div
                key={platform.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  platform.connected
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-3 ${colorClass} text-white rounded-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm text-gray-900 capitalize">
                      {platform.name}
                    </p>
                    <p className="text-xs text-gray-600">{platform.account}</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-1 ${
                      platform.connected
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {platform.connected ? 'Conectado' : 'Desconectado'}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Controles */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">Todas Plataformas</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">Todos Status</option>
              <option value="draft">Rascunho</option>
              <option value="scheduled">Agendado</option>
              <option value="published">Publicado</option>
              <option value="failed">Falhado</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded ${viewMode === 'calendar' 
                  ? 'bg-white shadow-sm text-pink-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Calendar className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-pink-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' 
                  ? 'bg-white shadow-sm text-pink-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              <Brain className="h-4 w-4" />
              <span>IA Content</span>
            </button>
            <button
              onClick={handleCreatePost}
              className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Post</span>
            </button>
          </div>
        </div>
      </div>
      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPosts.map((post, index) => {
            const StatusIcon = getStatusIcon(post.status);
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Post Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(post.status)}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{post.status}</span>
                        </span>
                        {post.campaign && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            Campanha
                          </span>
                        )}
                      </div>
                      {post.scheduledFor && (
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(post.scheduledFor).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Plataformas */}
                  <div className="flex items-center space-x-2 mb-3">
                    {post.platforms.slice(0, 4).map((platform) => {
                      const Icon = platformIcons[platform.name];
                      const colorClass = platformColors[platform.name];
                      return (
                        <div key={platform.id} className={`p-1.5 ${colorClass} text-white rounded`}>
                          <Icon className="h-3 w-3" />
                        </div>
                      );
                    })}
                    {post.platforms.length > 4 && (
                      <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{post.platforms.length - 4}
                      </div>
                    )}
                  </div>
                </div>
                {/* Conteúdo */}
                <div className="p-4">
                  <p className="text-gray-900 text-sm line-clamp-4 mb-3">
                    {post.content}
                  </p>
                  {/* Mídia */}
                  {post.media.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {post.media.slice(0, 4).map((media) => (
                        <div key={media.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={media.url}
                            alt={media.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Hashtags */}
                  {post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.hashtags.slice(0, 5).map((hashtag) => (
                        <span key={hashtag} className="text-blue-600 text-xs">
                          #{hashtag}
                        </span>
                      ))}
                      {post.hashtags.length > 5 && (
                        <span className="text-gray-500 text-xs">
                          +{post.hashtags.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Performance */}
                  {post.status === 'published' && (
                    <div className="grid grid-cols-3 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-gray-600">Likes</span>
                        </div>
                        <div className="text-sm font-semibold">{post.performance.likes}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <MessageCircle className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-gray-600">Comentários</span>
                        </div>
                        <div className="text-sm font-semibold">{post.performance.comments}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Share2 className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-gray-600">Shares</span>
                        </div>
                        <div className="text-sm font-semibold">{post.performance.shares}</div>
                      </div>
                    </div>
                  )}
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePostAction('edit', post.id)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePostAction('duplicate', post.id)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePostAction('delete', post.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {post.status === 'draft' && (
                      <button
                        onClick={() => handlePostAction('publish', post.id)}
                        className="flex items-center space-x-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <Send className="h-3 w-3" />
                        <span>Publicar</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {/* AI Assistant Sidebar */}
      <AnimatePresence>
        {showAIAssistant && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-purple-50 to-pink-50 border-l border-gray-200 p-6 z-40 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI Content Assistant</span>
              </h3>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span>Templates Inteligentes</span>
                </h4>
                <div className="space-y-2">
                  {templates.slice(0, 3).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleUseTemplate(template)}
                      className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-sm text-gray-900">{template.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{template.category}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex space-x-1">
                          {template.platforms.slice(0, 3).map((platform) => {
                            const Icon = platformIcons[platform];
                            return (
                              <div key={platform} className="p-1 bg-white rounded">
                                <Icon className="h-3 w-3" />
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          {template.performance}% performance
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Hashtags Populares</h4>
                <div className="flex flex-wrap gap-1">
                  {analytics?.topHashtags.map((hashtag) => (
                    <span
                      key={hashtag}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded cursor-pointer hover:bg-blue-100"
                    >
                      #{hashtag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Insights de Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Melhor hora para postar:</span>
                    <span className="font-medium">{analytics?.bestPostingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crescimento de engajamento:</span>
                    <span className="font-medium text-green-600">+{analytics?.engagementGrowth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posts com melhor performance:</span>
                    <span className="font-medium">Com imagens</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Loading States */}
      {Object.entries(isLoading).some(([key, loading]) => loading && key !== 'social') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
            <span className="text-gray-700">Processando...</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdvancedSocialBufferDashboard;
