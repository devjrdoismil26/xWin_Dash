/**
 * Navega??o da sidebar com links categorizados
 *
 * @description
 * Renderiza navega??o da sidebar com links categorizados ou em modo colapsado.
 * Suporta busca, destaque de itens ativos e badges. Adapta layout baseado no estado.
 *
 * @module layouts/components/Sidebar/SidebarNavigation
 * @since 1.0.0
 */

import React from "react";
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import NavLink from "@/shared/components/ui/NavLink";
import Button from "@/shared/components/ui/Button";
import Badge from "@/shared/components/ui/Badge";
import Tooltip from "@/shared/components/ui/Tooltip";

/**
 * Item de link da navega??o
 *
 * @interface LinkItem
 * @property {string} name - Nome do link
 * @property {string} route - Rota do link
 * @property {string} [category] - Categoria do link para agrupamento
 * @property {React.ReactNode} [icon] - ?cone do link
 * @property {string} [badge] - Badge opcional para exibir no link
 */
interface LinkItem {
  name: string;
  route: string;
  category?: string;
  icon?: React.ReactNode;
  badge?: string; }

/**
 * Props do componente SidebarNavigation
 *
 * @interface SidebarNavigationProps
 * @property {boolean} isCollapsed - Se a sidebar est? colapsada
 * @property {LinkItem[]} filteredLinks - Lista de links filtrados (modo colapsado)
 * @property {[string, LinkItem[]][]} categorizedLinks - Links categorizados (modo expandido)
 * @property {string} currentUrl - URL atual para determinar item ativo
 * @property {string} contentPadding - Classes de padding para conte?do
 * @property {() => void} onClearSearch - Callback para limpar busca
 * @property {string} [className] - Classes CSS adicionais
 */
interface SidebarNavigationProps {
  isCollapsed: boolean;
  filteredLinks: LinkItem[];
  categorizedLinks: [string, LinkItem[]][];
  currentUrl: string;
  contentPadding: string;
  onClearSearch??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente SidebarNavigation
 *
 * @description
 * Renderiza navega??o da sidebar com links categorizados ou modo colapsado.
 * Detecta item ativo pela URL, exibe estado vazio quando n?o h? resultados e
 * suporta tooltips em modo colapsado.
 *
 * @param {SidebarNavigationProps} props - Props do componente
 * @returns {JSX.Element} Navega??o da sidebar
 *
 * @example
 * ```tsx
 * <SidebarNavigation
 *   isCollapsed={ false }
 *   filteredLinks={ links }
 *   categorizedLinks={ [['Categoria', links]] }
 *   currentUrl="/dashboard"
 *   contentPadding="px-4"
 *   onClearSearch={ () => setSearchQuery('') }
 * />
 * ```
 */
const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ isCollapsed,
  filteredLinks,
  categorizedLinks,
  currentUrl,
  contentPadding,
  onClearSearch,
  className = "",
   }) => {
  /**
   * Obt?m a URL completa de uma rota
   *
   * @description
   * Utiliza Ziggy route helper se dispon?vel, caso contr?rio gera URL simples.
   *
   * @param {string} route - Nome da rota (ex: 'dashboard.index')
   * @returns {string} URL completa da rota
   */
  const getHref = (route: string): string => {
    // Verificar se Ziggy est? dispon?vel (helper de rotas do Laravel)
    interface WindowWithZiggy extends Window {
      route?: (name: string, params?: Record<string, any>) => string;
    }

    const windowWithZiggy = window as WindowWithZiggy;

    if (windowWithZiggy.route) {
      return windowWithZiggy.route(route);

    }

    // Fallback: converter nome de rota para URL
    return `/${route.replace(".", "/")}`;};

  const isActive = (route: string) => {
    return currentUrl.includes(route.split(".")[0]);};

  if (isCollapsed) { return (
        <>
      <nav
        className={cn(
          "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300/50 dark:scrollbar-thumb-gray-600/50",
          contentPadding,
          "py-2",
          className,
        ) } />
      <div className="{(filteredLinks || []).map((link: unknown, index: unknown) => {">$2</div>
            const active = isActive(link.route);

            const href = getHref(link.route);

            return (
        <>
      <Tooltip key={index} content={link.name} placement="right" />
      <NavLink
                  href={ href }
                  active={ active }
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200",
                    "hover:bg-white/50 dark:hover:bg-gray-800/60",
                    "hover:scale-105 hover:shadow-lg",
                    active && "bg-primary/10 text-primary shadow-md scale-105",
                  ) } />
                  <div className="{link.icon}">$2</div>
                  </div>
                  {link.badge && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-red-500 text-white" />
                      {link.badge}
                    </Badge>
                  )}
                </NavLink>
              </Tooltip>);

          })}
        </div>
      </nav>);

  }

  return (
        <>
      <nav
      className={cn(
        "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300/50 dark:scrollbar-thumb-gray-600/50",
        contentPadding,
        "py-2",
        className,
      ) } />
      <div className="{categorizedLinks.length === 0 ? (">$2</div>
          <div className=" ">$2</div><Search className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400" />
              Nenhum item encontrado
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={ onClearSearch }
              className="mt-2" />
              Limpar busca
            </Button>
      </div>
    </>
  ) : (
          (categorizedLinks || []).map(([category, categoryLinks]) => (
            <div key={category} className="space-y-1">
           
        </div><h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 py-2" />
                {category}
              </h4>
              {(categoryLinks || []).map((link: unknown, index: unknown) => {
                const active = isActive(link.route);

                const href = getHref(link.route);

                return (
        <>
      <NavLink
                    key={`${category}-${index}`}
                    href={ href }
                    active={ active }
                    className={cn(
                      "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative overflow-hidden",
                      "hover:bg-white/50 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-[1.02]",
                      active && [
                        "bg-gradient-to-r from-primary/10 to-secondary/5",
                        "text-primary dark:text-primary-300",
                        "shadow-lg shadow-primary/10 border border-primary/20",
                      ],
                    ) } />
      <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                        "bg-white/50 dark:bg-gray-800/50",
                        "group-hover:bg-white dark:group-hover:bg-gray-700",
                        active && "bg-primary/20 text-primary",
                      )  }>
        </div>{link.icon}
                    </div>
                    <div className=" ">$2</div><div className=" ">$2</div><span className="{link.name}">$2</span>
                        </span>
                        {link.badge && (
                          <Badge
                            variant={ active ? "default" : "secondary" }
                            className="ml-2 text-xs" />
                            {link.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5" />
                        /{link.route}
                      </p></div><div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-r-full">
           
        </div></NavLink>);

              })}
            </div>
          ))
        )}
      </div>
    </nav>);};

export default SidebarNavigation;
