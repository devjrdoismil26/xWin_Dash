// ========================================
// LEADS DETAIL PAGE - PÁGINA DE DETALHES
// ========================================
// Página de detalhes de um lead específico
// Máximo: 200 linhas

import React, { Suspense, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Share, Download, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { useLeads } from '../hooks/useLeads';
import { LeadDetails } from '../LeadsManager/components/LeadDetails';
import { LeadActivityTimeline } from '../LeadsManager/components/LeadActivityTimeline';
import { LeadActivityForm } from '../LeadsManager/components/LeadActivityForm';
import { LeadForm } from '../LeadsManager/components/LeadForm';
import { LeadsHeader } from '../components/LeadsHeader';
import { LeadsMetrics } from '../components/LeadsMetrics';
import { LeadsFilters } from '../components/LeadsFilters';

// ========================================
// INTERFACES
// ========================================

interface LeadsDetailPageProps {
  leadId: string;
  className?: string;
}

// ========================================
// COMPONENTES LAZY LOADED
// ========================================

const LeadAnalytics = React.lazy(() => import('../LeadsManager/components/LeadActivityTimeline'));
const LeadSegments = React.lazy(() => import('../LeadsManager/components/LeadDetails'));

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export const LeadsDetailPage: React.FC<LeadsDetailPageProps> = ({ 
  leadId,
  className = ''
}) => {
  const {
    currentLead,
    loading,
    error,
    activities,
    notes,
    tasks,
    documents,
    getLead,
    fetchActivities,
    fetchNotes,
    fetchTasks,
    fetchDocuments,
    clearError
  } = useLeads();

  // ========================================
  // EFFECTS
  // ========================================
  
  useEffect(() => {
    if (leadId) {
      getLead(parseInt(leadId));
      fetchActivities(parseInt(leadId));
      fetchNotes(parseInt(leadId));
      fetchTasks(parseInt(leadId));
      fetchDocuments(parseInt(leadId));
    }
  }, [leadId, getLead, fetchActivities, fetchNotes, fetchTasks, fetchDocuments]);

  // ========================================
  // HANDLERS
  // ========================================
  
  const handleEdit = () => {
    console.log('Edit lead:', currentLead);
  };

  const handleDelete = () => {
    console.log('Delete lead:', currentLead);
  };

  const handleShare = () => {
    console.log('Share lead:', currentLead);
  };

  const handleDownload = () => {
    console.log('Download lead data:', currentLead);
  };

  const handleBack = () => {
    window.history.back();
  };

  // ========================================
  // LOADING STATE
  // ========================================
  
  if (loading && !currentLead) {
    return (
      <PageTransition type="fade" duration={500}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Carregando detalhes do lead...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================
  
  if (error && !currentLead) {
    return (
      <PageTransition type="fade" duration={500}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Erro ao carregar lead</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <Button onClick={handleBack} variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button onClick={() => getLead(parseInt(leadId))} variant="primary">
                Tentar Novamente
              </Button>
            </div>
          </Card>
        </div>
      </PageTransition>
    );
  }

  // ========================================
  // NOT FOUND STATE
  // ========================================
  
  if (!currentLead && !loading) {
    return (
      <PageTransition type="fade" duration={500}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lead não encontrado</h2>
            <p className="text-gray-600 mb-6">O lead solicitado não foi encontrado ou não existe.</p>
            <Button onClick={handleBack} variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Card>
        </div>
      </PageTransition>
    );
  }

  // ========================================
  // RENDER
  // ========================================
  
  return (
    <PageTransition type="fade" duration={500}>
      <div className={`min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl ${className}`}>
        <Head title={`${currentLead?.name || 'Lead'} - xWin Dash`} />
        
        {/* Header */}
        <LeadsHeader
          title={currentLead?.name || 'Detalhes do Lead'}
          subtitle={currentLead?.email || 'Carregando...'}
          breadcrumbs={[
            { name: 'Leads', href: '/leads' },
            { name: currentLead?.name || 'Lead', href: `/leads/${leadId}`, current: true }
          ]}
          actions={[
            {
              label: 'Voltar',
              icon: ArrowLeft,
              onClick: handleBack,
              variant: 'secondary'
            },
            {
              label: 'Editar',
              icon: Edit,
              onClick: handleEdit,
              variant: 'primary'
            },
            {
              label: 'Compartilhar',
              icon: Share,
              onClick: handleShare,
              variant: 'secondary'
            },
            {
              label: 'Download',
              icon: Download,
              onClick: handleDownload,
              variant: 'secondary'
            },
            {
              label: 'Excluir',
              icon: Trash2,
              onClick: handleDelete,
              variant: 'danger'
            }
          ]}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <ResponsiveGrid columns={{ default: 1, lg: 3 }} gap={6}>
            
            {/* Lead Details - Main Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Lead Information */}
              <Card className="p-6">
                <LeadDetails
                  lead={currentLead!}
                  loading={loading}
                  onUpdate={handleEdit}
                />
              </Card>

              {/* Activity Timeline */}
              <Card className="p-6">
                <LeadsMetrics
                  activities={activities}
                  loading={loading}
                  leadId={parseInt(leadId)}
                />
              </Card>

              {/* Notes */}
              <Card className="p-6">
                <LeadNotes
                  notes={notes}
                  loading={loading}
                  leadId={parseInt(leadId)}
                />
              </Card>

              {/* Tasks */}
              <Card className="p-6">
                <LeadTasks
                  tasks={tasks}
                  loading={loading}
                  leadId={parseInt(leadId)}
                />
              </Card>

              {/* Documents */}
              <Card className="p-6">
                <LeadDocuments
                  documents={documents}
                  loading={loading}
                  leadId={parseInt(leadId)}
                />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Analytics (Lazy Loaded) */}
              <Suspense fallback={
                <Card className="p-6">
                  <div className="flex items-center justify-center h-32">
                    <LoadingSpinner size="md" />
                  </div>
                </Card>
              }>
                <LeadAnalytics
                  leadId={parseInt(leadId)}
                  loading={loading}
                />
              </Suspense>

              {/* Segments (Lazy Loaded) */}
              <Suspense fallback={
                <Card className="p-6">
                  <div className="flex items-center justify-center h-32">
                    <LoadingSpinner size="md" />
                  </div>
                </Card>
              }>
                <LeadSegments
                  leadId={parseInt(leadId)}
                  loading={loading}
                />
              </Suspense>
            </div>
          </ResponsiveGrid>
        </div>
      </div>
    </PageTransition>
  );
};

export default LeadsDetailPage;
