import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { SidebarHeader, SidebarSearch, SidebarNavigation, useLocalStorage } from './components/Sidebar';

interface LinkItem {
  name: string;
  route: string;
  category?: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface ModuleSidebarProps {
  links: LinkItem[];
}

const ModuleSidebar: React.FC<ModuleSidebarProps> = ({ links }) => {
  const { url } = usePage();

  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebar-collapsed', false);
  const [isPinned, setIsPinned] = useLocalStorage('sidebar-pinned', true);
  const [isMinimized, setIsMinimized] = useLocalStorage('sidebar-minimized', false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [lastActiveRoute, setLastActiveRoute] = useState<string>('');

  useEffect(() => {
    const activeLink = links.find((l) => url.includes(l.route.split('.')[0]));
    if (activeLink) setLastActiveRoute(activeLink.route);
  }, [url, links]);

  const filteredLinks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return links;
    return links.filter((l) => l.name.toLowerCase().includes(q));
  }, [links, searchQuery]);

  const categorizedLinks = useMemo(() => {
    const categories = new Map<string, LinkItem[]>();
    filteredLinks.forEach((link) => {
      const category = link.category || 'Geral';
      categories.set(category, [...(categories.get(category) || []), link]);
    });
    return Array.from(categories.entries());
  }, [filteredLinks]);

  const toggleCollapse = useCallback(() => setIsCollapsed((v) => !v), []);
  const togglePin = useCallback(() => setIsPinned((v) => !v), []);
  const toggleMinimize = useCallback(() => setIsMinimized((v) => !v), []);
  const clearSearch = useCallback(() => setSearchQuery(''), []);

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-80';
  const contentPadding = isCollapsed ? 'px-2' : 'px-4';

  return (
    <>

      {isPinned && !isCollapsed && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={toggleCollapse} />
      )}

      <aside
        className={cn(
          'fixed left-4 top-20 bottom-4 z-50 transition-all duration-500 ease-out rounded-2xl',
          'backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50',
          'hover:bg-white/90 dark:hover:bg-gray-900/90',
          !isPinned && !isHovered && 'translate-x-[-100%] opacity-0',
          !isPinned && isHovered && 'translate-x-0 opacity-100',
          sidebarWidth,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SidebarHeader
          isCollapsed={isCollapsed}
          isPinned={isPinned}
          isMinimized={isMinimized}
          filteredLinksCount={filteredLinks.length}
          contentPadding={contentPadding}
          onToggleCollapse={toggleCollapse}
          onTogglePin={togglePin}
          onToggleMinimize={toggleMinimize}
        />

        <SidebarSearch
          isCollapsed={isCollapsed}
          searchQuery={searchQuery}
          contentPadding={contentPadding}
          onSearchChange={setSearchQuery}
          onClearSearch={clearSearch}
        />

        <SidebarNavigation
          isCollapsed={isCollapsed}
          url={url}
          filteredLinks={filteredLinks}
          categorizedLinks={categorizedLinks}
          contentPadding={contentPadding}
          onClearSearch={clearSearch}
        />
      </aside>

      <div className={cn('transition-all duration-500 lg:block hidden', isPinned && !isMinimized ? (isCollapsed ? 'ml-20' : 'ml-84') : 'ml-0')} />
    </>
  );
};

export default ModuleSidebar;
