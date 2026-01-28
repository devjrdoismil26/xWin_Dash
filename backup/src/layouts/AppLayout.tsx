import React, { useMemo } from 'react';
import AuthenticatedLayout from './AuthenticatedLayout';
import PageLayout, { PageLayoutProps } from './PageLayout';
import ModuleSidebar from './ModuleSidebar';
import GlassmorphismSidebar from '@/components/Navigation/GlassmorphismSidebar';
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs';
import { cn } from '@/lib/utils';

interface LinkItem {
  name: string;
  route: string;
  category?: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface AppLayoutProps extends Omit<PageLayoutProps, 'breadcrumbs'> {
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
 * Layout principal da aplicação que combina todos os layouts de forma consistente
 * 
 * Features:
 * - Navegação principal (AuthenticatedLayout)
 * - Sidebar modular opcional (ModuleSidebar)
 * - Breadcrumbs automáticos
 * - Layout de página flexível (PageLayout)
 * - Suporte completo ao design system
 * - Responsividade total
 * - Tema dark/light
 */
const AppLayout: React.FC<AppLayoutProps> = ({
  // Layout props
  showProjectSelector = true,
  showSidebar = false,
  sidebarLinks = [],
  useGlassmorphismSidebar = true,
  
  // Breadcrumbs props
  breadcrumbs = [],
  showBreadcrumbs = false,
  
  // Header props
  title,
  subtitle,
  actions,
  headerActions,
  showHeader = true,
  
  // Page props
  padded = true,
  maxWidth = '7xl',
  centered = true,
  size = 'md',
  variant = 'default',
  className = '',
  headerClassName = '',
  contentClassName = '',
  
  // Content
  children,
}) => {
  // Combinar actions do header com headerActions
  const combinedActions = useMemo(() => (
    <div className="flex items-center gap-2">
      {actions}
      {headerActions}
    </div>
  ), [actions, headerActions]);

  // Renderizar breadcrumbs se necessário
  const breadcrumbsComponent = showBreadcrumbs && breadcrumbs.length > 0 ? (
    <div className="px-4 py-3">
      <div className={cn('mx-auto', maxWidth === 'full' ? 'max-w-7xl' : `max-w-${maxWidth}`)}>
        <Breadcrumbs items={breadcrumbs} />
      </div>
    </div>
  ) : null;

  return (
    <AuthenticatedLayout 
      showProjectSelector={showProjectSelector}
      header={
        showHeader && (title || subtitle || combinedActions) ? (
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              {title && (
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
            {(actions || headerActions) && (
              <div className="flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {combinedActions}
              </div>
            )}
          </div>
        ) : undefined
      }
    >
      <div className="flex min-h-screen">
        {/* Sidebar */}
        {showSidebar && (
          useGlassmorphismSidebar ? (
            <GlassmorphismSidebar />
          ) : (
            sidebarLinks.length > 0 && <ModuleSidebar links={sidebarLinks} />
          )
        )}
        
        {/* Conteúdo Principal */}
        <div className="flex-1">
          <PageLayout
            showHeader={false} // Header já está no AuthenticatedLayout
            breadcrumbs={breadcrumbsComponent}
            padded={padded}
            maxWidth={maxWidth}
            centered={centered}
            size={size}
            variant={variant}
            className={className}
            headerClassName={headerClassName}
            contentClassName={contentClassName}
          >
            {children}
          </PageLayout>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default AppLayout;
