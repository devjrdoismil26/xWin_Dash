/**
 * FE-003: Interface Completa de Categorização
 * @module modules/Categorization/pages/CategoriesIndexPage
 * @description
 * Interface completa para gerenciamento de categorias e tags.
 * Consome APIs reais do backend.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Tag, Folder, Edit, Trash2, MoreVertical, Filter } from 'lucide-react';
import { apiClient } from '@/services';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { PermissionGate } from './components/guards';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  color?: string;
  icon?: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string; }

interface Tag {
  id: string;
  name: string;
  category_id?: string;
  color?: string;
  created_at: string; }

/**
 * FE-003: Interface completa de categorização
 */
const CategoriesIndexPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [tags, setTags] = useState<Tag[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');

  // FE-003: Carregar categorias da API real
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await apiClient.get<{ success: boolean; data: Category[] }>('/categories');

      if (response.data.success && (response as any).data.data) {
        setCategories(response.data.data);

      } else {
        setCategories([]);

      } catch (err: unknown) {
      setError(err.message || 'Erro ao carregar categorias');

      setCategories([]);

    } finally {
      setLoading(false);

    } , []);

  // FE-003: Carregar tags da API real
  const loadTags = useCallback(async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: Tag[] }>('/tags');

      if (response.data.success && (response as any).data.data) {
        setTags(response.data.data);

      } else {
        setTags([]);

      } catch (err: unknown) {
      setError(err.message || 'Erro ao carregar tags');

      setTags([]);

    } , []);

  useEffect(() => {
    loadCategories();

    loadTags();

  }, [loadCategories, loadTags]);

  // Filtrar categorias
  const filteredCategories = categories.filter(category =>
    !searchQuery ||
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase()));

  // Filtrar tags
  const filteredTags = tags.filter(tag =>
    !searchQuery ||
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Deletar categoria
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      await apiClient.delete(`/categories/${id}`);

      loadCategories();

    } catch (err: unknown) {
      setError(err.message || 'Erro ao excluir categoria');

    } ;

  // Deletar tag
  const handleDeleteTag = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tag?')) return;

    try {
      await apiClient.delete(`/tags/${id}`);

      loadTags();

    } catch (err: unknown) {
      setError(err.message || 'Erro ao excluir tag');

    } ;

  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold text-gray-900">Categorização</h1>
          <p className="text-gray-600 mt-1" />
            Gerencie categorias e tags para organizar seu conteúdo
          </p></div><PermissionGate permission={ activeTab === 'categories' ? 'categories.create' : 'tags.create' } />
          <Button onClick={() => {
            if (activeTab === 'categories') {
              window.location.href = '/categorization/categories/create';
            } else {
              window.location.href = '/categorization/tags/create';
            } }>
            <Plus className="w-4 h-4 mr-2" />
            {activeTab === 'categories' ? 'Nova Categoria' : 'Nova Tag'}
          </Button></PermissionGate></div>

      {/* Tabs */}
      <div className=" ">$2</div><button
          onClick={ () => setActiveTab('categories') }
          className={cn(
            'px-4 py-2 border-b-2 transition-colors',
            activeTab === 'categories'
              ? 'border-blue-600 text-blue-600 font-medium'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          )  }>
          <Folder className="w-4 h-4 inline mr-2" />
          Categorias ({categories.length})
        </button>
        <button
          onClick={ () => setActiveTab('tags') }
          className={cn(
            'px-4 py-2 border-b-2 transition-colors',
            activeTab === 'tags'
              ? 'border-blue-600 text-blue-600 font-medium'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          )  }>
          <Tag className="w-4 h-4 inline mr-2" />
          Tags ({tags.length})
        </button>
      </div>

      {/* Search */}
      <div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={`Buscar ${activeTab === 'categories' ? 'categorias' : 'tags'}...`}
          value={ searchQuery }
          onChange={ (e: unknown) => setSearchQuery(e.target.value) }
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Content */}
      {loading ? (
        <div className=" ">$2</div><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600">
          ) : error ? (
        </div>
        <Card className="p-8 text-center" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={ activeTab === 'categories' ? loadCategories : loadTags } />
            Tentar Novamente
          </Button>
      </Card>
    </>
  ) : activeTab === 'categories' ? (
        filteredCategories.length === 0 ? (
          <Card className="p-8 text-center" />
            <Folder className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma categoria encontrada</h3>
            <p className="text-gray-600 mb-4" />
              {searchQuery ? 'Tente ajustar sua busca' : 'Comece criando sua primeira categoria'}
            </p>
            <Button onClick={ () => window.location.href = '/categorization/categories/create'  }>
              <Plus className="w-4 h-4 mr-2" />
              Criar Categoria
            </Button>
      </Card>
    </>
  ) : (
          <div className="{filteredCategories.map((category: unknown) => (">$2</div>
              <Card key={category.id} className="p-4 hover:shadow-lg transition-shadow" />
                <div className=" ">$2</div><div className=" ">$2</div><div className="{category.icon && ">$2</div><span className="text-xl">{category.icon}</span>}
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      {!category.is_active && (
                        <Badge variant="outline">Inativa</Badge>
                      )}
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                    )}
                    {category.color && (
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={backgroundColor: category.color } />
          )}
        </div>
                  </div>
                  <div className=" ">$2</div><Button variant="outline" size="sm" onClick={() => window.location.href = `/categorization/categories/${category.id}/edit`}>
                      <Edit className="w-4 h-4" /></Button><Button variant="outline" size="sm" onClick={ () => handleDeleteCategory(category.id)  }>
                      <Trash2 className="w-4 h-4" /></Button></div>
      </Card>
    </>
  ))}
          </div>
        )
      ) : (
        filteredTags.length === 0 ? (
          <Card className="p-8 text-center" />
            <Tag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tag encontrada</h3>
            <p className="text-gray-600 mb-4" />
              {searchQuery ? 'Tente ajustar sua busca' : 'Comece criando sua primeira tag'}
            </p>
            <Button onClick={ () => window.location.href = '/categorization/tags/create'  }>
              <Plus className="w-4 h-4 mr-2" />
              Criar Tag
            </Button>
      </Card>
    </>
  ) : (
          <div className="{filteredTags.map((tag: unknown) => (">$2</div>
              <Card key={tag.id} className="p-4 hover:shadow-lg transition-shadow" />
                <div className=" ">$2</div><div className="{tag.color && (">$2</div>
      <div
                        className="w-4 h-4 rounded-full"
                        style={backgroundColor: tag.color } />
    </>
  )}
        </div>
                    <span className="font-medium text-gray-900">{tag.name}</span></div><Button variant="outline" size="sm" onClick={ () => handleDeleteTag(tag.id)  }>
                    <Trash2 className="w-4 h-4" /></Button></div>
      </Card>
    </>
  ))}
          </div>
        )
      )}
    </div>);};

export default CategoriesIndexPage;
