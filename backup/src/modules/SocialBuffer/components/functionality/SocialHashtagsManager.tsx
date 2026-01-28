// =========================================
// SOCIAL HASHTAGS MANAGER COMPONENT
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

interface Hashtag {
  id: string;
  tag: string;
  category: string;
  usageCount: number;
  trendingScore: number;
  platforms: string[];
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
}

interface SocialHashtagsManagerProps {
  className?: string;
  onHashtagCreated?: (hashtag: Hashtag) => void;
  onHashtagUpdated?: (hashtag: Hashtag) => void;
  onHashtagDeleted?: (hashtagId: string) => void;
}

const SocialHashtagsManager: React.FC<SocialHashtagsManagerProps> = ({
  className = '',
  onHashtagCreated,
  onHashtagUpdated,
  onHashtagDeleted
}) => {
  const { 
    hashtags, 
    loading, 
    error, 
    createHashtag, 
    updateHashtag, 
    deleteHashtag,
    trackHashtagUsage 
  } = useSocialBufferStore();
  
  const { 
    debouncedSearch, 
    memoizedFilter, 
    handleSearchChange,
    handleFilterChange 
  } = useSocialBufferUI();

  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHashtag, setEditingHashtag] = useState<Hashtag | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // ===== HANDLERS =====

  const handleCreateHashtag = useCallback(async (hashtagData: Partial<Hashtag>) => {
    try {
      const newHashtag = await createHashtag(hashtagData);
      onHashtagCreated?.(newHashtag);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erro ao criar hashtag:', error);
    }
  }, [createHashtag, onHashtagCreated]);

  const handleUpdateHashtag = useCallback(async (hashtagId: string, updates: Partial<Hashtag>) => {
    try {
      const updatedHashtag = await updateHashtag(hashtagId, updates);
      onHashtagUpdated?.(updatedHashtag);
      setEditingHashtag(null);
    } catch (error) {
      console.error('Erro ao atualizar hashtag:', error);
    }
  }, [updateHashtag, onHashtagUpdated]);

  const handleDeleteHashtag = useCallback(async (hashtagId: string) => {
    try {
      await deleteHashtag(hashtagId);
      onHashtagDeleted?.(hashtagId);
    } catch (error) {
      console.error('Erro ao deletar hashtag:', error);
    }
  }, [deleteHashtag, onHashtagDeleted]);

  const handleToggleActive = useCallback(async (hashtagId: string, isActive: boolean) => {
    try {
      await updateHashtag(hashtagId, { isActive });
    } catch (error) {
      console.error('Erro ao alterar status da hashtag:', error);
    }
  }, [updateHashtag]);

  const handleBulkAction = useCallback(async (action: 'delete' | 'activate' | 'deactivate') => {
    try {
      if (action === 'delete') {
        await Promise.all(selectedHashtags.map(id => deleteHashtag(id)));
      } else if (action === 'activate') {
        await Promise.all(selectedHashtags.map(id => updateHashtag(id, { isActive: true })));
      } else if (action === 'deactivate') {
        await Promise.all(selectedHashtags.map(id => updateHashtag(id, { isActive: false })));
      }
      setSelectedHashtags([]);
    } catch (error) {
      console.error(`Erro na ação em lote ${action}:`, error);
    }
  }, [selectedHashtags, deleteHashtag, updateHashtag]);

  // ===== MEMOIZED VALUES =====

  const filteredHashtags = useMemo(() => {
    let filtered = memoizedFilter(hashtags, debouncedSearch, ['tag', 'category']);
    
    if (selectedCategory) {
      filtered = filtered.filter(hashtag => hashtag.category === selectedCategory);
    }
    
    return filtered;
  }, [hashtags, memoizedFilter, debouncedSearch, selectedCategory]);

  const hashtagStats = useMemo(() => {
    return {
      total: hashtags.length,
      active: hashtags.filter(h => h.isActive).length,
      trending: hashtags.filter(h => h.trendingScore > 7).length,
      categories: [...new Set(hashtags.map(h => h.category))].length
    };
  }, [hashtags]);

  const trendingHashtags = useMemo(() => {
    return hashtags
      .filter(h => h.trendingScore > 5)
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 10);
  }, [hashtags]);

  // ===== RENDER STATES =====

  if (loading) {
    return <SocialBufferLoadingSkeleton type="hashtags" />;
  }

  if (error) {
    return (
      <SocialBufferErrorState 
        error={error}
        onRetry={() => window.location.reload()}
        title="Erro ao carregar hashtags"
      />
    );
  }

  if (hashtags.length === 0) {
    return (
      <SocialBufferEmptyState
        title="Nenhuma hashtag encontrada"
        description="Crie sua primeira hashtag para começar a organizar seu conteúdo"
        actionText="Criar Hashtag"
        onAction={() => setShowCreateModal(true)}
      />
    );
  }

  return (
    <PageTransition>
      <div className={`social-hashtags-manager ${className}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gerenciador de Hashtags
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organize e gerencie suas hashtags
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Nova Hashtag
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">{hashtagStats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">{hashtagStats.active}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Ativas</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-orange-600">{hashtagStats.trending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Em Alta</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-purple-600">{hashtagStats.categories}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Categorias</div>
          </Card>
        </div>

        {/* Trending Hashtags */}
        {trendingHashtags.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hashtags em Alta
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingHashtags.map((hashtag) => (
                <span
                  key={hashtag.id}
                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                >
                  #{hashtag.tag} ({hashtag.trendingScore}/10)
                </span>
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
                placeholder="Buscar hashtags..."
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todas as categorias</option>
                {[...new Set(hashtags.map(h => h.category))].map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todos os status</option>
                <option value="active">Ativas</option>
                <option value="inactive">Inativas</option>
                <option value="trending">Em Alta</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Bulk Actions */}
        {selectedHashtags.length > 0 && (
          <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 dark:text-blue-300">
                {selectedHashtags.length} hashtag(s) selecionada(s)
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleBulkAction('activate')}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  Ativar
                </Button>
                <Button
                  onClick={() => handleBulkAction('deactivate')}
                  className="bg-yellow-600 hover:bg-yellow-700"
                  size="sm"
                >
                  Desativar
                </Button>
                <Button
                  onClick={() => handleBulkAction('delete')}
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  Deletar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Hashtags List */}
        <div className="space-y-4">
          {filteredHashtags.map((hashtag) => (
            <Card key={hashtag.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedHashtags.includes(hashtag.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedHashtags(prev => [...prev, hashtag.id]);
                        } else {
                          setSelectedSchedules(prev => prev.filter(id => id !== hashtag.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-lg font-semibold text-blue-600">
                      #{hashtag.tag}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      hashtag.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {hashtag.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                    {hashtag.trendingScore > 7 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Em Alta
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Categoria: {hashtag.category}</span>
                    <span>Usos: {hashtag.usageCount}</span>
                    <span>Score: {hashtag.trendingScore}/10</span>
                    <span>Plataformas: {hashtag.platforms.join(', ')}</span>
                  </div>
                  
                  {hashtag.lastUsed && (
                    <div className="text-xs text-gray-500">
                      Último uso: {hashtag.lastUsed.toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleToggleActive(hashtag.id, !hashtag.isActive)}
                    className={hashtag.isActive ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}
                    size="sm"
                  >
                    {hashtag.isActive ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button
                    onClick={() => setEditingHashtag(hashtag)}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteHashtag(hashtag.id)}
                    className="bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    Deletar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default SocialHashtagsManager;
