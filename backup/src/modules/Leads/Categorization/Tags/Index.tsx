import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from "@/components/ui/Card";
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SimpleSelect from '@/components/ui/SimpleSelect';
import Badge from '@/components/ui/Badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Tags, 
  Edit, 
  Trash2, 
  MoreVertical,
  TrendingUp,
  Hash
} from 'lucide-react';
const TagsIndex: React.FC<{ 
  auth?: any; 
  tags?: any[]; 
  filters?: any;
  pagination?: any;
  stats?: any;
}> = ({ 
  auth, 
  tags = [], 
  filters = {},
  pagination = {},
  stats = {}
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [sortBy, setSortBy] = useState(filters.sort || 'name');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const handleSearch = () => {
    router.get('/categorization/tags', {
      search: searchTerm,
      sort: sortBy
    });
  };
  const handleDelete = (tagId: number) => {
    if (confirm('Tem certeza que deseja excluir esta tag?')) {
      router.delete(`/categorization/tags/${tagId}`);
    }
  };
  const handleBulkDelete = () => {
    if (selectedTags.length === 0) return;
    if (confirm(`Tem certeza que deseja excluir ${selectedTags.length} tags selecionadas?`)) {
      router.post('/categorization/tags/bulk-delete', {
        tag_ids: selectedTags
      });
      setSelectedTags([]);
    }
  };
  const toggleTagSelection = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };
  const selectAllTags = () => {
    if (selectedTags.length === tags.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(tags.map(tag => tag.id));
    }
  };
  const getUsageColor = (count: number) => {
    if (count >= 50) return 'success';
    if (count >= 20) return 'warning';
    if (count >= 5) return 'info';
    return 'secondary';
  };
  return (
    <AppLayout
      title="Tags"
      subtitle="Gerencie todas as tags do sistema"
      showSidebar={true}
      showBreadcrumbs={true}
      breadcrumbs={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Categorização', href: '/categorization' },
        { name: 'Tags', href: '/categorization/tags', current: true }
      ]}
      actions={
        <div className="flex items-center gap-3">
          {selectedTags.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleBulkDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir ({selectedTags.length})
            </Button>
          )}
          <Button href="/categorization/tags/create">
            <Plus className="h-4 w-4 mr-2" />
            Nova Tag
          </Button>
        </div>
      }
    >
      <Head title="Tags - xWin Dash" />
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tags</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total_tags || tags.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Tags className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card.Content>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tags Populares</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.popular_tags || 0}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card.Content>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uso Total</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total_usage || 0}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Hash className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Card.Content>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tags Órfãs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.orphan_tags || 0}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Tags className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
        {/* Filtros */}
        <Card>
          <Card.Content className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <SimpleSelect 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-[160px]"
              >
                <option value="name">Nome A-Z</option>
                <option value="-name">Nome Z-A</option>
                <option value="usage_count">Menos Usadas</option>
                <option value="-usage_count">Mais Usadas</option>
                <option value="created_at">Mais Antigas</option>
                <option value="-created_at">Mais Recentes</option>
              </SimpleSelect>
              <Button onClick={handleSearch}>
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </Card.Content>
        </Card>
        {/* Lista de Tags */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <Card.Title>Tags ({tags.length})</Card.Title>
                <Card.Description>
                  Gerencie as tags utilizadas para classificação de conteúdo
                </Card.Description>
              </div>
              {tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTags.length === tags.length}
                    onChange={selectAllTags}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">Selecionar todos</span>
                </div>
              )}
            </div>
          </Card.Header>
          <Card.Content>
            {tags.length > 0 ? (
              <div className="space-y-4">
                {tags.map((tag) => (
                  <div 
                    key={tag.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => toggleTagSelection(tag.id)}
                        className="rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            #{tag.name}
                          </span>
                          <Badge variant={getUsageColor(tag.usage_count || 0)}>
                            {tag.usage_count || 0} usos
                          </Badge>
                          {tag.color && (
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300" 
                              style={{ backgroundColor: tag.color }}
                            />
                          )}
                        </div>
                        {tag.description && (
                          <p className="text-gray-600 mb-2">{tag.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Criado em {new Date(tag.created_at).toLocaleDateString('pt-BR')}</span>
                          {tag.last_used_at && (
                            <>
                              <span>•</span>
                              <span>Último uso: {new Date(tag.last_used_at).toLocaleDateString('pt-BR')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.visit(`/categorization/tags/${tag.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(tag.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Tags className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma tag encontrada</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando sua primeira tag'
                  }
                </p>
                <Button href="/categorization/tags/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Tag
                </Button>
              </div>
            )}
          </Card.Content>
        </Card>
        {/* Paginação */}
        {pagination && pagination.total > pagination.per_page && (
          <Card>
            <Card.Content className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Mostrando {pagination.from} a {pagination.to} de {pagination.total} tags
                </p>
                <div className="flex items-center gap-2">
                  {pagination.prev_page_url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.visit(pagination.prev_page_url)}
                    >
                      Anterior
                    </Button>
                  )}
                  {pagination.next_page_url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.visit(pagination.next_page_url)}
                    >
                      Próximo
                    </Button>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};
export default TagsIndex;
