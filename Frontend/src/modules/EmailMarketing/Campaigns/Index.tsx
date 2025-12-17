import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import Input from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import Pagination from '@/shared/components/ui/Pagination';
import { Mail, Plus, Search, Filter, Send, Calendar, Eye, Edit, Trash2, MoreVertical, Play, Pause, Square } from 'lucide-react';
import { useEmailCampaigns, EmailCampaign } from '../hooks/useEmailCampaigns';
const CampaignsIndex: React.FC = () => {
  const {
    campaigns,
    loading,
    error,
    pagination,
    fetchCampaigns,
    deleteCampaign,
    sendCampaignNow,
    updateCampaignStatus
  } = useEmailCampaigns();

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    per_page: 15
  });

  useEffect(() => {
    fetchCampaigns(filters);

  }, [fetchCampaigns, filters]);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));};

  const handleStatusFilter = (value: string) => {
    setFilters(prev => ({ ...prev, status: value, page: 1 }));};

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));};

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'outline' as const, color: 'text-gray-600' },
      scheduled: { variant: 'outline' as const, color: 'text-blue-600' },
      sending: { variant: 'default' as const, color: 'text-yellow-600' },
      sent: { variant: 'default' as const, color: 'text-green-600' },
      paused: { variant: 'outline' as const, color: 'text-orange-600' },
      cancelled: { variant: 'outline' as const, color: 'text-red-600' } ;

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
              <Badge variant={config.variant} className={`text-xs ${config.color} `} />
        {status}
      </Badge>);};

  const handleAction = async (action: string, campaign: EmailCampaign) => {
    try {
      switch (action) {
        case 'send':
          await sendCampaignNow(campaign.id);

          break;
        case 'pause':
          await updateCampaignStatus(campaign.id, 'paused');

          break;
        case 'resume':
          await updateCampaignStatus(campaign.id, 'scheduled');

          break;
        case 'delete':
          if (confirm('Tem certeza que deseja excluir esta campanha?')) {
            await deleteCampaign(campaign.id);

          }
          break;
      } catch (error) {
      console.error('Erro ao executar ação da campanha:', error);

    } ;

  if (loading && campaigns.length === 0) {
    return (
        <>
      <AppLayout
        title="Campanhas de Email"
        subtitle="Gerencie suas campanhas de email marketing"
        showSidebar={ true }
        useGlassmorphismSidebar={ true } />
      <Head title="Campanhas de Email - xWin Dash" / />
        <div className=" ">$2</div><div className=" ">$2</div><div className="h-32 bg-gray-200 rounded-lg" /></div></AppLayout>);

  }
  return (
        <>
      <AppLayout
      title="Campanhas de Email"
      subtitle="Gerencie suas campanhas de email marketing"
      showSidebar={ true }
      useGlassmorphismSidebar={ true }
      headerActions={ <Button />
      <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
  }>
      <Head title="Campanhas de Email - xWin Dash" / />
      <div className="{/* Filters */}">$2</div>
        <Card className="p-6" />
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar campanhas..."
                  value={ filters.search }
                  onChange={ (e: unknown) => handleSearch(e.target.value) }
                  className="pl-10" /></div><div className=" ">$2</div><Select
                value={ filters.status }
                onValueChange={ handleStatusFilter }
                placeholder="Filtrar por status" />
                <option value="">Todos os status</option>
                <option value="draft">Rascunho</option>
                <option value="scheduled">Agendada</option>
                <option value="sending">Enviando</option>
                <option value="sent">Enviada</option>
                <option value="paused">Pausada</option>
                <option value="cancelled">Cancelada</option></Select></div>
        </Card>
        {/* Campaigns List */}
        <Card />
          <Card.Content className="p-0" />
            {campaigns.length === 0 ? (
              <div className=" ">$2</div><Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma campanha encontrada</h3>
                <p className="text-gray-600 mb-6">Crie sua primeira campanha para começar</p>
                <Button />
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Campanha
                </Button>
      </div>
    </>
  ) : (
              <div className=" ">$2</div><table className="min-w-full" />
                  <thead className="backdrop-blur-xl bg-white/10 border-white/20 border-b" />
                    <tr />
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Campanha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Agendada para
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Métricas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Criada em
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" />
                        Ações
                      </th></tr></thead>
                  <tbody className="bg-white divide-y divide-gray-200" />
                    {(campaigns || []).map((campaign: unknown) => (
                      <tr key={campaign.id} className="hover:bg-gray-50" />
                        <td className="px-6 py-4 whitespace-nowrap" />
                          <div>
           
        </div><div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500">{campaign.subject}</div></td><td className="px-6 py-4 whitespace-nowrap" />
                          {getStatusBadge(campaign.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" />
                          {campaign.scheduled_at 
                            ? new Date(campaign.scheduled_at).toLocaleString('pt-BR')
                            : '-'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" />
                          {campaign.metrics ? (
                            <div className=" ">$2</div><span>{campaign.metrics.sent} enviados</span>
                              <span>{campaign.metrics.opened} abertos</span>
                              <span>{campaign.metrics.clicked} cliques</span>
      </div>
    </>
  ) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" />
                          {new Date(campaign.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" />
                          <div className=" ">$2</div><Button
                              variant="outline"
                              size="sm"
                              onClick={ () => handleAction('view', campaign)  }>
                              <Eye className="w-4 h-4" /></Button><Button
                              variant="outline"
                              size="sm"
                              onClick={ () => handleAction('edit', campaign)  }>
                              <Edit className="w-4 h-4" />
                            </Button>
                            { campaign.status === 'draft' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={ () => handleAction('send', campaign)  }>
                                <Send className="w-4 h-4" />
                              </Button>
                            )}
                            { campaign.status === 'scheduled' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={ () => handleAction('pause', campaign)  }>
                                <Pause className="w-4 h-4" />
                              </Button>
                            )}
                            { campaign.status === 'paused' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={ () => handleAction('resume', campaign)  }>
                                <Play className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={ () => handleAction('delete', campaign) }
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
          </Card.Content></Card></div>
    </AppLayout>);};

export default CampaignsIndex;
