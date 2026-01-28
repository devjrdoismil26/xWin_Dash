// =========================================
// SOCIAL BUFFER INDEX PAGE - SOCIAL BUFFER
// =========================================

import React, { useState, Suspense } from 'react';
import { 
  BarChart3, 
  Send, 
  Users, 
  Calendar, 
  Hash, 
  Link as LucideLink, 
  Image,
  TrendingUp,
  Play
} from 'lucide-react';
import AppLayout from '@/layouts/AppLayout';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LoadingSpinner, LoadingSkeleton, TableLoadingSkeleton } from '@/components/ui/LoadingStates';
import { AnimatedCounter, PageTransition, Animated } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid, ResponsiveContainer, ShowOn } from '@/components/ui/ResponsiveSystem';
import { ProgressBar, CircularProgress, OperationProgress } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import Tooltip from '@/components/ui/Tooltip';

// Lazy Loading Components
const AdvancedSocialBufferDashboard = React.lazy(() => import('../components/AdvancedSocialBufferDashboard'));
const SocialBufferIntegrationTest = React.lazy(() => import('../components/SocialBufferIntegrationTest'));

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

const SocialBufferIndexPage: React.FC<{ auth?: any }> = ({ auth }) => {
  const [useAdvancedDashboard, setUseAdvancedDashboard] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [showIntegrationTest, setShowIntegrationTest] = useState(false);

  const features = [
    {
      title: 'Dashboard',
      description: 'Visão geral das suas métricas e performance',
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      href: '/social-buffer/dashboard',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Posts',
      description: 'Crie, edite e gerencie seus posts',
      icon: <Send className="w-8 h-8 text-green-600" />,
      href: '/social-buffer/posts',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Agendamentos',
      description: 'Programe posts para o futuro',
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      href: '/social-buffer/schedules',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Hashtags',
      description: 'Gerencie e analise hashtags',
      icon: <Hash className="w-8 h-8 text-orange-600" />,
      href: '/social-buffer/hashtags',
      color: 'bg-orange-50 border-orange-200'
    },
    {
      title: 'Links',
      description: 'Encurte e rastreie links',
      icon: <LucideLink className="w-8 h-8 text-indigo-600" />,
      href: '/social-buffer/links',
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      title: 'Mídia',
      description: 'Gerencie imagens e vídeos',
      icon: <Image className="w-8 h-8 text-pink-600" />,
      href: '/social-buffer/media',
      color: 'bg-pink-50 border-pink-200'
    },
    {
      title: 'Analytics',
      description: 'Analise performance e métricas',
      icon: <TrendingUp className="w-8 h-8 text-teal-600" />,
      href: '/social-buffer/analytics',
      color: 'bg-teal-50 border-teal-200'
    },
    {
      title: 'Contas',
      description: 'Gerencie suas contas sociais',
      icon: <Users className="w-8 h-8 text-cyan-600" />,
      href: '/social-buffer/accounts',
      color: 'bg-cyan-50 border-cyan-200'
    }
  ];

  const stats = [
    { label: 'Posts Publicados', value: 1247, change: '+12%', color: 'text-green-600' },
    { label: 'Engajamento Total', value: 45678, change: '+8%', color: 'text-blue-600' },
    { label: 'Alcance Total', value: 234567, change: '+15%', color: 'text-purple-600' },
    { label: 'Contas Conectadas', value: 8, change: '+2', color: 'text-orange-600' }
  ];

  const recentActivity = [
    { action: 'Post publicado no Instagram', time: '2 min atrás', platform: 'Instagram' },
    { action: 'Agendamento criado para Twitter', time: '15 min atrás', platform: 'Twitter' },
    { action: 'Nova hashtag adicionada', time: '1 hora atrás', platform: 'Geral' },
    { action: 'Relatório de analytics gerado', time: '2 horas atrás', platform: 'Analytics' }
  ];

  return (
    <AuthenticatedLayout user={auth?.user}>
      <AppLayout>
        <PageLayout>
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Social Buffer</h1>
                <p className="text-gray-600 mt-2">
                  Gerencie suas redes sociais de forma inteligente e eficiente
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowIntegrationTest(!showIntegrationTest)}
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Teste de Integração
                </Button>
                
                <Button
                  variant={useAdvancedDashboard ? "default" : "outline"}
                  onClick={() => setUseAdvancedDashboard(!useAdvancedDashboard)}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  {useAdvancedDashboard ? 'Dashboard Simples' : 'Dashboard Avançado'}
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <ResponsiveGrid columns={{ sm: 2, md: 4 }} gap={6}>
              {stats.map((stat, index) => (
                <Animated key={stat.label} delay={index * 100}>
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <AnimatedCounter
                          value={stat.value}
                          className={`text-2xl font-bold ${stat.color}`}
                        />
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${stat.color}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Animated>
              ))}
            </ResponsiveGrid>

            {/* Dashboard Toggle */}
            {useAdvancedDashboard ? (
              <Suspense fallback={<LoadingSkeleton />}>
                <AdvancedSocialBufferDashboard />
              </Suspense>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Features Grid */}
                <div className="lg:col-span-2">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Funcionalidades Principais
                    </h2>
                    <ResponsiveGrid columns={{ sm: 2 }} gap={4}>
                      {features.map((feature, index) => (
                        <Animated key={feature.title} delay={index * 100}>
                          <Link href={feature.href}>
                            <Card className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${feature.color}`}>
                              <div className="flex items-center gap-3">
                                {feature.icon}
                                <div>
                                  <h3 className="font-medium text-gray-900">{feature.title}</h3>
                                  <p className="text-sm text-gray-600">{feature.description}</p>
                                </div>
                              </div>
                            </Card>
                          </Link>
                        </Animated>
                      ))}
                    </ResponsiveGrid>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div>
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Atividade Recente
                    </h2>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <Animated key={index} delay={index * 100}>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{activity.action}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">{activity.time}</span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {activity.platform}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Animated>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Integration Test */}
            {showIntegrationTest && (
              <Suspense fallback={<LoadingSkeleton />}>
                <SocialBufferIntegrationTest />
              </Suspense>
            )}
          </div>
        </PageLayout>
      </AppLayout>
    </AuthenticatedLayout>
  );
};

export default SocialBufferIndexPage;
