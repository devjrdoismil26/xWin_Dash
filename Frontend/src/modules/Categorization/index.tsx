import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from "@/components/ui/Card";
import Button from '@/components/ui/Button';
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/LoadingStates';
import { AnimatedCounter, PageTransition, Animated } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid, ResponsiveContainer, ShowOn } from '@/components/ui/ResponsiveSystem';
import { ProgressBar, CircularProgress, OperationProgress } from '@/components/ui/AdvancedProgress';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import Tooltip from '@/components/ui/Tooltip';
import { 
  Tag, 
  FolderOpen, 
  Plus, 
  Settings,
  ArrowRight,
  Sparkles,
  BarChart3,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react';
const CategorizationIndex: React.FC<{ 
  auth?: any; 
  stats?: any;
}> = ({ 
  auth, 
  stats = {}
}) => {
  const [useAdvancedDashboard, setUseAdvancedDashboard] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'categories' | 'tags'>('overview');
  const modules = [
    {
      name: 'Categorias',
      description: 'Organize e gerencie categorias de conteúdo',
      icon: FolderOpen,
      href: '/categorization/categories',
      color: 'bg-blue-500',
      stats: stats.categories || 0
    },
    {
      name: 'Tags',
      description: 'Crie e gerencie tags para classificação',
      icon: Tag,
      href: '/categorization/tags',
      color: 'bg-green-500',
      stats: stats.tags || 0
    }
  ];
  // Renderizar dashboard avançado se selecionado
  if (useAdvancedDashboard) {
    return (
      <PageTransition type="fade" duration={500}>
        <AppLayout
          title="Categorização Avançada"
          subtitle="Sistema inteligente de organização e classificação"
          showSidebar={true}
          showBreadcrumbs={true}
          breadcrumbs={[
            { name: 'Dashboard', href: '/dashboard' },
            { name: 'Categorização', href: '/categorization', current: true }
          ]}
          actions={
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setUseAdvancedDashboard(false)}
                className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
              >
                ← Voltar ao Dashboard Básico
              </Button>
            </div>
          }
        >
          <Head title="Categorização Avançada - xWin Dash" />
          <div className="space-y-6">
            <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }} className="gap-6">
              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <Card.Header>
                  <Card.Title className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-blue-600" />
                    Categorias Ativas
                  </Card.Title>
                  <Card.Description>
                    Total de categorias organizadas
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    <AnimatedCounter value={stats.categories || 0} />
                  </div>
                  <ProgressBar 
                    value={((stats.categories || 0) / 50) * 100} 
                    className="h-2 mt-2"
                  />
                </Card.Content>
              </Card>
              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <Card.Header>
                  <Card.Title className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-green-600" />
                    Tags Criadas
                  </Card.Title>
                  <Card.Description>
                    Total de tags disponíveis
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    <AnimatedCounter value={stats.tags || 0} />
                  </div>
                  <ProgressBar 
                    value={((stats.tags || 0) / 100) * 100} 
                    className="h-2 mt-2"
                  />
                </Card.Content>
              </Card>
              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <Card.Header>
                  <Card.Title className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Taxa de Uso
                  </Card.Title>
                  <Card.Description>
                    Eficiência do sistema
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    94.2%
                  </div>
                  <ProgressBar 
                    value={94.2} 
                    className="h-2 mt-2"
                  />
                </Card.Content>
              </Card>
            </ResponsiveGrid>
            <ResponsiveGrid columns={{ base: 1, lg: 2 }} className="gap-6">
              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <Card.Header>
                  <Card.Title className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    Distribuição de Categorias
                  </Card.Title>
                  <Card.Description>
                    Análise de uso por categoria
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Produtos</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <ProgressBar value={45} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Conteúdo</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <ProgressBar value={30} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Leads</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <ProgressBar value={25} className="h-2" />
                  </div>
                </Card.Content>
              </Card>
              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <Card.Header>
                  <Card.Title className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Tags Mais Usadas
                  </Card.Title>
                  <Card.Description>
                    Ranking das tags mais populares
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">#vendas</span>
                      <span className="text-sm font-medium">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">#marketing</span>
                      <span className="text-sm font-medium">987</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">#suporte</span>
                      <span className="text-sm font-medium">756</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">#produto</span>
                      <span className="text-sm font-medium">543</span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </ResponsiveGrid>
          </div>
        </AppLayout>
      </PageTransition>
    );
  }
  return (
    <PageTransition type="fade" duration={500}>
      <AppLayout
        title="Categorização"
        subtitle="Sistema inteligente de organização e classificação"
        showSidebar={true}
        showBreadcrumbs={true}
        breadcrumbs={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Categorização', href: '/categorization', current: true }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Tooltip content="Acessar dashboard avançado com análises profundas">
              <Button 
                variant="outline" 
                onClick={() => setUseAdvancedDashboard(true)}
                className="backdrop-blur-sm bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Dashboard Avançado
              </Button>
            </Tooltip>
            <Tooltip content="Configurar sistema de categorização">
              <Button variant="outline" href="/categorization/settings">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </Tooltip>
            <Tooltip content="Criar nova categoria">
              <Button href="/categorization/categories/create">
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            </Tooltip>
          </div>
        }
      >
        <Head title="Categorização - xWin Dash" />
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Tag className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sistema de Categorização
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Organize e classifique seu conteúdo com inteligência artificial
            </p>
            <ResponsiveGrid columns={{ base: 1, md: 3 }} className="gap-6">
              <Animated className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <FolderOpen className="h-4 w-4" />
                <span><AnimatedCounter value={stats.categories || 0} /> categorias</span>
              </Animated>
              <Animated className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Tag className="h-4 w-4" />
                <span><AnimatedCounter value={stats.tags || 0} /> tags</span>
              </Animated>
              <Animated className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Globe className="h-4 w-4" />
                <span>94.2% eficiência</span>
              </Animated>
            </ResponsiveGrid>
          </div>
          {/* Modules Grid */}
          <ResponsiveGrid columns={{ base: 1, md: 2, lg: 2 }} className="gap-6">
            {modules.map((module) => (
              <Card 
                key={module.name}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                onClick={() => window.location.href = module.href}
              >
                <Card.Header className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${module.color} bg-opacity-10`}>
                      <module.icon className={`h-6 w-6 ${module.color.replace('bg-', 'text-')}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <Card.Title className="text-lg">{module.name}</Card.Title>
                  <Card.Description className="text-sm">
                    {module.description}
                  </Card.Description>
                </Card.Header>
                <Card.Content className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={module.stats} />
                    </span>
                    <span className="text-sm text-gray-500">
                      {module.name === 'Tags' ? 'total' : 'ativas'}
                    </span>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </ResponsiveGrid>
          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <Card.Title>Ações Rápidas</Card.Title>
              <Card.Description>
                Acesse rapidamente as funcionalidades mais usadas
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <ResponsiveGrid columns={{ base: 1, md: 3 }} className="gap-4">
                <Button 
                  href="/categorization/categories" 
                  className="h-20 flex-col gap-2"
                  variant="outline"
                >
                  <FolderOpen className="h-6 w-6" />
                  <span>Gerenciar Categorias</span>
                </Button>
                <Button 
                  href="/categorization/tags" 
                  className="h-20 flex-col gap-2"
                  variant="outline"
                >
                  <Tag className="h-6 w-6" />
                  <span>Gerenciar Tags</span>
                </Button>
                <Button 
                  href="/categorization/analytics" 
                  className="h-20 flex-col gap-2"
                  variant="outline"
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Ver Analytics</span>
                </Button>
              </ResponsiveGrid>
            </Card.Content>
          </Card>
        </div>
      </AppLayout>
    </PageTransition>
  );
};
export default CategorizationIndex;
