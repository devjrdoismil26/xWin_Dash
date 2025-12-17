/**
 * Layout Principal da Aplicação - AppLayout
 *
 * @description
 * Layout principal que combina todos os layouts de forma consistente.
 * Integra AuthenticatedLayout, ModuleSidebar, GlassmorphismSidebar, Breadcrumbs
 * e PageLayout em um único componente reutilizável.
 *
 * Funcionalidades principais:
 * - Navegação principal (AuthenticatedLayout)
 * - Sidebar modular opcional (ModuleSidebar ou GlassmorphismSidebar)
 * - Breadcrumbs automáticos
 * - Layout de página flexível (PageLayout)
 * - Seletor de projeto opcional
 * - Suporte completo ao design system
 * - Responsividade total
 * - Tema dark/light
 *
 * @module layouts/AppLayout
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import AppLayout from '@/layouts/AppLayout';
 *
 * <AppLayout
 *   title="Dashboard"
 *   showSidebar={ true }
 *   sidebarLinks={ [...] }
 *   breadcrumbs={[{ label: 'Home', href: '/' }]}
 * />
 *   Conteúdo da página
 * </AppLayout>
 * ```
 */

import React, { useMemo } from "react";
import AuthenticatedLayout from "./AuthenticatedLayout";
import PageLayout, { PageLayoutProps } from "./PageLayout";
import ModuleSidebar from "./ModuleSidebar";
import GlassmorphismSidebar from "@/shared/components/Navigation/GlassmorphismSidebar";
import Breadcrumbs, { BreadcrumbItem } from "./Breadcrumbs";
import { cn } from '@/lib/utils';

/**
 * Item de link da sidebar
 *
 * @interface LinkItem
 * @property {string} name - Nome do link
 * @property {string} route - Rota do link
 * @property {string} [category] - Categoria do link
 * @property {React.ReactNode} [icon] - Ícone do link
 * @property {string} [badge] - Badge a ser exibido
 */
interface LinkItem {
  name: string;
  route: string;
  category?: string;
  icon?: React.ReactNode;
  badge?: string; }

/**
 * Props do componente AppLayout
 *
 * @description
 * Propriedades que podem ser passadas para o componente AppLayout.
 * Estende PageLayoutProps e adiciona propriedades específicas do AppLayout.
 *
 * @interface AppLayoutProps
 * @extends Omit<PageLayoutProps, 'breadcrumbs' />
 * @property {boolean} [showProjectSelector=true] - Mostrar seletor de projeto
 * @property {boolean} [showSidebar=false] - Mostrar sidebar
 * @property {LinkItem[]} [sidebarLinks=[]] - Links da sidebar
 * @property {boolean} [useGlassmorphismSidebar=true] - Usar GlassmorphismSidebar ao invés de ModuleSidebar
 * @property {BreadcrumbItem[]} [breadcrumbs=[]] - Itens de breadcrumb
 * @property {boolean} [showBreadcrumbs=false] - Mostrar breadcrumbs
 * @property {React.ReactNode} [headerActions] - Ações customizadas do header
 * @property {React.ReactNode} children - Conteúdo do layout
 */
interface AppLayoutProps extends Omit<PageLayoutProps, "breadcrumbs"> {
  // Layout Configuration
  showProjectSelector?: boolean;
  showSidebar?: boolean;
  sidebarLinks?: LinkItem[];
  useGlassmorphismSidebar?: boolean;

  // Breadcrumbs
  breadcrumbs?: BreadcrumbItem[];
  showBreadcrumbs?: boolean;

  // Header customization
  headerActions?: React.ReactNode;

  // Content
  children: React.ReactNode;
}

/**
 * Componente AppLayout
 *
 * @description
 * Renderiza o layout principal da aplicação combinando todos os sub-layouts.
 * Gerencia sidebar, breadcrumbs, header e conteúdo de forma consistente.
 *
 * @component
 * @param {AppLayoutProps} props - Props do componente
 * @returns {JSX.Element} Layout principal renderizado
 */
const AppLayout: React.FC<AppLayoutProps> = ({ // Layout props
  showProjectSelector = true,
  showSidebar = false,
  sidebarLinks = [] as unknown[],
  useGlassmorphismSidebar = true,

  // Breadcrumbs props
  breadcrumbs = [] as unknown[],
  showBreadcrumbs = false,

  // Header props
  title,
  subtitle,
  actions,
  headerActions,
  showHeader = true,

  // Page props
  padded = true,
  maxWidth = "7xl",
  centered = true,
  size = "md",
  variant = "default",
  className = "",
  headerClassName = "",
  contentClassName = "",

  // Content
  children,
   }) => {
  // Combinar actions do header com headerActions
  const combinedActions = useMemo(
    () => (
      <div className="{actions}">$2</div>
        {headerActions}
      </div>
    ),
    [actions, headerActions],);

  // Renderizar breadcrumbs se necessário
  const breadcrumbsComponent =
    showBreadcrumbs && breadcrumbs.length > 0 ? (
      <div className=" ">$2</div><div
          className={cn(
            "mx-auto",
            maxWidth === "full" ? "max-w-7xl" : `max-w-${maxWidth} `,
          )}>
           
        </div><Breadcrumbs items={breadcrumbs} / />
        </div>
    ) : null;

  return (
            <AuthenticatedLayout
      showProjectSelector={ showProjectSelector }
      header={ showHeader && (title || subtitle || combinedActions) ? (
          <div className=" ">$2</div><div className="{title && (">$2</div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate" />
                  {title }
                </h1>
              )}
              {subtitle && (
                <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl" />
                  {subtitle}
                </p>
              )}
            </div>
            {(actions || headerActions) && (
              <div className="{combinedActions}">$2</div>
    </div>
  )}
          </div>
        ) : undefined
      }
  >
      <div className="{/* Sidebar */}">$2</div>
        {showSidebar &&
          (useGlassmorphismSidebar ? (
            <GlassmorphismSidebar / />
          ) : (
            sidebarLinks.length > 0 && <ModuleSidebar links={sidebarLinks} / />
          ))}

        {/* Conteúdo Principal */}
        <div className=" ">$2</div><PageLayout
            showHeader={false} // Header já está no AuthenticatedLayout
            breadcrumbs={ breadcrumbsComponent }
            padded={ padded }
            maxWidth={ maxWidth }
            centered={ centered }
            size={ size }
            variant={ variant }
            className={className} headerClassName={ headerClassName }
            contentClassName={ contentClassName } />
            {children}
          </PageLayout></div></AuthenticatedLayout>);};

export default AppLayout;
