/**
 * Componente SidebarHeader - Cabeçalho da Sidebar
 *
 * @description
 * Cabeçalho da sidebar com controles de colapso, fixação e minimização.
 *
 * @module shared/components/Sidebar/SidebarHeader
 * @since 1.0.0
 */

import React from 'react';
import { ChevronLeft, ChevronRight, Pin, PinOff, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/shared/components/ui/Button';
import Tooltip from '@/shared/components/ui/Tooltip';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  isPinned: boolean;
  isMinimized: boolean;
  filteredLinksCount: number;
  contentPadding: string;
  onToggleCollapse??: (e: any) => void;
  onTogglePin??: (e: any) => void;
  onToggleMinimize??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed,
  isPinned,
  isMinimized,
  filteredLinksCount,
  contentPadding,
  onToggleCollapse,
  onTogglePin,
  onToggleMinimize,
   }) => { return (
        <>
      <div className={cn('flex items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50', contentPadding, 'py-3')  }>
      </div>{!isCollapsed && (
        <div className=" ">$2</div><h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100" />
            Navegação
          </h2>
          {filteredLinksCount > 0 && (
            <span className="({filteredLinksCount})">$2</span>
      </span>
    </>
  )}
        </div>
      )}
      <div className=" ">$2</div><Tooltip content={ isPinned ? 'Desafixar' : 'Fixar' } />
          <Button
            variant="ghost"
            size="sm"
            onClick={ onTogglePin }
            className="h-7 w-7 p-0" />
            {isPinned ? (
              <Pin className="h-4 w-4" />
            ) : (
              <PinOff className="h-4 w-4" />
            )}
          </Button></Tooltip><Tooltip content={ isMinimized ? 'Maximizar' : 'Minimizar' } />
          <Button
            variant="ghost"
            size="sm"
            onClick={ onToggleMinimize }
            className="h-7 w-7 p-0" />
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button></Tooltip><Tooltip content={ isCollapsed ? 'Expandir' : 'Colapsar' } />
          <Button
            variant="ghost"
            size="sm"
            onClick={ onToggleCollapse }
            className="h-7 w-7 p-0" />
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button></Tooltip></div>);};
