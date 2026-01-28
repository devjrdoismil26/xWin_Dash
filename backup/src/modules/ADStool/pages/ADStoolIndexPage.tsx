/**
 * Página principal do ADStool
 * Dashboard principal com todas as funcionalidades
 */
import React, { useEffect, useState, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ShowOn } from '@/components/ui/ResponsiveSystem';
import { OperationProgress } from '@/components/ui/AdvancedProgress';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import useADStool from '../hooks/useADStool';

// Componentes do ADStool
import {
  ADStoolHeader,
  ADStoolStats,
  ADStoolFeatures,
  ADStoolQuickActions,
  ADStoolConnectedAccounts,
  ADStoolRecentCampaigns,
  ADStoolGettingStarted,
  AdvancedADSToolDashboard,
  ADStoolIntegrationTest
} from '../components';

// Lazy Loading Components
const LazyAdvancedDashboard = React.lazy(() => Promise.resolve({ default: AdvancedADSToolDashboard }));
const LazyIntegrationTest = React.lazy(() => Promise.resolve({ default: ADStoolIntegrationTest }));

interface ADStoolIndexPageProps {
  auth?: any;
  className?: string;
}

const ADStoolIndexPage: React.FC<ADStoolIndexPageProps> = ({ auth, className }) => {
  const [useAdvancedDashboard, setUseAdvancedDashboard] = useState(false);
  const [showIntegrationTest, setShowIntegrationTest] = useState(false);
  
  const {
    campaigns,
    accounts,
    loading,
    fetchCampaigns,
    fetchAccounts,
    fetchAnalyticsSummary,
    getActiveCampaigns,
    getPausedCampaigns,
    getTotalSpend,
    getTotalImpressions,
    getTotalClicks,
    getTotalConversions,
    getAverageCTR,
    getAverageCPC,
    getConnectedAccounts,
    formatCurrency,
    formatNumber,
    formatPercentage,
  } = useADStool();

  const [analyticsSummary, setAnalyticsSummary] = useState(null);

  useEffect(() => {
    fetchCampaigns();
    fetchAccounts();
    loadAnalyticsSummary();
  }, []);

  const loadAnalyticsSummary = async () => {
    try {
      const summary = await fetchAnalyticsSummary();
      setAnalyticsSummary(summary.data);
    } catch (error) {
      // Handle error silently
    }
  };

  const activeCampaigns = getActiveCampaigns();
  const pausedCampaigns = getPausedCampaigns();
  const connectedAccounts = getConnectedAccounts();

  // Renderizar teste de integração se selecionado
  if (showIntegrationTest) {
    return (
      <>
        <Head title="Teste de Integração - ADStool - xWin Dash" />
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setShowIntegrationTest(false)}
            className="mb-4"
          >
            ← Voltar ao Dashboard
          </Button>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <LazyIntegrationTest />
        </Suspense>
      </>
    );
  }

  // Se usar dashboard avançado, renderizar o componente avançado
  if (useAdvancedDashboard) {
    return (
      <>
        <Head title="ADStool - Dashboard Avançado" />
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={() => setUseAdvancedDashboard(false)}
            className="mb-4"
          >
            ← Voltar ao Dashboard Básico
          </Button>
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          <LazyAdvancedDashboard 
            campaigns={campaigns}
            accounts={accounts}
            metrics={{
              totalSpend: getTotalSpend(),
              totalImpressions: getTotalImpressions(),
              totalClicks: getTotalClicks(),
              totalConversions: getTotalConversions(),
              averageCTR: getAverageCTR(),
              averageCPC: getAverageCPC(),
            }}
          />
        </Suspense>
      </>
    );
  }

  return (
    <>
      <Head title="ADStool - xWin Dash" />
      <div className={`space-y-8 ${className || ''}`}>
        {/* Header */}
        <ADStoolHeader 
          onAdvancedDashboard={() => setUseAdvancedDashboard(true)}
          onIntegrationTest={() => setShowIntegrationTest(true)}
        />

        {/* Quick Stats */}
        <ADStoolStats
          campaigns={campaigns}
          activeCampaigns={activeCampaigns}
          pausedCampaigns={pausedCampaigns}
          getTotalSpend={getTotalSpend}
          getTotalImpressions={getTotalImpressions}
          getTotalClicks={getTotalClicks}
          getAverageCTR={getAverageCTR}
          formatPercentage={formatPercentage}
        />

        {/* Progresso de Campanhas */}
        <ShowOn breakpoint="md">
          <Card>
            <Card.Header>
              <Card.Title>Progresso das Campanhas</Card.Title>
              <Card.Description>
                Acompanhe o desempenho das suas campanhas ativas
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <OperationProgress
                  label="Campanha de Verão 2024"
                  progress={68}
                  status="running"
                  description="Meta: R$ 10.000 - Atual: R$ 6.800"
                />
                <OperationProgress
                  label="Black Friday Prep"
                  progress={25}
                  status="running"
                  description="Meta: R$ 25.000 - Atual: R$ 6.250"
                />
                <OperationProgress
                  label="Campanha de Natal"
                  progress={100}
                  status="completed"
                  description="Meta atingida com sucesso!"
                />
              </div>
            </Card.Content>
          </Card>
        </ShowOn>

        {/* Connected Accounts */}
        <ADStoolConnectedAccounts connectedAccounts={connectedAccounts} />

        {/* Recent Campaigns */}
        <ADStoolRecentCampaigns 
          campaigns={campaigns}
          formatCurrency={formatCurrency}
        />

        {/* Features Grid */}
        <ADStoolFeatures 
          campaigns={campaigns}
          accounts={accounts}
        />

        {/* Quick Actions */}
        <ADStoolQuickActions />

        {/* Getting Started */}
        <ADStoolGettingStarted 
          show={campaigns.length === 0 && accounts.length === 0}
        />
      </div>
    </>
  );
};

export default ADStoolIndexPage;
