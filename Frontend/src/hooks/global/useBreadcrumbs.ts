/**
 * Hook para gerenciar breadcrumbs
 *
 * @description
 * Retorna a lista de breadcrumbs a partir da URL atual e do breadcrumbConfig.
 * Suporta parâmetros dinâmicos do tipo ":id" nas rotas.
 *
 * @module hooks/global/useBreadcrumbs
 * @since 1.0.0
 */

import { usePage } from '@inertiajs/react';
import { breadcrumbConfig, BreadcrumbItem, BreadcrumbConfig,  } from './breadcrumbConfig';

/**
 * Retorno do hook useBreadcrumbs
 *
 * @interface UseBreadcrumbsReturn
 * @property {BreadcrumbItem[] | null} breadcrumbs - Lista de breadcrumbs encontrada ou null se não houver correspondência
 * @property {string} currentPath - Caminho atual da URL (sem query string)
 * @property {boolean} hasBreadcrumbs - Indica se há breadcrumbs disponíveis
 */
export interface UseBreadcrumbsReturn {
  breadcrumbs: BreadcrumbItem[] | null;
  currentPath: string;
  hasBreadcrumbs: boolean; }

/**
 * Hook para gerenciar breadcrumbs dinamicamente
 *
 * @description
 * Analisa a URL atual e retorna os breadcrumbs correspondentes do breadcrumbConfig.
 * Substitui parâmetros dinâmicos (ex: ":id") pelos valores reais da rota.
 *
 * @returns {UseBreadcrumbsReturn} Objeto contendo breadcrumbs, caminho atual e flag de existência
 *
 * @example
 * ```tsx
 * const { breadcrumbs, currentPath, hasBreadcrumbs } = useBreadcrumbs();

 *
 * if (hasBreadcrumbs) {
 *   breadcrumbs?.map(breadcrumb => (
 *     <Link key={breadcrumb.label} to={ breadcrumb.href } />
 *       {breadcrumb.label}
 *     </Link>
 *   ));

 * }
 * ```
 */
export const useBreadcrumbs = (): UseBreadcrumbsReturn => {
  const page = usePage();

  const url = page.url;
  const params = (page.props as { params?: Record<string, any> })?.params || {};

  const currentPath = (url || "").split("?")[0];

  const matchedConfig = breadcrumbConfig.find(({ path }: BreadcrumbConfig) => {
    const pathSegments = String(path).split("/").filter(Boolean);

    const currentPathSegments = String(currentPath).split("/").filter(Boolean);

    if (pathSegments.length !== currentPathSegments.length) return false;

    return pathSegments.every(
      (segment: unknown, index: unknown) =>
        segment.startsWith(":") || segment === currentPathSegments[index],);

  });

  if (!matchedConfig) {
    return {
      breadcrumbs: null,
      currentPath,
      hasBreadcrumbs: false,};

  }

  // Substitui os parâmetros dinâmicos nos hrefs
  const breadcrumbs = (matchedConfig.breadcrumbs || []).map(
    (breadcrumb: BreadcrumbItem) => {
      if (!breadcrumb.href) return breadcrumb;

      let href = breadcrumb.href;
      for (const [key, value] of Object.entries(params)) {
        href = href.replace(`:${key}`, String(value));

      }

      return { ...breadcrumb, href};

    },);

  return {
    breadcrumbs,
    currentPath,
    hasBreadcrumbs: breadcrumbs.length > 0,};
};

export default useBreadcrumbs;
