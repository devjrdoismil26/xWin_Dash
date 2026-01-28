/**
 * Página de detalhes do ADStool
 * Exibe detalhes específicos de campanhas, contas ou criativos
 */
import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Settings, BarChart3, Edit, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { AnimatedCounter } from '@/components/ui/AdvancedAnimations';
import useADStool from '../hooks/useADStool';

interface ADStoolDetailPageProps {
  auth?: any;
  type: 'campaign' | 'account' | 'creative';
  id: string;
}

const ADStoolDetailPage: React.FC<ADStoolDetailPageProps> = ({ 
  auth, 
  type, 
  id 
}) => {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { formatCurrency, formatNumber, formatPercentage } = useADStool();

  useEffect(() => {
    loadItem();
  }, [id, type]);

  const loadItem = async () => {
    setLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data baseado no tipo
      const mockData = {
        campaign: {
          id,
          name: 'Campanha de Verão 2024',
          status: 'ACTIVE',
          platform: 'Google Ads',
          daily_budget: 1000,
          total_spend: 15000,
          impressions: 50000,
          clicks: 2500,
          conversions: 125,
          ctr: 5.0,
          cpc: 6.0,
          created_at: '2024-01-15',
          updated_at: '2024-01-20'
        },
        account: {
          id,
          name: 'Conta Principal',
          platform: 'Google Ads',
          status: 'ACTIVE',
          balance: 5000,
          campaigns_count: 12,
          created_at: '2024-01-01'
        },
        creative: {
          id,
          name: 'Anúncio Principal',
          type: 'IMAGE',
          status: 'ACTIVE',
          platform: 'Facebook Ads',
          impressions: 25000,
          clicks: 1250,
          ctr: 5.0,
          created_at: '2024-01-10'
        }
      };

      setItem(mockData[type]);
    } catch (error) {
      console.error('Erro ao carregar item:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      ACTIVE: 'success',
      PAUSED: 'secondary',
      FAILED: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <PageTransition type="fade" duration={500}>
        <AuthenticatedLayout user={auth?.user}>
          <Head title={`${type} - ADStool - xWin Dash`} />
          <PageLayout>
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          </PageLayout>
        </AuthenticatedLayout>
      </PageTransition>
    );
  }

  if (!item) {
    return (
      <PageTransition type="fade" duration={500}>
        <AuthenticatedLayout user={auth?.user}>
          <Head title={`${type} - ADStool - xWin Dash`} />
          <PageLayout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Item não encontrado
              </h2>
              <p className="text-gray-600 mb-6">
                O {type} solicitado não foi encontrado.
              </p>
              <Link href="/adstool">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Dashboard
                </Button>
              </Link>
            </div>
          </PageLayout>
        </AuthenticatedLayout>
      </PageTransition>
    );
  }

  return (
    <PageTransition type="fade" duration={500}>
      <AuthenticatedLayout user={auth?.user}>
        <Head title={`${item.name} - ADStool - xWin Dash`} />
        <PageLayout>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/adstool">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {item.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(item.status)}
                    <Badge variant="outline">{item.platform}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>

            {/* Stats */}
            {type === 'campaign' && (
              <ResponsiveGrid
                columns={{ xs: 1, sm: 2, lg: 4 }}
                gap={{ xs: '1rem', md: '1.5rem' }}
              >
                <Card>
                  <Card.Content className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter
                        value={item.total_spend}
                        duration={2000}
                        prefix="R$ "
                        decimals={2}
                      />
                    </h3>
                    <p className="text-gray-600">Gasto Total</p>
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Content className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter
                        value={item.impressions}
                        duration={2000}
                      />
                    </h3>
                    <p className="text-gray-600">Impressões</p>
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Content className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter
                        value={item.clicks}
                        duration={2000}
                      />
                    </h3>
                    <p className="text-gray-600">Cliques</p>
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Content className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {formatPercentage(item.ctr)}
                    </h3>
                    <p className="text-gray-600">CTR</p>
                  </Card.Content>
                </Card>
              </ResponsiveGrid>
            )}

            {/* Details */}
            <Card>
              <Card.Header>
                <Card.Title>Detalhes</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Informações Básicas</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nome:</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plataforma:</span>
                        <span className="font-medium">{item.platform}</span>
                      </div>
                      {item.daily_budget && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Orçamento Diário:</span>
                          <span className="font-medium">
                            {formatCurrency(item.daily_budget)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Datas</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Criado em:</span>
                        <span className="font-medium">
                          {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Atualizado em:</span>
                        <span className="font-medium">
                          {new Date(item.updated_at || item.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </PageLayout>
      </AuthenticatedLayout>
    </PageTransition>
  );
};

export default ADStoolDetailPage;
