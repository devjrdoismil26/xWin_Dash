import React from 'react';
import { Plus, Filter, Download, Users } from 'lucide-react';
import AppLayout from '../AppLayout';
import Button from '@/components/ui/Button';
import { MODULE_NAVIGATION } from '@/config/navigation.tsx';

/**
 * Exemplo de uso do AppLayout para uma página de Leads
 * Demonstra como usar todos os recursos do sistema de layouts
 */
const LeadsPageExample: React.FC = () => {
  // Configuração da sidebar para o módulo de Leads
  const sidebarLinks = [
    {
      name: 'Todos os Leads',
      route: 'leads.index',
      category: 'Gestão',
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: 'Leads Qualificados',
      route: 'leads.qualified',
      category: 'Gestão',
      icon: <Users className="w-4 h-4" />,
      badge: '12',
    },
    {
      name: 'Funil de Vendas',
      route: 'leads.funnel',
      category: 'Análise',
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: 'Relatórios',
      route: 'leads.reports',
      category: 'Análise',
      icon: <Users className="w-4 h-4" />,
    },
  ];

  // Configuração dos breadcrumbs
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'CRM', href: '/leads' },
    { label: 'Leads', active: true },
  ];

  return (
    <AppLayout
      // Configuração do layout
      showProjectSelector={true}
      showSidebar={true}
      sidebarLinks={sidebarLinks}
      
      // Breadcrumbs
      showBreadcrumbs={true}
      breadcrumbs={breadcrumbs}
      
      // Header da página
      title="Gestão de Leads"
      subtitle="Gerencie seus leads e oportunidades de negócio de forma eficiente"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>
        </>
      }
      
      // Configuração da página
      maxWidth="7xl"
      variant="default"
      size="md"
    >
      {/* Conteúdo da página */}
      <div className="space-y-6">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Leads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Qualificados</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">456</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Users className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Em Negociação</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Convertidos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de leads */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Leads Recentes</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhum lead encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Comece criando seu primeiro lead ou importe uma lista existente.
              </p>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Lead
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LeadsPageExample;
