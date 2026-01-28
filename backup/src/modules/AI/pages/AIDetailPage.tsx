/**
 * Página de detalhes do módulo AI
 * Exibe detalhes específicos de gerações, provedores ou configurações
 */
import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Settings, BarChart3, Edit, Trash2, Download } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { useAI } from '../hooks';
import { AIGeneration, AIProvider } from '../types';
import { formatDate, formatCurrency, formatTokens, formatDuration } from '../utils';

interface AIDetailPageProps {
  auth?: { user?: { id: string; name: string; email: string; }; };
  type: 'generation' | 'provider' | 'analytics';
  id: string;
}

const AIDetailPage: React.FC<AIDetailPageProps> = ({ 
  auth, 
  type, 
  id 
}) => {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { generation, providers } = useAI();

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
        generation: {
          id,
          type: 'text',
          provider: 'openai',
          model: 'gpt-4',
          prompt: 'Crie um texto sobre inteligência artificial',
          result: 'A inteligência artificial é uma tecnologia...',
          metadata: {
            tokens: 150,
            cost: 0.0045,
            duration: 2000,
            quality: 0.95
          },
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:02Z'
        },
        provider: {
          id,
          name: 'OpenAI',
          status: 'active',
          capabilities: ['text', 'image', 'code'],
          models: ['gpt-4', 'gpt-3.5-turbo', 'dall-e-3'],
          api_key_configured: true,
          last_check: '2024-01-15T10:30:00Z'
        },
        analytics: {
          id,
          period: 'week',
          date: '2024-01-15',
          generations: 45,
          tokens: 12500,
          cost: 0.375,
          avg_quality: 0.92
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
    const variants: Record<string, string> = {
      active: 'success',
      inactive: 'destructive',
      completed: 'success',
      failed: 'destructive',
      pending: 'secondary',
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
          <Head title={`${type} - AI - xWin Dash`} />
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
          <Head title={`${type} - AI - xWin Dash`} />
          <PageLayout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Item não encontrado
              </h2>
              <p className="text-gray-600 mb-6">
                O {type} solicitado não foi encontrado.
              </p>
              <Link href="/ai">
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
        <Head title={`${item.name || item.id} - AI - xWin Dash`} />
        <PageLayout>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/ai">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {item.name || item.id}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(item.status)}
                    {item.provider && (
                      <Badge variant="outline">{item.provider}</Badge>
                    )}
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
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>

            {/* Content based on type */}
            {type === 'generation' && (
              <ResponsiveGrid
                columns={{ xs: 1, lg: 2 }}
                gap={{ xs: '1rem', md: '1.5rem' }}
              >
                <Card>
                  <Card.Header>
                    <Card.Title>Prompt</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-gray-700 whitespace-pre-wrap">{item.prompt}</p>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>Resultado</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-gray-700 whitespace-pre-wrap">{item.result}</p>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>Métricas</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tokens:</span>
                        <span className="font-medium">{formatTokens(item.metadata.tokens)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Custo:</span>
                        <span className="font-medium">{formatCurrency(item.metadata.cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duração:</span>
                        <span className="font-medium">{formatDuration(item.metadata.duration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Qualidade:</span>
                        <span className="font-medium">{(item.metadata.quality * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>Informações</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipo:</span>
                        <span className="font-medium">{item.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Provedor:</span>
                        <span className="font-medium">{item.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Modelo:</span>
                        <span className="font-medium">{item.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Criado em:</span>
                        <span className="font-medium">{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </ResponsiveGrid>
            )}

            {type === 'provider' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <Card.Header>
                    <Card.Title>Informações do Provedor</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nome:</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">API Key:</span>
                        <Badge variant={item.api_key_configured ? 'success' : 'destructive'}>
                          {item.api_key_configured ? 'Configurada' : 'Não configurada'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Última verificação:</span>
                        <span className="font-medium">{formatDate(item.last_check)}</span>
                      </div>
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>Capacidades</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 block mb-2">Funcionalidades:</span>
                        <div className="flex flex-wrap gap-2">
                          {item.capabilities.map((capability: string) => (
                            <Badge key={capability} variant="outline">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-2">Modelos:</span>
                        <div className="flex flex-wrap gap-2">
                          {item.models.map((model: string) => (
                            <Badge key={model} variant="secondary">
                              {model}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            )}

            {type === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <Card.Header>
                    <Card.Title>Resumo do Período</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Período:</span>
                        <span className="font-medium">{item.period}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data:</span>
                        <span className="font-medium">{formatDate(item.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gerações:</span>
                        <span className="font-medium">{item.generations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tokens:</span>
                        <span className="font-medium">{formatTokens(item.tokens)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Custo:</span>
                        <span className="font-medium">{formatCurrency(item.cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Qualidade Média:</span>
                        <span className="font-medium">{(item.avg_quality * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </Card.Content>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>Gráficos</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="text-center py-8 text-gray-500">
                      Gráficos de analytics serão implementados aqui
                    </div>
                  </Card.Content>
                </Card>
              </div>
            )}
          </div>
        </PageLayout>
      </AuthenticatedLayout>
    </PageTransition>
  );
};

export default AIDetailPage;
