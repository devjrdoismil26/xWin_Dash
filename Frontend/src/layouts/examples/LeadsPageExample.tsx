import React from "react";
import { Plus, Filter, Download, Users } from 'lucide-react';
import AppLayout from "../AppLayout";
import Button from "@/shared/components/ui/Button";
import { MODULE_NAVIGATION } from '@/config/navigation';

/**
 * Componente LeadsPageExample - Exemplo de Página de Leads
 *
 * @description
 * Componente de exemplo que demonstra como usar o AppLayout para criar uma página
 * completa de Leads, incluindo configuração de sidebar, breadcrumbs, filtros,
 * ações e conteúdo. Serve como referência para implementação de outras páginas
 * similares no sistema.
 *
 * Funcionalidades demonstradas:
 * - Configuração de sidebar com links e categorias
 * - Breadcrumbs personalizados
 * - Header com título, subtítulo e ações
 * - Cards de estatísticas
 * - Tabela de dados com empty state
 * - Integração com componentes UI padrão
 *
 * @module layouts/examples/LeadsPageExample
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import LeadsPageExample from '@/layouts/examples/LeadsPageExample';
 *
 * // Usar como exemplo de referência
 * <LeadsPageExample / />
 * ```
 *
 * @returns {JSX.Element} Página de exemplo de Leads com layout completo
 */
const LeadsPageExample: React.FC = () => {
  // Configuração da sidebar para o módulo de Leads
  const sidebarLinks = [
    {
      name: "Todos os Leads",
      route: "leads.index",
      category: "Gestão",
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: "Leads Qualificados",
      route: "leads.qualified",
      category: "Gestão",
      icon: <Users className="w-4 h-4" />,
      badge: "12",
    },
    {
      name: "Funil de Vendas",
      route: "leads.funnel",
      category: "Análise",
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: "Relatórios",
      route: "leads.reports",
      category: "Análise",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  // Configuração dos breadcrumbs
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "CRM", href: "/leads" },
    { label: "Leads", active: true },
  ];

  return (
        <>
      <AppLayout
      // Configuração do layout
      showProjectSelector={ true }
      showSidebar={ true }
      sidebarLinks={ sidebarLinks }
      // Breadcrumbs
      showBreadcrumbs={ true }
      breadcrumbs={ breadcrumbs }
      // Header da página
      title="Gestão de Leads"
      subtitle="Gerencie seus leads e oportunidades de negócio de forma eficiente"
      actions={ </>
      <Button variant="outline" size="sm" />
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" />
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="primary" size="sm" />
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
      <div className="{/* Cards de estatísticas */}">$2</div>
        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Users className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div><div className=" ">$2</div><p className="text-sm font-medium text-gray-600 dark:text-gray-400" />
                  Total de Leads
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" />
                  1,234
                </p></div></div>

          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Users className="w-6 h-6 text-green-600 dark:text-green-400" /></div><div className=" ">$2</div><p className="text-sm font-medium text-gray-600 dark:text-gray-400" />
                  Qualificados
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" />
                  456
                </p></div></div>

          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Users className="w-6 h-6 text-yellow-600 dark:text-yellow-400" /></div><div className=" ">$2</div><p className="text-sm font-medium text-gray-600 dark:text-gray-400" />
                  Em Negociação
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" />
                  89
                </p></div></div>

          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Users className="w-6 h-6 text-purple-600 dark:text-purple-400" /></div><div className=" ">$2</div><p className="text-sm font-medium text-gray-600 dark:text-gray-400" />
                  Convertidos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" />
                  123
                </p></div></div>

        {/* Tabela de leads */}
        <div className=" ">$2</div><div className=" ">$2</div><h3 className="text-lg font-medium text-gray-900 dark:text-white" />
              Leads Recentes
            </h3></div><div className=" ">$2</div><div className=" ">$2</div><Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2" />
                Nenhum lead encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6" />
                Comece criando seu primeiro lead ou importe uma lista existente.
              </p>
              <Button variant="primary" />
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Lead
              </Button></div></div>
    </AppLayout>);};

export default LeadsPageExample;
