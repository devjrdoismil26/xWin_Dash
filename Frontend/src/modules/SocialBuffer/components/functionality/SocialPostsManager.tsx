// =========================================
// SOCIAL POSTS MANAGER - SOCIAL BUFFER
// =========================================

import React, { useMemo, useCallback, useState } from 'react';
import { Send, Plus, Edit, Trash2, Copy, Calendar, Eye, MoreVertical, Filter, Search, Grid, List, Clock, CheckCircle, RefreshCw, AlertCircle, Pause, Play } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { Animated } from '@/shared/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { usePostsUI } from '@/hooks/useSocialBufferUI';
import { usePostsStore } from '@/hooks/usePostsStore';
import SocialBufferLoadingSkeleton from '../ui/SocialBufferLoadingSkeleton';
import SocialBufferErrorState from '../ui/SocialBufferErrorState';
import SocialBufferEmptyState from '../ui/SocialBufferEmptyState';
import SocialBufferSuccessState from '../ui/SocialBufferSuccessState';

// =========================================
// INTERFACES
// =========================================

interface SocialPostsManagerProps {
  className?: string;
  showHeader?: boolean;
  showFilters?: boolean;
  showActions?: boolean;
  viewMode?: 'grid' | 'list';
  maxHeight?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

interface PostCardProps {
  post: unknown;
  viewMode: 'grid' | 'list';
  onEdit?: (e: any) => void;
  onDelete?: (e: any) => void;
  onDuplicate?: (e: any) => void;
  onSchedule?: (e: any) => void;
  onView?: (e: any) => void;
  onPublish?: (e: any) => void;
  onPause?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties; }

// =========================================
// COMPONENTE DE CARTÃO DE POST
// =========================================

const PostCard: React.FC<PostCardProps> = React.memo(({ 
  post, 
  viewMode,
  onEdit, 
  onDelete, 
  onDuplicate,
  onSchedule,
  onView,
  onPublish,
  onPause
}) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      published: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'};

    return colors[status] || 'bg-gray-100 text-gray-800';};

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4" />;
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      case 'draft':
        return <Edit className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Edit className="w-4 h-4" />;
    } ;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });};

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';};

  if (viewMode === 'list') {
    return (
        <>
      <Animated />
      <Card className="p-4 hover:shadow-md transition-shadow" />
          <div className="{/* Thumbnail */}">$2</div>
            <div className="{post.media_url ? (">$2</div>
      <img 
                  src={ post.media_url }
                  alt="Post thumbnail" 
                  className="w-full h-full object-cover rounded-lg"
                / />
    </>
  ) : (
                <Send className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {/* Conteúdo */}
            <div className=" ">$2</div><div className=" ">$2</div><h3 className="font-medium text-gray-900 truncate" />
                  {post.title || 'Post sem título'}
                </h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(post.status)} `}>
           
        </div>{getStatusIcon(post.status)}
                  {post.status}
                </div>
              
              <p className="text-sm text-gray-600 mb-2" />
                {truncateContent(post.content, 150)}
              </p>
              
              <div className=" ">$2</div><span>Plataforma: {post.platform}</span>
                <span>Criado: {formatDate(post.created_at)}</span>
                {post.scheduled_at && (
                  <span>Agendado: {formatDate(post.scheduled_at)}</span>
                )}
              </div>

            {/* Ações */}
            <div className=" ">$2</div><Button
                variant="ghost"
                size="sm"
                onClick={ () => onView(post) }
                className="p-1"
              >
                <Eye className="w-4 h-4" /></Button><Button
                variant="ghost"
                size="sm"
                onClick={ () => onEdit(post) }
                className="p-1"
              >
                <Edit className="w-4 h-4" /></Button><Button
                variant="ghost"
                size="sm"
                onClick={ () => onDuplicate(post) }
                className="p-1"
              >
                <Copy className="w-4 h-4" /></Button><div className=" ">$2</div><Button
                  variant="ghost"
                  size="sm"
                  className="p-1" />
                  <MoreVertical className="w-4 h-4" /></Button></div></div></Card></Animated>);

  }

  return (
        <>
      <Animated />
      <Card className="p-6 hover:shadow-lg transition-shadow" />
        <div className="{/* Header do Cartão */}">$2</div>
          <div className=" ">$2</div><div className=" ">$2</div><div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(post.status)} `}>
           
        </div>{getStatusIcon(post.status)}
                {post.status}
              </div>
              <span className="text-sm text-gray-500 capitalize">{post.platform}</span></div><div className=" ">$2</div><Button
                variant="ghost"
                size="sm"
                className="p-1" />
                <MoreVertical className="w-4 h-4" /></Button></div>

          {/* Thumbnail */}
          <div className="{post.media_url ? (">$2</div>
      <img 
                src={ post.media_url }
                alt="Post thumbnail" 
                className="w-full h-full object-cover"
              / />
    </>
  ) : (
              <Send className="w-8 h-8 text-gray-400" />
            )}
          </div>

          {/* Conteúdo */}
          <div>
           
        </div><h3 className="font-medium text-gray-900 mb-2 line-clamp-2" />
              {post.title || 'Post sem título'}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3" />
              {truncateContent(post.content, 120)}
            </p>
          </div>

          {/* Informações */}
          <div className=" ">$2</div><div className=" ">$2</div><span>Criado:</span>
              <span>{formatDate(post.created_at)}</span>
            </div>
            {post.scheduled_at && (
              <div className=" ">$2</div><span>Agendado:</span>
                <span>{formatDate(post.scheduled_at)}</span>
      </div>
    </>
  )}
            {post.published_at && (
              <div className=" ">$2</div><span>Publicado:</span>
                <span>{formatDate(post.published_at)}</span>
      </div>
    </>
  )}
          </div>

          {/* Ações */}
          <div className=" ">$2</div><Button
              variant="outline"
              size="sm"
              onClick={ () => onView(post) }
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Ver
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={ () => onEdit(post) }
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Button>
            
            {post.status === 'draft' && (
              <Button
                variant="outline"
                size="sm"
                onClick={ () => onSchedule(post) }
                className="flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
              </Button>
            )}
            
            {post.status === 'scheduled' && (
              <Button
                variant="outline"
                size="sm"
                onClick={ () => onPublish(post) }
                className="flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
              </Button>
            )}
            
            {post.status === 'published' && (
              <Button
                variant="outline"
                size="sm"
                onClick={ () => onPause(post) }
                className="flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4" />
              </Button>
            )}
          </div></Card></Animated>);

});

PostCard.displayName = 'PostCard';

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

const SocialPostsManager: React.FC<SocialPostsManagerProps> = ({ className = '',
  showHeader = true,
  showFilters = true,
  showActions = true,
  viewMode: initialViewMode = 'grid',
  maxHeight = 'max-h-96'
   }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);

  // Hooks
  const ui = usePostsUI();

  const postsStore = usePostsStore();

  // ===== DADOS MEMOIZADOS =====

  const filteredPosts = useMemo(() => {
    let filtered = postsStore.posts;

    // Filtro por busca
    if (searchQuery) {
      filtered = (filtered || []).filter(post =>
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchQuery.toLowerCase()));

    }

    // Filtro por status
    if (selectedStatus !== 'all') {
      filtered = (filtered || []).filter(post => post.status === selectedStatus);

    }

    // Filtro por plataforma
    if (selectedPlatform !== 'all') {
      filtered = (filtered || []).filter(post => post.platform === selectedPlatform);

    }

    return filtered;
  }, [postsStore.posts, searchQuery, selectedStatus, selectedPlatform]);

  const platforms = useMemo(() => {
    const uniquePlatforms = [...new Set((postsStore.posts || []).map(post => post.platform))];
    return uniquePlatforms;
  }, [postsStore.posts]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set((postsStore.posts || []).map(post => post.status))];
    return uniqueStatuses;
  }, [postsStore.posts]);

  const stats = useMemo(() => {
    const total = postsStore.posts.length;
    const published = (postsStore.posts || []).filter(post => post.status === 'published').length;
    const scheduled = (postsStore.posts || []).filter(post => post.status === 'scheduled').length;
    const draft = (postsStore.posts || []).filter(post => post.status === 'draft').length;
    
    return { total, published, scheduled, draft};

  }, [postsStore.posts]);

  // ===== CALLBACKS =====

  const handleCreatePost = useCallback(() => {
    ui.setLoading(true);

    // Implementar lógica de criação
    setTimeout(() => {
      ui.setLoading(false);

      ui.handleSuccess('Post criado com sucesso!');

    }, 2000);

  }, [ui]);

  const handleEditPost = useCallback((post: unknown) => {
    // Implementar lógica de edição
  }, []);

  const handleDeletePost = useCallback((post: unknown) => {
    if (window.confirm(`Tem certeza que deseja deletar o post "${post.title || 'sem título'}"?`)) {
      ui.setLoading(true);

      postsStore.deletePost(post.id)
        .then(() => {
          ui.handleSuccess('Post deletado com sucesso!');

        })
        .catch((error: unknown) => {
          ui.handleError(error);

        })
        .finally(() => {
          ui.setLoading(false);

        });

    } , [ui, postsStore]);

  const handleDuplicatePost = useCallback((post: unknown) => {
    ui.setLoading(true);

    postsStore.duplicatePost(post.id)
      .then(() => {
        ui.handleSuccess('Post duplicado com sucesso!');

      })
      .catch((error: unknown) => {
        ui.handleError(error);

      })
      .finally(() => {
        ui.setLoading(false);

      });

  }, [ui, postsStore]);

  const handleSchedulePost = useCallback((post: unknown) => {
    // Implementar lógica de agendamento
  }, []);

  const handleViewPost = useCallback((post: unknown) => {
    // Implementar lógica de visualização
  }, []);

  const handlePublishPost = useCallback((post: unknown) => {
    ui.setLoading(true);

    postsStore.publishPost(post.id)
      .then(() => {
        ui.handleSuccess('Post publicado com sucesso!');

      })
      .catch((error: unknown) => {
        ui.handleError(error);

      })
      .finally(() => {
        ui.setLoading(false);

      });

  }, [ui, postsStore]);

  const handlePausePost = useCallback((post: unknown) => {
    ui.setLoading(true);

    postsStore.pausePost(post.id)
      .then(() => {
        ui.handleSuccess('Post pausado com sucesso!');

      })
      .catch((error: unknown) => {
        ui.handleError(error);

      })
      .finally(() => {
        ui.setLoading(false);

      });

  }, [ui, postsStore]);

  const handleRefreshPosts = useCallback(() => {
    ui.setLoading(true);

    postsStore.refreshPosts()
      .then(() => {
        ui.handleSuccess('Posts atualizados com sucesso!');

      })
      .catch((error: unknown) => {
        ui.handleError(error);

      })
      .finally(() => {
        ui.setLoading(false);

      });

  }, [ui, postsStore]);

  // ===== RENDERIZAÇÃO =====

  if (ui.loading && !postsStore.posts.length) { return <SocialBufferLoadingSkeleton type="posts" className={className } />;
  }

  if (ui.error && !postsStore.posts.length) {
    return (
              <SocialBufferErrorState
        message={ ui.error }
        onRetry={ handleRefreshPosts }
        className={className} / />);

  }

  if (ui.isEmpty) {
    return (
              <SocialBufferEmptyState
        type="posts"
        onAction={ handleCreatePost }
        className={className} / />);

  }

  return (
        <>
      <div className={`space-y-6 ${className} `}>
      </div>{/* Header */}
      {showHeader && (
        <div className=" ">$2</div><div>
           
        </div><h2 className="text-2xl font-bold text-gray-900">Posts</h2>
            <p className="text-gray-600 mt-1" />
              Gerencie seus posts ({stats.published} publicados, {stats.scheduled} agendados, {stats.draft} rascunhos)
            </p>
          </div>
          
          {showActions && (
            <div className=" ">$2</div><Button
                variant="outline"
                onClick={ handleRefreshPosts }
                disabled={ ui.loading }
                className="flex items-center gap-2" />
                <RefreshCw className={`w-4 h-4 ${ui.loading ? 'animate-spin' : ''} `} / />
                Atualizar
              </Button>
              
              <Button
                onClick={ handleCreatePost }
                disabled={ ui.loading }
                className="flex items-center gap-2" />
                <Plus className="w-4 h-4" />
                Criar Post
              </Button>
      </div>
    </>
  )}
        </div>
      )}

      {/* Filtros */}
      {showFilters && (
        <Card className="p-4" />
          <div className="{/* Busca */}">$2</div>
            <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar posts..."
                  value={ searchQuery }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value) }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>

            {/* Filtro por status */}
            <select
              value={ selectedStatus }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSelectedStatus(e.target.value) }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os status</option>
              {(statuses || []).map(status => (
                <option key={status} value={ status } />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            {/* Filtro por plataforma */}
            <select
              value={ selectedPlatform }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSelectedPlatform(e.target.value) }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as plataformas</option>
              {(platforms || []).map(platform => (
                <option key={platform} value={ platform } />
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </option>
              ))}
            </select>

            {/* Toggle de visualização */}
            <div className=" ">$2</div><Button
                variant={ viewMode === 'grid' ? 'default' : 'ghost' }
                size="sm"
                onClick={ () => setViewMode('grid') }
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" /></Button><Button
                variant={ viewMode === 'list' ? 'default' : 'ghost' }
                size="sm"
                onClick={ () => setViewMode('list') }
                className="rounded-l-none"
              >
                <List className="w-4 h-4" /></Button></div>
      </Card>
    </>
  )}

      {/* Lista de Posts */}
      <div className={`overflow-y-auto ${maxHeight} `}>
           
        </div>{viewMode === 'grid' ? (
          <ResponsiveGrid columns={ sm: 1, md: 2, lg: 3 } gap={ 6 } />
            {(filteredPosts || []).map((post: unknown, index: unknown) => (
              <PostCard
                key={ post.id }
                post={ post }
                viewMode={ viewMode }
                onEdit={ handleEditPost }
                onDelete={ handleDeletePost }
                onDuplicate={ handleDuplicatePost }
                onSchedule={ handleSchedulePost }
                onView={ handleViewPost }
                onPublish={ handlePublishPost }
                onPause={ handlePausePost }
              / />
            ))}
          </ResponsiveGrid>
        ) : (
          <div className="{(filteredPosts || []).map((post: unknown, index: unknown) => (">$2</div>
      <PostCard
                key={ post.id }
                post={ post }
                viewMode={ viewMode }
                onEdit={ handleEditPost }
                onDelete={ handleDeletePost }
                onDuplicate={ handleDuplicatePost }
                onSchedule={ handleSchedulePost }
                onView={ handleViewPost }
                onPublish={ handlePublishPost }
                onPause={ handlePausePost }
              / />
    </>
  ))}
          </div>
        )}
      </div>

      {/* Estados de Sucesso/Erro */}
      {ui.success && (
        <SocialBufferSuccessState
          type="post"
          message={ ui.success }
          onAction={ () => ui.clearMessages() } />
      )}
    </div>);};

export default SocialPostsManager;
