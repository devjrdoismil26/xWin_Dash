import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

// Mock do módulo SocialBuffer com implementação fragmentada
const SocialBuffer = () => {
  const [posts, setPosts] = React.useState([
    { id: '1', content: 'Novo produto lançado! 🚀', platform: 'Instagram', status: 'scheduled', scheduledAt: '2024-01-25T15:00:00Z', engagement: 1200 },
    { id: '2', content: 'Dicas de marketing digital', platform: 'LinkedIn', status: 'published', publishedAt: '2024-01-20T10:00:00Z', engagement: 850 },
    { id: '3', content: 'Promoção especial!', platform: 'Facebook', status: 'draft', engagement: 0 }
  ]);
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPlatform, setSelectedPlatform] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [isLoading, setIsLoading] = React.useState(false);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform;
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const createPost = (postData: any) => {
    const newPost = {
      id: (posts.length + 1).toString(),
      ...postData,
      created_at: new Date().toISOString()
    };
    setPosts([...posts, newPost]);
  };

  const updatePostStatus = (id: string, status: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status } : p));
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const schedulePost = (id: string, scheduledAt: string) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      updatePostStatus(id, 'scheduled');
      setPosts(posts.map(p => p.id === id ? { ...p, scheduledAt } : p));
    }
  };

  const publishPost = (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      updatePostStatus(id, 'published');
      setPosts(posts.map(p => p.id === id ? { ...p, publishedAt: new Date().toISOString() } : p));
    }
  };

  const refreshPosts = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getStats = () => {
    const total = posts.length;
    const published = posts.filter(p => p.status === 'published').length;
    const scheduled = posts.filter(p => p.status === 'scheduled').length;
    const drafts = posts.filter(p => p.status === 'draft').length;
    const totalEngagement = posts.reduce((sum, p) => sum + p.engagement, 0);
    return { total, published, scheduled, drafts, totalEngagement };
  };

  const stats = getStats();

  return (
    <div data-testid="socialbuffer-module">
      <h1>Social Buffer Management</h1>
      
      {/* Estatísticas */}
      <div data-testid="stats">
        <div>Total de posts: {stats.total}</div>
        <div>Posts publicados: {stats.published}</div>
        <div>Posts agendados: {stats.scheduled}</div>
        <div>Rascunhos: {stats.drafts}</div>
        <div>Engajamento total: {stats.totalEngagement}</div>
      </div>

      {/* Filtros */}
      <div data-testid="filters">
        <input
          type="text"
          placeholder="Buscar posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-input"
        />
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          data-testid="platform-filter"
        >
          <option value="all">Todas as plataformas</option>
          <option value="Instagram">Instagram</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Facebook">Facebook</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          data-testid="status-filter"
        >
          <option value="all">Todos os status</option>
          <option value="published">Publicado</option>
          <option value="scheduled">Agendado</option>
          <option value="draft">Rascunho</option>
        </select>
      </div>

      {/* Ações */}
      <div data-testid="actions">
        <button onClick={() => createPost({ content: 'Post agendado', platform: 'LinkedIn', status: 'scheduled', scheduledAt: '2024-01-25T15:00:00Z', engagement: 0 })} data-testid="create-post-btn">
          Criar Post
        </button>
        <button onClick={refreshPosts} data-testid="refresh-btn" disabled={isLoading}>
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {/* Lista de posts */}
      <div data-testid="posts-list">
        {filteredPosts.map(post => (
          <div key={post.id} data-testid={`post-${post.id}`} className="post-card">
            <h3>Post #{post.id}</h3>
            <p>Conteúdo: {post.content}</p>
            <p>Plataforma: {post.platform}</p>
            <p>Status: {post.status}</p>
            <p>Engajamento: {post.engagement}</p>
            {post.scheduledAt && <p>Agendado para: {new Date(post.scheduledAt).toLocaleString()}</p>}
            {post.publishedAt && <p>Publicado em: {new Date(post.publishedAt).toLocaleString()}</p>}
            <div>
              {post.status === 'draft' && (
                <button onClick={() => schedulePost(post.id, '2024-01-25T15:00:00Z')} data-testid={`schedule-${post.id}`}>
                  Agendar
                </button>
              )}
              {post.status === 'scheduled' && (
                <button onClick={() => publishPost(post.id)} data-testid={`publish-${post.id}`}>
                  Publicar Agora
                </button>
              )}
              <button onClick={() => updatePostStatus(post.id, post.status === 'published' ? 'draft' : 'published')} data-testid={`toggle-status-${post.id}`}>
                Alternar Status
              </button>
              <button onClick={() => deletePost(post.id)} data-testid={`delete-${post.id}`}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {isLoading && <div data-testid="loading">Carregando posts...</div>}
    </div>
  );
};

describe('SocialBuffer Module', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  it('should render socialbuffer module', () => {
    render(<SocialBuffer />, { queryClient });
    expect(screen.getByTestId('socialbuffer-module')).toBeInTheDocument();
    expect(screen.getByText('Social Buffer Management')).toBeInTheDocument();
  });

  it('should display post statistics', () => {
    render(<SocialBuffer />, { queryClient });
    expect(screen.getByTestId('stats')).toBeInTheDocument();
    expect(screen.getByText('Total de posts: 3')).toBeInTheDocument();
    expect(screen.getByText('Posts publicados: 1')).toBeInTheDocument();
    expect(screen.getByText('Posts agendados: 1')).toBeInTheDocument();
    expect(screen.getByText('Rascunhos: 1')).toBeInTheDocument();
    expect(screen.getByText('Engajamento total: 2050')).toBeInTheDocument();
  });

  it('should filter posts by search term', () => {
    render(<SocialBuffer />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'produto' } });
    expect(screen.getByTestId('post-1')).toBeInTheDocument();
    expect(screen.queryByTestId('post-2')).not.toBeInTheDocument();
  });

  it('should filter posts by platform', () => {
    render(<SocialBuffer />, { queryClient });
    const platformFilter = screen.getByTestId('platform-filter');
    fireEvent.change(platformFilter, { target: { value: 'Instagram' } });
    expect(screen.getByTestId('post-1')).toBeInTheDocument();
    expect(screen.queryByTestId('post-2')).not.toBeInTheDocument();
  });

  it('should filter posts by status', () => {
    render(<SocialBuffer />, { queryClient });
    const statusFilter = screen.getByTestId('status-filter');
    fireEvent.change(statusFilter, { target: { value: 'published' } });
    expect(screen.getByTestId('post-2')).toBeInTheDocument();
    expect(screen.queryByTestId('post-1')).not.toBeInTheDocument();
  });

  it('should create new post', () => {
    render(<SocialBuffer />, { queryClient });
    const createButton = screen.getByTestId('create-post-btn');
    fireEvent.click(createButton);
    expect(screen.getByTestId('post-4')).toBeInTheDocument();
    expect(screen.getByText('Post #4')).toBeInTheDocument();
  });

  it('should schedule draft post', () => {
    render(<SocialBuffer />, { queryClient });
    const scheduleButton = screen.getByTestId('schedule-3');
    fireEvent.click(scheduleButton);
    const post3 = screen.getByTestId('post-3');
    expect(post3).toHaveTextContent('scheduled');
  });

  it('should publish scheduled post', () => {
    render(<SocialBuffer />, { queryClient });
    const publishButton = screen.getByTestId('publish-1');
    fireEvent.click(publishButton);
    const post1 = screen.getByTestId('post-1');
    expect(post1).toHaveTextContent('published');
  });

  it('should toggle post status', () => {
    render(<SocialBuffer />, { queryClient });
    const toggleButton = screen.getByTestId('toggle-status-2');
    fireEvent.click(toggleButton);
    const post2 = screen.getByTestId('post-2');
    expect(post2).toHaveTextContent('draft');
  });

  it('should delete post', () => {
    render(<SocialBuffer />, { queryClient });
    const deleteButton = screen.getByTestId('delete-1');
    fireEvent.click(deleteButton);
    expect(screen.queryByTestId('post-1')).not.toBeInTheDocument();
  });

  it('should refresh posts', async () => {
    render(<SocialBuffer />, { queryClient });
    const refreshButton = screen.getByTestId('refresh-btn');
    fireEvent.click(refreshButton);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  it('should display post details correctly', () => {
    render(<SocialBuffer />, { queryClient });
    expect(screen.getByText('Post #1')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo: Novo produto lançado! 🚀')).toBeInTheDocument();
    expect(screen.getByText('Plataforma: Instagram')).toBeInTheDocument();
    const post1 = screen.getByTestId('post-1');
    expect(post1).toHaveTextContent('scheduled');
  });

  it('should handle multiple filters simultaneously', () => {
    render(<SocialBuffer />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    const platformFilter = screen.getByTestId('platform-filter');
    const statusFilter = screen.getByTestId('status-filter');
    
    fireEvent.change(searchInput, { target: { value: 'marketing' } });
    fireEvent.change(platformFilter, { target: { value: 'LinkedIn' } });
    fireEvent.change(statusFilter, { target: { value: 'published' } });
    
    expect(screen.getByTestId('post-2')).toBeInTheDocument();
    expect(screen.queryByTestId('post-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('post-3')).not.toBeInTheDocument();
  });

  it('should update statistics after post creation', () => {
    render(<SocialBuffer />, { queryClient });
    const createButton = screen.getByTestId('create-post-btn');
    fireEvent.click(createButton);
    
    expect(screen.getByText('Total de posts: 4')).toBeInTheDocument();
    expect(screen.getByText('Posts agendados: 2')).toBeInTheDocument();
  });

  it('should update statistics after post deletion', () => {
    render(<SocialBuffer />, { queryClient });
    const deleteButton = screen.getByTestId('delete-1');
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('Total de posts: 2')).toBeInTheDocument();
    expect(screen.getByText('Posts agendados: 0')).toBeInTheDocument();
  });
});
