/**
 * Componente MobileMenu - Menu Mobile
 *
 * @description
 * Componente de menu mobile responsivo que exibe navega??o e seletor de projeto
 * em dispositivos m?veis. Suporta toggle de abertura/fechamento, navega??o
 * com indicadores de rota ativa e integra??o com ProjectSelector.
 *
 * Funcionalidades principais:
 * - Menu hamburguer com toggle
 * - Navega??o mobile responsiva
 * - Indicadores de rota ativa
 * - Integra??o com ProjectSelector opcional
 * - Suporte completo a dark mode
 * - Acessibilidade (ARIA labels)
 * - Transi??es suaves
 *
 * @module layouts/components/MobileMenu
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import MobileMenu from '@/layouts/components/MobileMenu';
 *
 * <MobileMenu
 *   isOpen={ isMenuOpen }
 *   onToggle={ () => setIsMenuOpen(!isMenuOpen) }
 *   navigation={ navigationItems }
 *   isActiveRoute={ (route: unknown, href: unknown) => route === href }
 *   showProjectSelector={ true }
 *   projectsList={ projects }
 *   activeProject={ currentProject }
 * />
 * ```
 */

import React from "react";
import { Menu, X } from 'lucide-react';
import NavLink from "@/shared/components/ui/NavLink";
import ProjectSelector from "../ProjectSelector";
import { cn } from '@/lib/utils';

/**
 * Item de navega??o
 *
 * @interface NavigationItem
 * @property {string} name - Nome do item de navega??o
 * @property {string} href - URL do item
 * @property {string} route - Rota do item
 * @property {React.ComponentType} icon - Componente de ?cone
 */
interface NavigationItem {
  name: string;
  href: string;
  route: string;
  icon: React.ComponentType<{ className?: string;
}>;
}

/**
 * Props do componente MobileMenu
 *
 * @description
 * Propriedades que podem ser passadas para o componente MobileMenu.
 *
 * @interface MobileMenuProps
 * @property {boolean} isOpen - Se o menu est? aberto
 * @property {() => void} onToggle - Fun??o chamada ao alternar o menu
 * @property {NavigationItem[]} navigation - Array de itens de navega??o
 * @property {(route: string, href: string) => boolean} isActiveRoute - Fun??o para verificar se rota est? ativa
 * @property {boolean} showProjectSelector - Se deve mostrar o seletor de projeto
 * @property {Project[]} projectsList - Lista de projetos dispon?veis
 * @property {Project | null | undefined} activeProject - Projeto atualmente selecionado
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 */
interface Project {
  id: string | number;
  name: string;
  description?: string;
  status?: "active" | "inactive" | "archived";
  created_at?: string; }

interface MobileMenuProps {
  isOpen: boolean;
  onToggle??: (e: any) => void;
  navigation: NavigationItem[];
  isActiveRoute: (route: string, href: string) => boolean;
  showProjectSelector: boolean;
  projectsList: Project[];
  activeProject: Project | null | undefined;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente MobileMenu
 *
 * @description
 * Renderiza um menu mobile com navega??o e seletor de projeto opcional.
 * Gerencia estado de abertura/fechamento e exibe itens de navega??o com
 * indicadores visuais de rota ativa.
 *
 * @component
 * @param {MobileMenuProps} props - Props do componente
 * @param {boolean} props.isOpen - Se o menu est? aberto
 * @param {() => void} props.onToggle - Fun??o ao alternar o menu
 * @param {NavigationItem[]} props.navigation - Itens de navega??o
 * @param {(route: string, href: string) => boolean} props.isActiveRoute - Verificar rota ativa
 * @param {boolean} props.showProjectSelector - Se mostra seletor de projeto
 * @param {Project[]} props.projectsList - Lista de projetos
 * @param {any} props.activeProject - Projeto ativo
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de menu mobile
 */
const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen,
  onToggle,
  navigation,
  isActiveRoute,
  showProjectSelector,
  projectsList,
  activeProject,
  className = "",
   }) => {
  return (
            <>
      {/* Mobile menu button */}
      <div className={`flex items-center sm:hidden ${className} `}>
           
        </div><button
          onClick={ onToggle }
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors" />
          <span className="sr-only">Abrir menu principal</span>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu content */}
      {isOpen && (
        <div className=" ">$2</div><div className="{(navigation || []).map((item: unknown) => {">$2</div>
              const isActive = isActiveRoute(item.route, item.href);

              return (
        <>
      <NavLink
                  key={ item.href }
                  href={ item.href }
                  active={ isActive }
                  className={cn(
                    "flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700",
                  ) } />
      <item.icon className="h-4 w-4" />
                  <span className="ml-3">{item.name}</span>
                </NavLink>);

            })}
          </div>

          {/* Mobile Project Selector */}
          {showProjectSelector && (
            <div className=" ">$2</div><div className=" ">$2</div><ProjectSelector
                  projects={ projectsList }
                  activeProject={ activeProject }
                / />
              </div>
          )}
        </div>
      )}
    </>);};

export default MobileMenu;
