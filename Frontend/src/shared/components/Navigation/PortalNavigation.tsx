/**
 * Componente PortalNavigation
 *
 * @description
 * Componente de navegação para o portal que exibe links baseados no
 * projeto ativo e modo do projeto. Adapta itens visíveis dinamicamente.
 *
 * @module components/Navigation/PortalNavigation
 * @since 1.0.0
 */

import React, { useMemo } from "react";
import { Link, usePage } from '@inertiajs/react';
import { Home, Sparkles, LayoutGrid, Users, Mail, Share2, MessageCircle, Target, Brain, BarChart3, Image, Package, Activity, Settings,  } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProject } from '@/contexts/ProjectContext';

/**
 * Interface de item de navegação
 */
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string;
}>;
  isPrimary?: boolean;
  show: boolean;
}

/**
 * Props do componente PortalNavigation
 *
 * @interface PortalNavigationProps
 * @property {string} [className] - Classes CSS adicionais (opcional)
 */
interface PortalNavigationProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente PortalNavigation
 *
 * @description
 * Navegação dinâmica para o portal que:
 * - Exibe itens baseados no projeto ativo
 * - Adapta visibilidade baseada no modo do projeto
 * - Destaca itens primários (Portal Hub, Universe)
 * - Indica rota ativa
 *
 * @param {PortalNavigationProps} props - Props do componente
 * @param {string} [props.className] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de navegação do portal
 *
 * @example
 * ```tsx
 * <PortalNavigation className="custom-class" />
 * ```
 */
const PortalNavigation: React.FC<PortalNavigationProps> = ({ className    }) => {
  const { activeProject, projectMode } = useProject();

  const { url } = usePage();

  /**
   * Itens de navegação disponíveis
   *
   * @description
   * Lista de itens de navegação que são filtrados e exibidos
   * baseados no projeto ativo e modo do projeto.
   */
  const navigationItems: NavigationItem[] = useMemo(
    () => [
      {
        name: "Portal Hub",
        href: "/portal",
        icon: Home,
        isPrimary: true,
        show: true,
      },
      {
        name: "Universe",
        href: "/universe",
        icon: Sparkles,
        isPrimary: true,
        show: true,
      },
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutGrid,
        show: Boolean(activeProject && projectMode === "normal"),
      },
      {
        name: "Leads",
        href: "/leads",
        icon: Users,
        show: Boolean(activeProject),
      },
      {
        name: "Email Marketing",
        href: "/email-marketing",
        icon: Mail,
        show: Boolean(activeProject),
      },
      {
        name: "Social Buffer",
        href: "/social-buffer",
        icon: Share2,
        show: Boolean(activeProject),
      },
      {
        name: "Aura WhatsApp",
        href: "/aura",
        icon: MessageCircle,
        show: Boolean(activeProject),
      },
      {
        name: "Ads Tool",
        href: "/adstool",
        icon: Target,
        show: Boolean(activeProject),
      },
      {
        name: "AI Laboratory",
        href: "/ai",
        icon: Brain,
        show: Boolean(activeProject),
      },
      {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        show: Boolean(activeProject),
      },
      {
        name: "Mídia",
        href: "/media",
        icon: Image,
        show: Boolean(activeProject),
      },
      {
        name: "Produtos",
        href: "/products",
        icon: Package,
        show: Boolean(activeProject),
      },
      {
        name: "Workflows",
        href: "/workflows",
        icon: Activity,
        show: Boolean(activeProject),
      },
      {
        name: "Configurações",
        href: "/settings",
        icon: Settings,
        show: true,
      },
    ],
    [activeProject, projectMode],);

  /**
   * Itens visíveis de navegação
   *
   * @description
   * Filtra apenas os itens que devem ser exibidos baseado na propriedade `show`.
   */
  const visibleItems = useMemo(() => {
    return (navigationItems || []).filter((item: unknown) => item.show);

  }, [navigationItems]);

  /**
   * Verifica se uma rota está ativa
   *
   * @param {string} href - Caminho da rota
   * @returns {boolean} Se a rota está ativa
   */
  const isRouteActive = (href: string): boolean => {
    return url === href || url.startsWith(`${href}/`);};

  return (
            <nav
      className={cn("space-y-1", className)} aria-label="Navegação do portal" />
      {(visibleItems || []).map((item: unknown) => {
        const isActive = isRouteActive(item.href);

        const Icon = item.icon;

        return (
        <>
      <Link
            key={ item.name }
            href={ item.href }
            className={cn(
              "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? item.isPrimary
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                : item.isPrimary
                  ? "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
            ) } />
      <Icon
              className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                isActive
                  ? item.isPrimary
                    ? "text-white"
                    : "text-slate-500 dark:text-slate-400"
                  : "text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300",
              )  }>
          {item.name}
            {item.isPrimary && (
              <span className="{item.name === "Portal Hub" ? "Hub" : "AI"}">$2</span>
      </span>
    </>
  )}
          </Link>);

      })}
    </nav>);};

export default PortalNavigation;
