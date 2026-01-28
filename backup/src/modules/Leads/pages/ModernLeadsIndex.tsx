// ========================================
// PÁGINA PRINCIPAL MODERNIZADA - LEADS
// ========================================
import React, { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import {
  Plus,
  Download,
  Upload,
  Filter,
  Search,
  Grid,
  List,
  BarChart3,
  Users,
  Target,
  Star,
  TrendingUp,
  Calendar,
  Settings,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Zap,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/AppLayout';
import { useLeads } from '../hooks/useLeads';
import { Lead, LeadFilters, LeadFormData, LEAD_STATUSES, LEAD_ORIGINS } from '../types';
import ModernLeadCard from '../LeadsManager/components/ModernLeadCard';
import ModernLeadFilters from '../LeadsManager/components/ModernLeadFilters';
import ModernLeadAnalytics from '../LeadsAnalytics/components/ModernLeadAnalytics';

interface ModernLeadsIndexProps {
  initialLeads?: Lead[];
  initialMetrics?: any;
  initialAnalytics?: any;
}

const ModernLeadsIndex: React.FC<ModernLeadsIndexProps> = ({
  initialLeads = [],
  initialMetrics = null,
  initialAnalytics = null
}) => {
  const {
    leads,
    metrics,
    analytics,
    loading,
    error,
    pagination,
    filters,
    isEmpty,
    hasNextPage,
    hasPrevPage,
    createLead,
    updateLead,
    deleteLead,
    getLead,
    fetchLeads,
    refreshLeads,
    exportLeads,
    importLeads,
    updateLeadScore,
    updateLeadStatus,
    recordActivity,
    applyFilters,
    clearFilters,
    searchLeads,
    goToPage,
    nextPage,
    prevPage,
    fetchAnalytics,
    fetchMetrics,
    setCurrentLead
  } = useLeads();

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'created_at' | 'status'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);

  // Initialize data
  useEffect(() => {
    if (initialLeads.length > 0) {
      // Set initial data if provided
    } else {
      fetchLeads();
      fetchMetrics();
      fetchAnalytics();
    }
  }, []);

  // Handle search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        searchLeads(searchTerm);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, searchLeads]);

  const handleCreateLead = useCallback(async (data: LeadFormData) => {
    const lead = await createLead(data);
    if (lead) {
      setShowCreateModal(false);
    }
  }, [createLead]);

  const handleUpdateLead = useCallback(async (id: number, data: Partial<LeadFormData>) => {
    const lead = await updateLead(id, data);
    if (lead) {
      setEditingLead(null);
    }
  }, [updateLead]);

  const handleDeleteLead = useCallback(async (lead: Lead) => {
    if (window.confirm(`Tem certeza que deseja remover o lead "${lead.name}"?`)) {
      const success = await deleteLead(lead.id);
      if (success) {
        setSelectedLeads(prev => {
          const newSet = new Set(prev);
          newSet.delete(lead.id);
          return newSet;
        });
      }
    }
  }, [deleteLead]);

  const handleViewLead = useCallback((lead: Lead) => {
    setViewingLead(lead);
    setShowLeadDetails(true);
    setCurrentLead(lead);
  }, [setCurrentLead]);

  const handleEditLead = useCallback((lead: Lead) => {
    setEditingLead(lead);
  }, []);

  const handleUpdateScore = useCallback(async (lead: Lead, score: number) => {
    await updateLeadScore(lead.id, score, 'Atualização manual');
  }, [updateLeadScore]);

  const handleUpdateStatus = useCallback(async (lead: Lead, status: string) => {
    await updateLeadStatus(lead.id, status, 'Atualização manual');
  }, [updateLeadStatus]);

  const handleRecordActivity = useCallback(async (lead: Lead, activity: string) => {
    await recordActivity(lead.id, activity, `Ação: ${activity}`);
  }, [recordActivity]);

  const handleSelectLead = useCallback((leadId: number, selected: boolean) => {
    setSelectedLeads(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(leadId);
      } else {
        newSet.delete(leadId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedLeads(new Set(leads.map(lead => lead.id)));
    } else {
      setSelectedLeads(new Set());
    }
  }, [leads]);

  const handleBulkAction = useCallback(async (action: string) => {
    if (selectedLeads.size === 0) return;
    
    switch (action) {
      case 'delete':
        if (window.confirm(`Tem certeza que deseja remover ${selectedLeads.size} leads?`)) {
          for (const leadId of selectedLeads) {
            await deleteLead(leadId);
          }
          setSelectedLeads(new Set());
        }
        break;
      case 'export':
        await exportLeads({
          format: 'csv',
          filters: {
            ...filters,
            // Add filter for selected leads
          }
        });
        break;
      default:
        break;
    }
  }, [selectedLeads, deleteLead, exportLeads, filters]);

  const handleSort = useCallback((field: 'name' | 'score' | 'created_at' | 'status') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy]);

  const sortedLeads = React.useMemo(() => {
    return [...leads].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [leads, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <AppLayout>
      <Head title="Leads - CRM" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads CRM</h1>
            <p className="text-gray-600">Gerencie seus leads e acompanhe conversões</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportModal(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportLeads({ format: 'csv' })}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Lead
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.total_leads || 0}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Novos Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.new_today || 0}</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa Conversão</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.conversion_rate || 0}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Score Médio</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.average_score || 0}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={refreshLeads}
                disabled={loading}
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                Atualizar
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <ModernLeadFilters
                filters={filters}
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
              />
            </div>
          )}
        </Card>

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            
            <Button
              variant={viewMode === 'analytics' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('analytics')}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {selectedLeads.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedLeads.size} selecionado(s)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                >
                  Exportar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  className="text-red-600 hover:text-red-700"
                >
                  Remover
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Carregando leads...</span>
          </div>
        )}

        {error && (
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </Card>
        )}

        {!loading && !error && (
          <>
            {viewMode === 'analytics' ? (
              <ModernLeadAnalytics
                analytics={analytics}
                metrics={metrics}
                onRefresh={() => {
                  fetchAnalytics();
                  fetchMetrics();
                }}
              />
            ) : (
              <>
                {/* Leads Grid/List */}
                {isEmpty ? (
                  <Card className="p-12 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum lead encontrado
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Comece criando seu primeiro lead ou ajuste os filtros de busca.
                    </p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Lead
                    </Button>
                  </Card>
                ) : (
                  <div className={cn(
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'space-y-2'
                  )}>
                    {sortedLeads.map((lead) => (
                      <ModernLeadCard
                        key={lead.id}
                        lead={lead}
                        viewMode={viewMode}
                        selected={selectedLeads.has(lead.id)}
                        onSelect={(selected) => handleSelectLead(lead.id, selected)}
                        onView={() => handleViewLead(lead)}
                        onEdit={() => handleEditLead(lead)}
                        onDelete={() => handleDeleteLead(lead)}
                        onUpdateScore={(score) => handleUpdateScore(lead, score)}
                        onUpdateStatus={(status) => handleUpdateStatus(lead, status)}
                        onRecordActivity={(activity) => handleRecordActivity(lead, activity)}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination && pagination.total_pages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Página {pagination.current_page} de {pagination.total_pages}
                      ({pagination.total_items} leads)
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevPage}
                        disabled={!hasPrevPage}
                      >
                        Anterior
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={!hasNextPage}
                      >
                        Próximo
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Criar Novo Lead"
        >
          {/* Create Lead Form - Implementar componente específico */}
          <div className="p-4">
            <p className="text-gray-600">Formulário de criação de lead será implementado aqui.</p>
          </div>
        </Modal>
      )}

      {showLeadDetails && viewingLead && (
        <Modal
          isOpen={showLeadDetails}
          onClose={() => setShowLeadDetails(false)}
          title={`Lead: ${viewingLead.name}`}
          size="lg"
        >
          {/* Lead Details - Implementar componente específico */}
          <div className="p-4">
            <p className="text-gray-600">Detalhes do lead serão implementados aqui.</p>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
};

export default ModernLeadsIndex;