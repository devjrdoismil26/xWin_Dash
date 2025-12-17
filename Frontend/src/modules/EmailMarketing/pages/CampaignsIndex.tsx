/**
 * Página de Campanhas de Email Marketing
 *
 * @description
 * FE-004: Implementação completa de listagem de campanhas de email marketing.
 * Exibe lista de campanhas com opções para criação, edição e visualização.
 *
 * @module modules/EmailMarketing/pages/CampaignsIndex
 * @since 1.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, MoreVertical, Mail, Calendar, Users, TrendingUp, Eye, Edit, Trash2, Play, Pause } from 'lucide-react';
import { apiClient } from '@/services';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { PermissionGate } from './components/guards';
import { cn } from '@/lib/utils';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  recipients_count: number;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string; }

/**
 * Componente CampaignsIndex
 *
 * FE-004: Implementação completa com consumo real de API
 */
const CampaignsIndex: React.FC = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState<string>('all');

  // FE-004: Carregar campanhas da API real
  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await apiClient.get<{ success: boolean; data: EmailCampaign[] }>('/email-marketing/campaigns');

      if (response.data.success && (response as any).data.data) {
        setCampaigns(response.data.data);

      } else {
        setCampaigns([]);

      } catch (err: unknown) {
      setError(err.message || 'Erro ao carregar campanhas');

      setCampaigns([]);

    } finally {
      setLoading(false);

    } , []);

  useEffect(() => {
    loadCampaigns();

  }, [loadCampaigns]);

  // Filtrar campanhas
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = !searchQuery || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calcular estatísticas
  const stats = {
    total: campaigns.length,
    draft: campaigns.filter(c => c.status === 'draft').length,
    scheduled: campaigns.filter(c => c.status === 'scheduled').length,
    sent: campaigns.filter(c => c.status === 'sent').length,
    active: campaigns.filter(c => ['scheduled', 'sending'].includes(c.status)).length,};

  const getStatusBadge = (status: EmailCampaign['status']) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'outline',
      scheduled: 'default',
      sending: 'default',
      sent: 'secondary',
      paused: 'outline',
      cancelled: 'destructive',};

    const labels: Record<string, string> = {
      draft: 'Rascunho',
      scheduled: 'Agendada',
      sending: 'Enviando',
      sent: 'Enviada',
      paused: 'Pausada',
      cancelled: 'Cancelada',};

    return (
              <Badge variant={ variants[status] || 'outline' } />
        {labels[status] || status}
      </Badge>);};

  const calculateOpenRate = (campaign: EmailCampaign) => {
    if (campaign.sent_count === 0) return 0;
    return ((campaign.opened_count / campaign.sent_count) * 100).toFixed(1);};

  const calculateClickRate = (campaign: EmailCampaign) => {
    if (campaign.sent_count === 0) return 0;
    return ((campaign.clicked_count / campaign.sent_count) * 100).toFixed(1);};

  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold text-gray-900">Campanhas de Email</h1>
          <p className="text-gray-600 mt-1" />
            Gerencie suas campanhas de email marketing
          </p></div><PermissionGate permission="email-campaigns.create" />
          <Button onClick={ () => window.location.href = '/email-marketing/campaigns/create'  }>
            <Plus className="w-4 h-4 mr-2" />
            Nova Campanha
          </Button></PermissionGate></div>

      {/* Stats Cards */}
      <div className=" ">$2</div><Card className="p-4" />
          <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p></div><Mail className="w-8 h-8 text-blue-500" /></div></Card>
        <Card className="p-4" />
          <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">Rascunhos</p>
              <p className="text-2xl font-bold">{stats.draft}</p></div><Edit className="w-8 h-8 text-gray-500" /></div></Card>
        <Card className="p-4" />
          <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">Agendadas</p>
              <p className="text-2xl font-bold">{stats.scheduled}</p></div><Calendar className="w-8 h-8 text-yellow-500" /></div></Card>
        <Card className="p-4" />
          <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">Enviadas</p>
              <p className="text-2xl font-bold">{stats.sent}</p></div><TrendingUp className="w-8 h-8 text-green-500" /></div></Card>
        <Card className="p-4" />
          <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">Ativas</p>
              <p className="text-2xl font-bold">{stats.active}</p></div><Play className="w-8 h-8 text-purple-500" /></div></Card>
      </div>

      {/* Filters */}
      <div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar campanhas..."
            value={ searchQuery }
            onChange={ (e: unknown) => setSearchQuery(e.target.value) }
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><select
          value={ statusFilter }
          onChange={ (e: unknown) => setStatusFilter(e.target.value) }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos os Status</option>
          <option value="draft">Rascunho</option>
          <option value="scheduled">Agendada</option>
          <option value="sending">Enviando</option>
          <option value="sent">Enviada</option>
          <option value="paused">Pausada</option>
          <option value="cancelled">Cancelada</option></select></div>

      {/* Campaigns List */}
      {loading ? (
        <div className=" ">$2</div><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600">
          ) : error ? (
        </div>
        <Card className="p-8 text-center" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={ loadCampaigns }>Tentar Novamente</Button>
      </Card>
    </>
  ) : filteredCampaigns.length === 0 ? (
        <Card className="p-8 text-center" />
          <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma campanha encontrada</h3>
          <p className="text-gray-600 mb-4" />
            {searchQuery ? 'Tente ajustar sua busca ou filtros' : 'Comece criando sua primeira campanha'}
          </p>
          <Button onClick={ () => window.location.href = '/email-marketing/campaigns/create'  }>
            <Plus className="w-4 h-4 mr-2" />
            Criar Campanha
          </Button>
      </Card>
    </>
  ) : (
        <div className="{filteredCampaigns.map((campaign: unknown) => (">$2</div>
            <Card key={campaign.id} className="p-6 hover:shadow-lg transition-shadow" />
              <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    {getStatusBadge(campaign.status)}
                  </div>
                  <p className="text-gray-600 mb-4">{campaign.subject}</p>
                  
                  <div className=" ">$2</div><div>
           
        </div><p className="text-gray-500">Destinatários</p>
                      <p className="font-semibold">{campaign.recipients_count.toLocaleString()}</p></div><div>
           
        </div><p className="text-gray-500">Enviados</p>
                      <p className="font-semibold">{campaign.sent_count.toLocaleString()}</p></div><div>
           
        </div><p className="text-gray-500">Taxa de Abertura</p>
                      <p className="font-semibold text-green-600">{calculateOpenRate(campaign)}%</p></div><div>
           
        </div><p className="text-gray-500">Taxa de Clique</p>
                      <p className="font-semibold text-blue-600">{calculateClickRate(campaign)}%</p>
                    </div>

                  {campaign.scheduled_at && (
                    <p className="text-xs text-gray-500 mt-2" />
                      Agendada para: {new Date(campaign.scheduled_at).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>

                <div className=" ">$2</div><PermissionGate permission="email-campaigns.view" />
                    <Button variant="outline" size="sm" onClick={() => window.location.href = `/email-marketing/campaigns/${campaign.id}`}>
                      <Eye className="w-4 h-4" /></Button></PermissionGate>
                  <PermissionGate permission="email-campaigns.edit" />
                    <Button variant="outline" size="sm" onClick={() => window.location.href = `/email-marketing/campaigns/${campaign.id}/edit`}>
                      <Edit className="w-4 h-4" /></Button></PermissionGate>
                  <PermissionGate permission="email-campaigns.delete" />
                    <Button variant="outline" size="sm" onClick={ () => {
                      if (confirm('Tem certeza que deseja excluir esta campanha?')) {
                        // Implementar delete
                       } }>
                      <Trash2 className="w-4 h-4" /></Button></PermissionGate></div></Card>
          ))}
        </div>
      )}
    </div>);};

export default CampaignsIndex;
