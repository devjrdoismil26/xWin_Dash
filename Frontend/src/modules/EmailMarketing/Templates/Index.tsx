import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import Input from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import Pagination from '@/shared/components/ui/Pagination';
import { FileText, Plus, Search, Edit, Trash2, Copy, Eye, Tag, Calendar } from 'lucide-react';
import { useEmailTemplates, EmailTemplate } from '../hooks/useEmailTemplates';
const EmailMarketingTemplatesIndex: React.FC = () => {
  const {
    templates,
    loading,
    error,
    pagination,
    fetchTemplates,
    deleteTemplate,
    duplicateTemplate,
    getTemplateCategories
  } = useEmailTemplates();

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    page: 1,
    per_page: 15
  });

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchTemplates(filters);

    getTemplateCategories().then(setCategories);

  }, [fetchTemplates, filters, getTemplateCategories]);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));};

  const handleCategoryFilter = (value: string) => {
    setFilters(prev => ({ ...prev, category: value, page: 1 }));};

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));};

  const handleAction = async (action: string, template: EmailTemplate) => {
    try {
      switch (action) {
        case 'duplicate': {
          const newName = prompt('Nome do template duplicado:', `${template.name} (Cópia)`);

          if (newName) {
            await duplicateTemplate(template.id, newName);

          }
          break;
        }
        case 'delete':
          if (confirm('Tem certeza que deseja excluir este template?')) {
            await deleteTemplate(template.id);

          }
          break;
      } catch (error) {
      console.error('Erro ao executar ação do template:', error);

    } ;

  if (loading && templates.length === 0) {
    return (
        <>
      <AppLayout
        title="Templates de Email"
        subtitle="Gerencie seus templates de email marketing"
        showSidebar={ true }
        useGlassmorphismSidebar={ true } />
      <Head title="Templates de Email - xWin Dash" / />
        <div className=" ">$2</div><div className=" ">$2</div><div className="h-32 bg-gray-200 rounded-lg" /></div></AppLayout>);

  }
  return (
        <>
      <AppLayout
      title="Templates de Email"
      subtitle="Gerencie seus templates de email marketing"
      showSidebar={ true }
      useGlassmorphismSidebar={ true }
      headerActions={ <Button />
      <Plus className="w-4 h-4 mr-2" />
          Novo Template
        </Button>
  }>
      <Head title="Templates de Email - xWin Dash" / />
      <div className="{/* Filters */}">$2</div>
        <Card className="p-6" />
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar templates..."
                  value={ filters.search }
                  onChange={ (e: unknown) => handleSearch(e.target.value) }
                  className="pl-10" /></div><div className=" ">$2</div><Select
                value={ filters.category }
                onValueChange={ handleCategoryFilter }
                placeholder="Filtrar por categoria" />
                <option value="">Todas as categorias</option>
                {(categories || []).map((category: unknown) => (
                  <option key={category} value={ category } />
                    {category}
                  </option>
                ))}
              </Select></div></Card>
        {/* Templates Grid */}
        {templates.length === 0 ? (
          <Card />
            <Card.Content className="text-center py-12" />
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template encontrado</h3>
              <p className="text-gray-600 mb-6">Crie seu primeiro template para começar</p>
              <Button />
                <Plus className="w-4 h-4 mr-2" />
                Novo Template
              </Button>
            </Card.Content>
      </Card>
    </>
  ) : (
          <div className="{(templates || []).map((template: unknown) => (">$2</div>
              <Card key={template.id} className="hover:shadow-lg transition-shadow" />
                <Card.Content className="p-6" />
                  <div className=" ">$2</div><div className=" ">$2</div><h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                      {template.category && (
                        <Badge variant="outline" className="text-xs" />
                          <Tag className="w-3 h-3 mr-1" />
                          {template.category}
                        </Badge>
                      )}
                    </div>
                    <div className=" ">$2</div><Button
                        variant="outline"
                        size="sm"
                        onClick={ () => handleAction('view', template)  }>
                        <Eye className="w-4 h-4" /></Button><Button
                        variant="outline"
                        size="sm"
                        onClick={ () => handleAction('edit', template)  }>
                        <Edit className="w-4 h-4" /></Button></div>
                  <div className=" ">$2</div><div className=" ">$2</div><Calendar className="w-3 h-3 mr-1" />
                      Criado em {new Date(template.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    {template.tags && template.tags.length > 0 && (
                      <div className="{template.tags.slice(0, 3).map((tag: unknown, index: unknown) => (">$2</div>
                          <Badge key={index} variant="secondary" className="text-xs" />
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs" />
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className=" ">$2</div><div className=" ">$2</div><Button
                        variant="outline"
                        size="sm"
                        onClick={ () => handleAction('duplicate', template)  }>
                        <Copy className="w-4 h-4 mr-1" />
                        Duplicar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={ () => handleAction('delete', template) }
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" /></Button></div>
                    <Button size="sm" />
                      Usar Template
                    </Button></div></Card.Content>
      </Card>
    </>
  ))}
          </div>
        )}
        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className=" ">$2</div><Pagination
              currentPage={ pagination.current_page }
              lastPage={ pagination.last_page }
              onPageChange={ handlePageChange }
            / />
          </div>
        )}
      </div>
    </AppLayout>);};

export default EmailMarketingTemplatesIndex;
