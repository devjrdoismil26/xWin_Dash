// =========================================
// SOCIAL LINKS MANAGER COMPONENT
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

interface SocialLink {
  id: string;
  originalUrl: string;
  shortUrl: string;
  title: string;
  description?: string;
  clickCount: number;
  platforms: string[];
  isActive: boolean;
  createdAt: Date;
  lastClicked?: Date;
  tags: string[];
}

interface SocialLinksManagerProps {
  className?: string;
  onLinkCreated?: (link: SocialLink) => void;
  onLinkUpdated?: (link: SocialLink) => void;
  onLinkDeleted?: (linkId: string) => void;
}

const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({
  className = '',
  onLinkCreated,
  onLinkUpdated,
  onLinkDeleted
}) => {
  const { 
    links, 
    loading, 
    error, 
    createLink, 
    updateLink, 
    deleteLink,
    trackLinkClick 
  } = useSocialBufferStore();
  
  const { 
    debouncedSearch, 
    memoizedFilter, 
    handleSearchChange,
    handleFilterChange 
  } = useSocialBufferUI();

  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('');

  // ===== HANDLERS =====

  const handleCreateLink = useCallback(async (linkData: Partial<SocialLink>) => {
    try {
      const newLink = await createLink(linkData);
      onLinkCreated?.(newLink);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erro ao criar link:', error);
    }
  }, [createLink, onLinkCreated]);

  const handleUpdateLink = useCallback(async (linkId: string, updates: Partial<SocialLink>) => {
    try {
      const updatedLink = await updateLink(linkId, updates);
      onLinkUpdated?.(updatedLink);
      setEditingLink(null);
    } catch (error) {
      console.error('Erro ao atualizar link:', error);
    }
  }, [updateLink, onLinkUpdated]);

  const handleDeleteLink = useCallback(async (linkId: string) => {
    try {
      await deleteLink(linkId);
      onLinkDeleted?.(linkId);
    } catch (error) {
      console.error('Erro ao deletar link:', error);
    }
  }, [deleteLink, onLinkDeleted]);

  const handleToggleActive = useCallback(async (linkId: string, isActive: boolean) => {
    try {
      await updateLink(linkId, { isActive });
    } catch (error) {
      console.error('Erro ao alterar status do link:', error);
    }
  }, [updateLink]);

  const handleCopyLink = useCallback(async (link: SocialLink) => {
    try {
      await navigator.clipboard.writeText(link.shortUrl);
      // Aqui você pode adicionar uma notificação de sucesso
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  }, []);

  const handleBulkAction = useCallback(async (action: 'delete' | 'activate' | 'deactivate') => {
    try {
      if (action === 'delete') {
        await Promise.all(selectedLinks.map(id => deleteLink(id)));
      } else if (action === 'activate') {
        await Promise.all(selectedLinks.map(id => updateLink(id, { isActive: true })));
      } else if (action === 'deactivate') {
        await Promise.all(selectedLinks.map(id => updateLink(id, { isActive: false })));
      }
      setSelectedLinks([]);
    } catch (error) {
      console.error(`Erro na ação em lote ${action}:`, error);
    }
  }, [selectedLinks, deleteLink, updateLink]);

  // ===== MEMOIZED VALUES =====

  const filteredLinks = useMemo(() => {
    let filtered = memoizedFilter(links, debouncedSearch, ['title', 'description', 'originalUrl']);
    
    if (selectedTag) {
      filtered = filtered.filter(link => link.tags.includes(selectedTag));
    }
    
    return filtered;
  }, [links, memoizedFilter, debouncedSearch, selectedTag]);

  const linkStats = useMemo(() => {
    return {
      total: links.length,
      active: links.filter(l => l.isActive).length,
      totalClicks: links.reduce((sum, link) => sum + link.clickCount, 0),
      topPerformer: links.reduce((top, link) => 
        link.clickCount > top.clickCount ? link : top, 
        { clickCount: 0, title: 'Nenhum' }
      )
    };
  }, [links]);

  const topLinks = useMemo(() => {
    return links
      .filter(l => l.clickCount > 0)
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 5);
  }, [links]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    links.forEach(link => link.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [links]);

  // ===== RENDER STATES =====

  if (loading) {
    return <SocialBufferLoadingSkeleton type="links" />;
  }

  if (error) {
    return (
      <SocialBufferErrorState 
        error={error}
        onRetry={() => window.location.reload()}
        title="Erro ao carregar links"
      />
    );
  }

  if (links.length === 0) {
    return (
      <SocialBufferEmptyState
        title="Nenhum link encontrado"
        description="Crie seu primeiro link encurtado para começar a rastrear cliques"
        actionText="Criar Link"
        onAction={() => setShowCreateModal(true)}
      />
    );
  }

  return (
    <PageTransition>
      <div className={`social-links-manager ${className}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gerenciador de Links
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie seus links encurtados e rastreie cliques
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Novo Link
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">{linkStats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">{linkStats.active}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Ativos</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-purple-600">{linkStats.totalClicks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total de Cliques</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-orange-600">{linkStats.topPerformer.clickCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Top: {linkStats.topPerformer.title}</div>
          </Card>
        </div>

        {/* Top Links */}
        {topLinks.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Links Mais Clicados
            </h3>
            <div className="space-y-2">
              {topLinks.map((link, index) => (
                <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-blue-600">#{index + 1}</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{link.title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{link.shortUrl}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">{link.clickCount}</div>
                    <div className="text-xs text-gray-500">cliques</div>
                  </div>
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
                placeholder="Buscar links..."
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todas as tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <select
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              >
                <option value="">Todos os status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
                <option value="popular">Populares</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Bulk Actions */}
        {selectedLinks.length > 0 && (
          <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 dark:text-blue-300">
                {selectedLinks.length} link(s) selecionado(s)
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

        {/* Links List */}
        <div className="space-y-4">
          {filteredLinks.map((link) => (
            <Card key={link.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedLinks.includes(link.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLinks(prev => [...prev, link.id]);
                        } else {
                          setSelectedLinks(prev => prev.filter(id => id !== link.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {link.title}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      link.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {link.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <strong>Original:</strong> {link.originalUrl}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      <strong>Encurtado:</strong> {link.shortUrl}
                    </div>
                  </div>
                  
                  {link.description && (
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {link.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Cliques: {link.clickCount}</span>
                    <span>Plataformas: {link.platforms.join(', ')}</span>
                    {link.tags.length > 0 && (
                      <span>Tags: {link.tags.join(', ')}</span>
                    )}
                  </div>
                  
                  {link.lastClicked && (
                    <div className="text-xs text-gray-500">
                      Último clique: {link.lastClicked.toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleCopyLink(link)}
                    className="bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    Copiar
                  </Button>
                  <Button
                    onClick={() => handleToggleActive(link.id, !link.isActive)}
                    className={link.isActive ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}
                    size="sm"
                  >
                    {link.isActive ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button
                    onClick={() => setEditingLink(link)}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDeleteLink(link.id)}
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

export default SocialLinksManager;
