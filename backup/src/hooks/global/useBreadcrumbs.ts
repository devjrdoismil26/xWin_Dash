/**
 * Hook para gerenciar breadcrumbs
 * Retorna a lista de breadcrumbs a partir da URL atual e do breadcrumbConfig
 * Suporta parâmetros dinâmicos do tipo ":id"
 */
import { usePage } from '@inertiajs/react';
import { breadcrumbConfig, BreadcrumbItem, BreadcrumbConfig } from './breadcrumbConfig';

export interface UseBreadcrumbsReturn {
  breadcrumbs: BreadcrumbItem[] | null;
  currentPath: string;
  hasBreadcrumbs: boolean;
}

export const useBreadcrumbs = (): UseBreadcrumbsReturn => {
  const { url, params = {} } = usePage();
  const currentPath = (url || '').split('?')[0];

  const matchedConfig = breadcrumbConfig.find(({ path }: BreadcrumbConfig) => {
    const pathSegments = String(path).split('/').filter(Boolean);
    const currentPathSegments = String(currentPath).split('/').filter(Boolean);
    
    if (pathSegments.length !== currentPathSegments.length) return false;
    
    return pathSegments.every((segment, index) => 
      segment.startsWith(':') || segment === currentPathSegments[index]
    );
  });

  if (!matchedConfig) {
    return {
      breadcrumbs: null,
      currentPath,
      hasBreadcrumbs: false
    };
  }

  // Substitui os parâmetros dinâmicos nos hrefs
  const breadcrumbs = (matchedConfig.breadcrumbs || []).map((breadcrumb: BreadcrumbItem) => {
    if (!breadcrumb.href) return breadcrumb;
    
    let href = breadcrumb.href;
    for (const [key, value] of Object.entries(params)) {
      href = href.replace(`:${key}`, String(value));
    }
    
    return { ...breadcrumb, href };
  });

  return {
    breadcrumbs,
    currentPath,
    hasBreadcrumbs: breadcrumbs.length > 0
  };
};

export default useBreadcrumbs;
