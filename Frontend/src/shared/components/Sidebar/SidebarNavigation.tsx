/**
 * Componente SidebarNavigation - Navegação da Sidebar
 *
 * @description
 * Lista de navegação com links categorizados e suporte a badges.
 *
 * @module shared/components/Sidebar/SidebarNavigation
 * @since 1.0.0
 */

import React from 'react';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import NavLink from '@/shared/components/ui/NavLink';
import Badge from '@/shared/components/ui/Badge';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface LinkItem {
  name: string;
  route: string;
  category?: string;
  icon?: React.ReactNode;
  badge?: string; }

interface SidebarNavigationProps {
  isCollapsed: boolean;
  url: string;
  filteredLinks: LinkItem[];
  categorizedLinks: [string, LinkItem[]][];
  contentPadding: string;
  onClearSearch??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ isCollapsed,
  url,
  filteredLinks,
  categorizedLinks,
  contentPadding,
  onClearSearch,
   }) => {
  const isActive = (route: string): boolean => {
    return url.includes(route.split('.')[0]);};

  if (isCollapsed) { return (
        <>
      <div className={cn('flex flex-col gap-1 overflow-y-auto', contentPadding, 'py-3')  }>
      </div>{filteredLinks.slice(0, 10).map((link: unknown) => (
          <NavLink
            key={ link.route }
            href={`/${link.route.replace(/\./g, '/')}`}
            className={cn(
              'flex items-center justify-center p-2 rounded-lg transition-colors',
              isActive(link.route)
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
            )} onClick={ () => onClearSearch()  }>
            {link.icon}
          </NavLink>
        ))}
      </div>);

  }

  return (
        <>
      <div className={cn('overflow-y-auto flex-1', contentPadding, 'py-3')  }>
      </div>{categorizedLinks.length > 0 ? (
        categorizedLinks.map(([category, links]) => (
          <div key={category} className="mb-4">
           
        </div><h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2" />
              {category}
            </h3>
            <div className="{links.map((link: unknown) => (">$2</div>
                <NavLink
                  key={ link.route }
                  href={`/${link.route.replace(/\./g, '/')}`}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm',
                    isActive(link.route)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                  )} onClick={ () => onClearSearch()  }>
                  {link.icon && <span className="flex-shrink-0">{link.icon}</span>}
                  <span className="flex-1 truncate">{link.name}</span>
                  {link.badge && (
                    <Badge variant="secondary" className="text-xs" />
                      {link.badge}
                    </Badge>
                  )}
                </NavLink>
              ))}
            </div>
        ))
      ) : (
        <div className="Nenhum resultado encontrado">$2</div>
    </div>
  )}
    </div>);};
