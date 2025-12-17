/**
 * Componente DynamicNavigation
 *
 * @description
 * Componente de navega??o din?mica que renderiza rotas baseadas em
 * configura??o, autentica??o e permiss?es do usu?rio. Filtra rotas
 * vis?veis de acordo com o estado de autentica??o e permiss?es.
 *
 * @module components/Navigation/DynamicNavigation
 * @since 1.0.0
 */

import React, { useMemo } from "react";
import { Link, usePage } from '@inertiajs/react';
import { routesConfig } from '@/config/routes';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

/**
 * Componente DynamicNavigation
 *
 * @description
 * Renderiza uma lista de links de navega??o baseada em configura??o
 * de rotas, filtrando por autentica??o e permiss?es.
 *
 * @returns {JSX.Element} Componente de navega??o din?mica
 *
 * @example
 * ```tsx
 * <DynamicNavigation / />
 * ```
 */
const DynamicNavigation: React.FC = () => {
  const { url } = usePage();

  const { user, isAuthenticated } = useAuth();

  /**
   * Filtra rotas vis?veis baseado em autentica??o e permiss?es
   *
   * @description
   * Retorna apenas rotas que o usu?rio tem permiss?o para acessar.
   *
   * @returns {Array} Array de rotas vis?veis
   */
  const visibleRoutes = useMemo(() => {
    return (routesConfig || []).filter((route: unknown) => {
      // Verificar se requer autentica??o
      if (route.requiresAuth && !isAuthenticated) {
        return false;
      }

      // Verificar permiss?es se necess?rio
      if (route.requiredPermissions && route.requiredPermissions.length > 0) {
        const userPermissions = user?.permissions || [];
        const hasAllPermissions = route.requiredPermissions.every(
          (permission: unknown) => userPermissions.includes(permission),);

        if (!hasAllPermissions) {
          return false;
        } return true;
    });

  }, [routesConfig, isAuthenticated, user?.permissions]);

  /**
   * Verifica se uma rota est? ativa
   *
   * @param {string} routePath - Caminho da rota
   * @returns {boolean} Se a rota est? ativa
   */
  const isRouteActive = (routePath: string): boolean => {
    return url.startsWith(routePath);};

  return (
            <nav className="space-y-1" aria-label="Navega??o principal" />
      {(visibleRoutes || []).map((route: unknown) => {
        const isActive = isRouteActive(route.path);

        return (
                  <Link
            key={ route.path }
            href={ route.path }
            className={cn(
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
            )} aria-current={ isActive ? "page" : undefined } />
            {route.icon && (
              <span
                className={cn(
                  "mr-3 h-6 w-6 flex items-center justify-center",
                  isActive
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500",
                )} aria-hidden="true">
           
        </span>{route.icon}
              </span>
            )}
            <span>{route.name}</span>
          </Link>);

      })}
    </nav>);};

export default DynamicNavigation;
