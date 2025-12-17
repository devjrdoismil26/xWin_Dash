import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import Input from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import Pagination from '@/shared/components/ui/Pagination';
import { Target, Plus, Search, Edit, Trash2, Users, Eye, RefreshCw, Zap, Calendar, Settings } from 'lucide-react';
import { useEmailSegments, EmailSegment } from '../hooks/useEmailSegments';
const EmailMarketingSegmentsIndex: React.FC = () => {
  const {
    segments,
    loading,
    error,
    pagination,
    fetchSegments,
    deleteSegment,
    refreshSegment
  } = useEmailSegments();

  const [filters, setFilters] = useState({
    search: '',
    is_dynamic: '',
    page: 1,
    per_page: 15
  });

  useEffect(() => {
    fetchSegments(filters);

  }, [fetchSegments, filters]);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));};

  const handleTypeFilter = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      is_dynamic: value === 'dynamic' ? 'true' : value === 'static' ? 'false' : '',
      page: 1 
    }));};

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));};

  const handleAction = async (action: string, segment: EmailSegment) => {
    try {
      switch (action) {
        case 'refresh':
          await refreshSegment(segment.id);

          break;
        case 'delete':
          if (confirm('Tem certeza que deseja excluir este segmento?')) {
            await deleteSegment(segment.id);

          }
          break;
      } catch (error) {
      console.error('Erro ao executar ação do segmento:', error);

    } ;

  if (loading && segments.length === 0) {
    return (
        <>
      <AppLayout
        title="Segmentos de Email"
        subtitle="Gerencie segmentos de público para suas campanhas"
        showSidebar={ true }
        useGlassmorphismSidebar={ true } />
      <Head title="Segmentos de Email - xWin Dash" / />
        <div className=" ">$2</div><div className=" ">$2</div><div className="h-32 bg-gray-200 rounded-lg" /></div></AppLayout>);

  }
  return (
        <>
      <AppLayout
      title="Segmentos de Email"
      subtitle="Gerencie segmentos de público para suas campanhas"
      showSidebar={ true }
      useGlassmorphismSidebar={ true }
      headerActions={ <Button />
      <Plus className="w-4 h-4 mr-2" />
          Criar Segmento
        </Button>
  }>
      <Head title="Segmentos de Email - xWin Dash" / />
      <div className="{/* Filters */}">$2</div>
        <Card className="p-6" />
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar segmentos..."
                  value={ filters.search }
                  onChange={ (e: unknown) => handleSearch(e.target.value) }
                  className="pl-10" /></div><div className=" ">$2</div><Select
                value={ filters.is_dynamic === 'true' ? 'dynamic' : filters.is_dynamic === 'false' ? 'static' : '' }
                onValueChange={ handleTypeFilter }
                placeholder="Filtrar por tipo" />
                <option value="">Todos os tipos</option>
                <option value="dynamic">Dinâmicos</option>
                <option value="static">Estáticos</option></Select></div>
        </Card>
        {/* Segments List */}
        <Card />
          <Card.Content className="p-0" />
            {segments.length === 0 ? (
              <div className=" ">$2</div><Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum segmento encontrado</h3>
                <p className="text-gray-600 mb-6">Crie seu primeiro segmento para começar</p>
                <Button />
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Segmento
                </Button>
      </div>
    </>
  ) : (
              <div className=" ">$2</div><table className="min-w-full" />
                  <thead className="backdrop-blur-xl bg-white/10 border-white/20 border-b" />
                    <tr />
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Segmento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Inscritos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Criado em
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Ações
                      </th></tr></thead>
                  <tbody className="bg-white divide-y divide-gray-200" />
                    {(segments || []).map((segment: unknown) => (
                      <tr key={segment.id} className="hover:bg-gray-50" />
                        <td className="px-6 py-4 whitespace-nowrap" />
                          <div>
           
        </div><div className="text-sm font-medium text-gray-900">{segment.name}</div>
                            <div className="text-sm text-gray-500">{segment.description || 'Sem descrição'}</div></td><td className="px-6 py-4 whitespace-nowrap" />
                          <Badge 
                            variant={ segment.is_dynamic ? 'default' : 'outline' }
                            className="text-xs" />
                            {segment.is_dynamic ? (
                              <>
                                <Zap className="w-3 h-3 mr-1" />
                                Dinâmico
                              </>
                            ) : (
                              <>
                                <Users className="w-3 h-3 mr-1" />
                                Estático
                              </>
                            )}
                          </Badge></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" />
                          <div className=" ">$2</div><Users className="w-4 h-4 mr-1 text-gray-400" />
                            {segment.subscribers_count?.toLocaleString() || 0}
                          </div></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                          <div className=" ">$2</div><Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {new Date(segment.created_at).toLocaleDateString('pt-BR')}
                          </div></td><td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" />
                          <div className=" ">$2</div><Button
                              variant="outline"
                              size="sm"
                              onClick={ () => handleAction('view', segment)  }>
                              <Eye className="w-4 h-4" /></Button><Button
                              variant="outline"
                              size="sm"
                              onClick={ () => handleAction('edit', segment)  }>
                              <Edit className="w-4 h-4" />
                            </Button>
                            {segment.is_dynamic && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={ () => handleAction('refresh', segment) }
                                title="Recalcular segmento"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={ () => handleAction('delete', segment) }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" /></Button></div></td></tr>
                    ))}
                  </tbody></table></div>
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
          </Card.Content>
        </Card>
        {/* Segment Types Info */}
        <div className=" ">$2</div><Card className="p-6" />
            <div className=" ">$2</div><div className=" ">$2</div><Zap className="w-5 h-5 text-blue-600" /></div><h3 className="font-semibold text-gray-900">Segmentos Dinâmicos</h3></div><p className="text-sm text-gray-600 mb-4" />
              Segmentos que são atualizados automaticamente baseados em regras definidas. 
              Os inscritos são recalculados em tempo real.
            </p>
            <ul className="text-xs text-gray-500 space-y-1" />
              <li>• Atualização automática</li>
              <li>• Baseado em regras</li>
              <li>• Tempo real</li></ul></Card>
          <Card className="p-6" />
            <div className=" ">$2</div><div className=" ">$2</div><Users className="w-5 h-5 text-green-600" /></div><h3 className="font-semibold text-gray-900">Segmentos Estáticos</h3></div><p className="text-sm text-gray-600 mb-4" />
              Segmentos com lista fixa de inscritos. Você adiciona e remove inscritos manualmente.
            </p>
            <ul className="text-xs text-gray-500 space-y-1" />
              <li>• Lista fixa</li>
              <li>• Controle manual</li>
              <li>• Importação CSV</li></ul></Card></div></AppLayout>);};

export default EmailMarketingSegmentsIndex;
