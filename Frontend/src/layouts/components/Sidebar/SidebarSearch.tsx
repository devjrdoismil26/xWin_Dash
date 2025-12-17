/**
 * Campo de busca da sidebar
 *
 * @description
 * Campo de busca para filtrar links na sidebar. Oculto quando a sidebar está colapsada.
 * Inclui botão para limpar busca quando há texto digitado.
 *
 * @module layouts/components/Sidebar/SidebarSearch
 * @since 1.0.0
 */

import React from "react";
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";

/**
 * Props do componente SidebarSearch
 *
 * @interface SidebarSearchProps
 * @property {boolean} isCollapsed - Se a sidebar está colapsada (oculta busca se true)
 * @property {string} searchQuery - Valor atual da busca
 * @property {string} contentPadding - Classes de padding para conteúdo
 * @property {(value: string) => void} onSearchChange - Callback quando busca muda
 * @property {() => void} onClearSearch - Callback para limpar busca
 * @property {string} [className] - Classes CSS adicionais
 */
interface SidebarSearchProps {
  isCollapsed: boolean;
  searchQuery: string;
  contentPadding: string;
  onSearchChange?: (e: any) => void;
  onClearSearch??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente SidebarSearch
 *
 * @description
 * Campo de busca com ícone e botão de limpar. Renderiza null quando sidebar
 * está colapsada para economizar espaço.
 *
 * @param {SidebarSearchProps} props - Props do componente
 * @returns {JSX.Element | null} Campo de busca ou null se colapsado
 *
 * @example
 * ```tsx
 * <SidebarSearch
 *   isCollapsed={ false }
 *   searchQuery={ query }
 *   contentPadding="px-4"
 *   onSearchChange={ (value: unknown) => setQuery(value) }
 *   onClearSearch={ () => setQuery('') }
 * />
 * ```
 */
const SidebarSearch: React.FC<SidebarSearchProps> = ({ isCollapsed,
  searchQuery,
  contentPadding,
  onSearchChange,
  onClearSearch,
  className = "",
   }) => { if (isCollapsed) return null;

  return (
        <>
      <div
      className={cn(
        "border-b border-white/10 dark:border-gray-700/30",
        contentPadding,
        "py-3",
        className,
      )  }>
      </div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar..."
          value={ searchQuery }
          onChange={ (e: unknown) => onSearchChange(e.target.value) }
          className={cn(
            "pl-10 pr-4 py-2 text-sm",
            "bg-white/40 dark:bg-gray-800/40",
            "border-white/20 dark:border-gray-600/30",
            "focus:bg-white/70 dark:focus:bg-gray-800/70",
            "focus:border-primary/50 dark:focus:border-primary/50",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "transition-all duration-200",
          ) } />
        {searchQuery && (
          <Button
            size="sm"
            variant="ghost"
            onClick={ onClearSearch }
            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 hover:bg-gray-200/50" />
            ×
          </Button>
        )}
      </div>);};

export default SidebarSearch;
