import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import NavLink from '@/components/ui/NavLink';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Tooltip from '@/components/ui/Tooltip';

interface LinkItem {
  name: string;
  route: string;
  category?: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface SidebarNavigationProps {
  isCollapsed: boolean;
  filteredLinks: LinkItem[];
  categorizedLinks: [string, LinkItem[]][];
  currentUrl: string;
  contentPadding: string;
  onClearSearch: () => void;
  className?: string;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  isCollapsed,
  filteredLinks,
  categorizedLinks,
  currentUrl,
  contentPadding,
  onClearSearch,
  className = ''
}) => {
  const getHref = (route: string) => {
    return (window as any).route ? (window as any).route(route) : `/${route}`;
  };

  const isActive = (route: string) => {
    return currentUrl.includes(route.split('.')[0]);
  };

  if (isCollapsed) {
    return (
      <nav className={cn('flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300/50 dark:scrollbar-thumb-gray-600/50', contentPadding, 'py-2', className)}>
        <div className="space-y-1">
          {filteredLinks.map((link, index) => {
            const active = isActive(link.route);
            const href = getHref(link.route);
            
            return (
              <Tooltip key={index} content={link.name} placement="right">
                <NavLink 
                  href={href} 
                  active={active} 
                  className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200',
                    'hover:bg-white/50 dark:hover:bg-gray-800/60',
                    'hover:scale-105 hover:shadow-lg',
                    active && 'bg-primary/10 text-primary shadow-md scale-105'
                  )}
                >
                  <div className="w-5 h-5 flex items-center justify-center">{link.icon}</div>
                  {link.badge && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center bg-red-500 text-white">
                      {link.badge}
                    </Badge>
                  )}
                </NavLink>
              </Tooltip>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav className={cn('flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300/50 dark:scrollbar-thumb-gray-600/50', contentPadding, 'py-2', className)}>
      <div className="space-y-2">
        {categorizedLinks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum item encontrado</p>
            <Button size="sm" variant="outline" onClick={onClearSearch} className="mt-2">
              Limpar busca
            </Button>
          </div>
        ) : (
          categorizedLinks.map(([category, categoryLinks]) => (
            <div key={category} className="space-y-1">
              <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 py-2">
                {category}
              </h4>
              {categoryLinks.map((link, index) => {
                const active = isActive(link.route);
                const href = getHref(link.route);
                
                return (
                  <NavLink
                    key={`${category}-${index}`}
                    href={href}
                    active={active}
                    className={cn(
                      'group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative overflow-hidden',
                      'hover:bg-white/50 dark:hover:bg-gray-800/60 hover:shadow-md hover:scale-[1.02]',
                      active && [
                        'bg-gradient-to-r from-primary/10 to-secondary/5',
                        'text-primary dark:text-primary-300',
                        'shadow-lg shadow-primary/10 border border-primary/20',
                      ],
                    )}
                  >
                    <div className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                      'bg-white/50 dark:bg-gray-800/50',
                      'group-hover:bg-white dark:group-hover:bg-gray-700',
                      active && 'bg-primary/20 text-primary'
                    )}>
                      {link.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">{link.name}</span>
                        {link.badge && (
                          <Badge 
                            variant={active ? 'default' : 'secondary'} 
                            className="ml-2 text-xs"
                          >
                            {link.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        /{link.route}
                      </p>
                    </div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-r-full" />
                  </NavLink>
                );
              })}
            </div>
          ))
        )}
      </div>
    </nav>
  );
};

export default SidebarNavigation;