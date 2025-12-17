/**
 * Componente SidebarSearch - Busca da Sidebar
 *
 * @description
 * Campo de busca para filtrar links da sidebar.
 *
 * @module shared/components/Sidebar/SidebarSearch
 * @since 1.0.0
 */

import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';

interface SidebarSearchProps {
  isCollapsed: boolean;
  searchQuery: string;
  contentPadding: string;
  onSearchChange?: (e: any) => void;
  onClearSearch??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const SidebarSearch: React.FC<SidebarSearchProps> = ({ isCollapsed,
  searchQuery,
  contentPadding,
  onSearchChange,
  onClearSearch,
   }) => { if (isCollapsed) return null;

  return (
        <>
      <div className={cn('border-b border-gray-200/50 dark:border-gray-700/50', contentPadding, 'py-3')  }>
      </div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar..."
          value={ searchQuery }
          onChange={ (e: unknown) => onSearchChange(e.target.value) }
          className="pl-9 pr-9" />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={ onClearSearch }
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0" />
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>);};
