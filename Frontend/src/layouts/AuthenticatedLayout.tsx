/**
 * Layout Autenticado - AuthenticatedLayout
 *
 * @description
 * Layout para páginas que requerem autenticação. Inclui header com brand,
 * navegação principal, busca global, seletor de projeto e menu mobile.
 * Integra-se com Inertia.js para dados do backend e permissões do usuário.
 *
 * Funcionalidades principais:
 * - Header com brand e navegação
 * - Busca global com resultados filtrados
 * - Seletor de projeto opcional
 * - Menu mobile responsivo
 * - Filtragem de navegação por permissões
 * - Suporte a gestos touch (swipe)
 * - Integração com Inertia.js
 *
 * @module layouts/AuthenticatedLayout
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
 *
 * <AuthenticatedLayout showProjectSelector={ true } />
 *   Conteúdo autenticado
 * </AuthenticatedLayout>
 * ```
 */

import React, { useState, useMemo } from "react";
import { usePage } from '@inertiajs/react';
import ProjectSelector from "./ProjectSelector";
import GlobalSearch, { SearchResult } from "@/shared/components/ui/GlobalSearch";
import { Swipeable } from '@/shared/components/ui/TouchGestures';
// import { useResponsive } from '@/shared/components/ui/ResponsiveSystem';
import { MAIN_NAVIGATION, filterNavigationByPermissions,  } from '@/config/navigation';
import { HeaderBrand, HeaderActions, HeaderNavigation,  } from './components/Header';
import MobileMenu from "./components/MobileMenu";

/**
 * Props do AuthenticatedLayout
 */
export interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  user?: {
    id: string;
  name: string;
  email: string; };

  showProjectSelector?: boolean;
  className?: string;
}

/**
 * Interface de projeto
 *
 * @description
 * Estrutura de dados de um projeto.
 *
 * @interface Project
 * @property {string | number} id - ID único do projeto
 * @property {string} name - Nome do projeto
 * @property {string} [description] - Descrição opcional do projeto
 * @property {'active' | 'inactive' | 'archived'} [status] - Status do projeto
 * @property {string} [created_at] - Data de criação do projeto
 */
interface Project {
  id: string | number;
  name: string;
  description?: string;
  status?: "active" | "inactive" | "archived";
  created_at?: string; }

/**
 * Interface de usuário
 *
 * @description
 * Estrutura de dados do usuário autenticado.
 *
 * @interface User
 * @property {string | number} id - ID único do usuário
 * @property {string} name - Nome do usuário
 * @property {string} email - Email do usuário
 * @property {string[]} [permissions] - Lista de permissões do usuário
 * @property {string[]} [roles] - Lista de roles do usuário
 */
interface User {
  id: string | number;
  name: string;
  email: string;
  permissions?: string[];
  roles?: string[]; }

/**
 * Interface de props do Inertia com dados compartilhados
 *
 * @description
 * Estrutura das props compartilhadas pelo Inertia.js vindas do backend.
 *
 * @interface InertiaSharedProps
 * @property {Object} [auth] - Objeto de autenticação
 * @property {User | null} [auth.user] - Dados do usuário autenticado
 * @property {Object} [projects] - Objeto de projetos
 * @property {Project | null} [projects.active] - Projeto atualmente ativo
 * @property {Project[]} [projects.list] - Lista de projetos do usuário
 */
interface InertiaSharedProps {
  auth?: {
user?: User | null;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

  projects?: {
    active?: Project | null;
    list?: Project[];};

  [key: string]: unknown; // Index signature para satisfazer PageProps
}

/**
 * Props do componente AuthenticatedLayout
 *
 * @description
 * Propriedades que podem ser passadas para o componente AuthenticatedLayout.
 *
 * @interface AuthenticatedLayoutProps
 * @property {React.ReactNode} [header] - Header customizado
 * @property {React.ReactNode} children - Conteúdo do layout
 * @property {boolean} [showProjectSelector=true] - Mostrar seletor de projeto
 */
interface AuthenticatedLayoutProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  showProjectSelector?: boolean; }

/**
 * Componente AuthenticatedLayout
 *
 * @description
 * Renderiza o layout autenticado com header, navegação, busca global
 * e menu mobile. Filtra navegação por permissões do usuário.
 *
 * @component
 * @param {AuthenticatedLayoutProps} props - Props do componente
 * @returns {JSX.Element} Layout autenticado renderizado
 */
const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ header,
  children,
  showProjectSelector = true,
   }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const { url, props } = usePage<InertiaSharedProps>();

  // const { isTouchDevice, deviceType } = useResponsive();

  const isTouchDevice = false; // Temporário
  const deviceType = "desktop"; // Temporário

  // Dados do usuário e projetos vindos do backend
  const { auth, projects } = props;
  const user = auth?.user;
  const activeProject = projects?.active;
  const projectsList = projects?.list || [];
  const userPermissions = Array.isArray(user?.permissions)
    ? user.permissions
    : [];

  // Navegação filtrada por permissões
  const navigation = useMemo(
    () => filterNavigationByPermissions(MAIN_NAVIGATION, userPermissions),
    [userPermissions],);

  // Verificar se estamos no portal
  const isPortalPage = url.startsWith("/portal") || url.startsWith("/universe");

  // Função para verificar se a rota está ativa
  const isActiveRoute = (route: string, href: string) => {
    return url.startsWith(href) || url.includes(route);};

  /**
   * Função de busca global
   *
   * @description
   * Realiza busca global nos módulos da aplicação. Atualmente implementa
   * busca básica por palavras-chave. Deve ser expandida para buscar em
   * leads, campanhas, projetos e outros módulos via API.
   *
   * @param {string} query - Termo de busca
   * @returns {Promise<SearchResult[]>} Lista de resultados da busca
   */
  const handleGlobalSearch = async (query: string): Promise<SearchResult[]> => {
    // Implementar busca real nos módulos
    const results: SearchResult[] = [] as unknown[];

    // Busca em leads
    if (query.toLowerCase().includes("lead")) {
      results.push({
        id: "leads",
        title: "Leads",
        description: "Gerenciar leads e prospects",
        type: "page",
        icon: "👤",
      });

    }

    // Busca em campanhas
    if (query.toLowerCase().includes("campanha")) {
      results.push({
        id: "campaigns",
        title: "Campanhas",
        description: "Email marketing e campanhas",
        type: "page",
        icon: "📧",
      });

    }

    // Busca em projetos
    if (query.toLowerCase().includes("projeto")) {
      results.push({
        id: "projects",
        title: "Projetos",
        description: "Gerenciar projetos e tarefas",
        type: "page",
        icon: "📁",
      });

    }

    return results;};

  /**
   * Navegação para resultados da busca
   *
   * @description
   * Navega para a página correspondente ao resultado da busca selecionado.
   *
   * @param {SearchResult} result - Resultado da busca selecionado
   */
  const handleSearchNavigate = (result: SearchResult): void => {
    // Implementar navegação baseada no tipo de resultado
    if (result.type === "page") {
      window.location.href = `/${result.id}`;
    } ;

  // Touch gestures handlers
  const handleSwipeLeft = () => {
    if (isTouchDevice) {
      // Swipe left to open search
      setSearchOpen(true);

    } ;

  const handleSwipeRight = () => {
    if (isTouchDevice) {
      // Swipe right to close menu
      setMenuOpen(false);

    } ;

  return (
            <Swipeable
      onSwipeLeft={ handleSwipeLeft }
      onSwipeRight={ handleSwipeRight }
      className="min-h-screen bg-gray-50 dark:bg-gray-900" />
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40" />
        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><HeaderBrand>
          {/* Project Selector */}
              {showProjectSelector && (
                <div className=" ">$2</div><ProjectSelector
                    projects={ projectsList }
                    activeProject={ activeProject }
                  / />
                </div>
              )}

              {/* Monitor Navigation */}
              <HeaderNavigation isPortalPage={isPortalPage} / />
            </div>

            {/* Right side - Search, Notifications and User Menu */}
            <HeaderActions onSearchOpen={ () => setSearchOpen(true) } />

            <MobileMenu
              isOpen={ menuOpen }
              onToggle={ () => setMenuOpen(!menuOpen) }
              navigation={ navigation as Array<{ name: string; href: string; route: string; icon: React.ComponentType<{ className?: string  }> }>}
              isActiveRoute={ isActiveRoute }
              showProjectSelector={ showProjectSelector }
              projectsList={ projectsList }
              activeProject={ activeProject } /></div></nav>

      {/* Header */}
      {header && (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700" />
          <div className="{header}">$2</div>
          </div>
      </header>
    </>
  )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={ searchOpen }
        onClose={ () => setSearchOpen(false) }
        onNavigate={ handleSearchNavigate }
        search={ handleGlobalSearch }
        placeholder="Buscar em tudo..." />
    </Swipeable>);};

export default AuthenticatedLayout;
