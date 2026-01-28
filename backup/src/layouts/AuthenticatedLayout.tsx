import React, { useState, useMemo } from "react";
import { usePage } from "@inertiajs/react";
import ProjectSelector from "./ProjectSelector";
import GlobalSearch from "@/components/ui/GlobalSearch";
import { Swipeable } from "@/components/ui/TouchGestures";
// import { useResponsive } from "@/components/ui/ResponsiveSystem";
import {
  MAIN_NAVIGATION,
  filterNavigationByPermissions,
} from "@/config/navigation.tsx";
import { HeaderBrand, HeaderActions, HeaderNavigation } from "./components/Header";
import MobileMenu from "./components/MobileMenu";

interface AuthenticatedLayoutProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  showProjectSelector?: boolean;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  header,
  children,
  showProjectSelector = true,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { url, props } = usePage();
  // const { isTouchDevice, deviceType } = useResponsive();
  const isTouchDevice = false; // Temporário
  const deviceType = 'desktop'; // Temporário

  // Dados do usuário e projetos vindos do backend
  const { auth, projects } = props as any;
  const user = auth?.user;
  const activeProject = projects?.active;
  const projectsList = projects?.list || [];
  const userPermissions = Array.isArray(user?.permissions) ? user.permissions : [];

  // Navegação filtrada por permissões
  const navigation = useMemo(
    () => filterNavigationByPermissions(MAIN_NAVIGATION, userPermissions),
    [userPermissions]
  );

  // Verificar se estamos no portal
  const isPortalPage = url.startsWith('/portal') || url.startsWith('/universe');

  // Função para verificar se a rota está ativa
  const isActiveRoute = (route: string, href: string) => {
    return url.startsWith(href) || url.includes(route);
  };

  // Função de busca global
  const handleGlobalSearch = async (query: string) => {
    // Implementar busca real nos módulos
    const results = [];
    
    // Busca em leads
    if (query.toLowerCase().includes('lead')) {
      results.push({
        id: 'leads',
        title: 'Leads',
        description: 'Gerenciar leads e prospects',
        type: 'page',
        icon: '👤'
      });
    }
    
    // Busca em campanhas
    if (query.toLowerCase().includes('campanha')) {
      results.push({
        id: 'campaigns',
        title: 'Campanhas',
        description: 'Email marketing e campanhas',
        type: 'page',
        icon: '📧'
      });
    }
    
    // Busca em projetos
    if (query.toLowerCase().includes('projeto')) {
      results.push({
        id: 'projects',
        title: 'Projetos',
        description: 'Gerenciar projetos e tarefas',
        type: 'page',
        icon: '📁'
      });
    }
    
    return results;
  };

  // Navegação para resultados da busca
  const handleSearchNavigate = (result: any) => {
    // Implementar navegação baseada no tipo de resultado
    if (result.type === 'page') {
      window.location.href = `/${result.id}`;
    }
  };

  // Touch gestures handlers
  const handleSwipeLeft = () => {
    if (isTouchDevice && deviceType === 'mobile') {
      // Swipe left to open search
      setSearchOpen(true);
    }
  };

  const handleSwipeRight = () => {
    if (isTouchDevice && deviceType === 'mobile') {
      // Swipe right to close menu
      setMenuOpen(false);
    }
  };

  return (
    <Swipeable 
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <HeaderBrand />

              {/* Project Selector */}
              {showProjectSelector && (
                <div className="ml-6">
                  <ProjectSelector
                    projects={projectsList}
                    activeProject={activeProject}
                  />
                </div>
              )}

              {/* Desktop Navigation */}
              <HeaderNavigation isPortalPage={isPortalPage} />
            </div>

            {/* Right side - Search, Notifications and User Menu */}
            <HeaderActions onSearchOpen={() => setSearchOpen(true)} />

            <MobileMenu
              isOpen={menuOpen}
              onToggle={() => setMenuOpen(!menuOpen)}
              navigation={navigation}
              isActiveRoute={isActiveRoute}
              showProjectSelector={showProjectSelector}
              projectsList={projectsList}
              activeProject={activeProject}
            />
          </div>
        </div>
      </nav>

      {/* Header */}
      {header && (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleSearchNavigate}
        search={handleGlobalSearch}
        placeholder="Buscar em tudo..."
      />
    </Swipeable>
  );
};

export default AuthenticatedLayout;
