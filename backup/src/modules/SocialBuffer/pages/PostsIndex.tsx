import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Plus, Calendar, Send, Edit, Trash2, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import useSocialBuffer from '../hooks/useSocialBuffer';
import CreatePostModal from '../components/CreatePostModal';
const PostsIndexPage: React.FC<{ auth?: any }> = ({ auth }) => {
  const {
    posts,
    postsLoading,
    postsError,
    socialAccounts,
    fetchPosts,
    fetchSocialAccounts,
    deletePost,
    publishImmediately,
    schedulePost,
    getConnectedAccounts,
    getScheduledPosts,
    getPublishedPosts,
    getDraftPosts,
  } = useSocialBuffer();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  useEffect(() => {
    fetchPosts();
    fetchSocialAccounts();
  }, []);
  const connectedAccounts = getConnectedAccounts();
  const scheduledPosts = getScheduledPosts();
  const publishedPosts = getPublishedPosts();
  const draftPosts = getDraftPosts();
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'draft':
        return <Edit className="w-4 h-4 text-gray-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };
  const getStatusBadge = (status: string) => {
    const variants = {
      published: 'success',
      scheduled: 'info',
      draft: 'secondary',
      failed: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  const filteredPosts = posts.filter(post => {
    if (selectedStatus === 'all') return true;
    return post.status === selectedStatus;
  });
  const handleDeletePost = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      try {
        await deletePost(id);
      } catch (error) {
        console.error('Erro ao deletar post:', error);
      }
    }
  };
  const handlePublishNow = async (id: number) => {
    try {
      await publishImmediately(id);
    } catch (error) {
      console.error('Erro ao publicar imediatamente:', error);
    }
  };
  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Posts - Social Buffer" />
      <PageLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
              <p className="text-gray-600">Gerencie e agende seus posts nas redes sociais</p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Post
            </Button>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <Card.Content className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Send className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Agendados</p>
                    <p className="text-2xl font-bold text-blue-600">{scheduledPosts.length}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Publicados</p>
                    <p className="text-2xl font-bold text-green-600">{publishedPosts.length}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rascunhos</p>
                    <p className="text-2xl font-bold text-gray-600">{draftPosts.length}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Edit className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
          {/* Connected Accounts */}
          {connectedAccounts.length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title>Contas Conectadas</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="flex flex-wrap gap-2">
                  {connectedAccounts.map((account) => (
                    <Badge key={account.id} variant="outline">
                      {account.platform} - {account.username}
                    </Badge>
                  ))}
                </div>
              </Card.Content>
            </Card>
          )}
          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'Todos' },
              { key: 'draft', label: 'Rascunhos' },
              { key: 'scheduled', label: 'Agendados' },
              { key: 'published', label: 'Publicados' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedStatus(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedStatus === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Posts List */}
          <Card>
            <Card.Header>
              <Card.Title>Lista de Posts</Card.Title>
            </Card.Header>
            <Card.Content>
              {postsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : postsError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">Erro ao carregar posts: {postsError}</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-8">
                  <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum post encontrado</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Criar Primeiro Post
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(post.status)}
                            {getStatusBadge(post.status)}
                            {post.platform && (
                              <Badge variant="outline">{post.platform}</Badge>
                            )}
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2">{post.title || 'Sem título'}</h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Criado em: {new Date(post.created_at).toLocaleDateString()}</span>
                            {post.scheduled_at && (
                              <span>Agendado para: {new Date(post.scheduled_at).toLocaleString()}</span>
                            )}
                            {post.published_at && (
                              <span>Publicado em: {new Date(post.published_at).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {post.status === 'draft' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePublishNow(post.id)}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Content>
          </Card>
          {/* Create Post Modal */}
          <CreatePostModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
          />
        </div>
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default PostsIndexPage;
