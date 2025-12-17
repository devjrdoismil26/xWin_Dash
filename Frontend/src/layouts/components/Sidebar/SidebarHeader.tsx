/**
 * Cabeçalho da sidebar com controles e informações
 *
 * @description
 * Cabeçalho da sidebar que exibe informações de navegação e controles para
 * colapsar, fixar e minimizar a sidebar. Adapta-se ao estado colapsado.
 *
 * @module layouts/components/Sidebar/SidebarHeader
 * @since 1.0.0
 */

import React from "react";
import { ChevronLeft, ChevronRight, Pin, PinOff, Minimize2, Maximize2, Sparkles,  } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from "@/shared/components/ui/Button";
import Tooltip from "@/shared/components/ui/Tooltip";

/**
 * Props do componente SidebarHeader
 *
 * @interface SidebarHeaderProps
 * @property {boolean} isCollapsed - Se a sidebar está colapsada
 * @property {boolean} isPinned - Se a sidebar está fixada
 * @property {boolean} isMinimized - Se a sidebar está minimizada
 * @property {number} filteredLinksCount - Quantidade de links filtrados
 * @property {string} contentPadding - Classes de padding para conteúdo
 * @property {() => void} onToggleCollapse - Callback para alternar colapso
 * @property {() => void} onTogglePin - Callback para alternar fixação
 * @property {() => void} onToggleMinimize - Callback para alternar minimização
 * @property {string} [className] - Classes CSS adicionais
 */
interface SidebarHeaderProps {
  isCollapsed: boolean;
  isPinned: boolean;
  isMinimized: boolean;
  filteredLinksCount: number;
  contentPadding: string;
  onToggleCollapse??: (e: any) => void;
  onTogglePin??: (e: any) => void;
  onToggleMinimize??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente SidebarHeader
 *
 * @description
 * Renderiza o cabeçalho da sidebar com título, contagem de itens e controles
 * para gerenciar o estado da sidebar (colapsar, fixar, minimizar).
 *
 * @param {SidebarHeaderProps} props - Props do componente
 * @returns {JSX.Element} Cabeçalho da sidebar
 *
 * @example
 * ```tsx
 * <SidebarHeader
 *   isCollapsed={ false }
 *   isPinned={ true }
 *   isMinimized={ false }
 *   filteredLinksCount={ 10 }
 *   contentPadding="px-4"
 *   onToggleCollapse={ () => setIsCollapsed(!isCollapsed) }
 *   onTogglePin={ () => setIsPinned(!isPinned) }
 *   onToggleMinimize={ () => setIsMinimized(!isMinimized) }
 * />
 * ```
 */
const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed,
  isPinned,
  isMinimized,
  filteredLinksCount,
  contentPadding,
  onToggleCollapse,
  onTogglePin,
  onToggleMinimize,
  className = "",
   }) => { return (
        <>
      <div
      className={cn(
        "flex items-center justify-between border-b border-white/10 dark:border-gray-700/30",
        contentPadding,
        "py-4",
        className,
      )  }>
      </div>{!isCollapsed && (
        <div className=" ">$2</div><div className=" ">$2</div><Sparkles className="w-4 h-4 text-primary" /></div><div className=" ">$2</div><h3 className="font-bold text-gray-900 dark:text-white text-sm truncate" />
              Navegação
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate" />
              {filteredLinksCount} {filteredLinksCount === 1 ? "item" : "itens"}
            </p>
      </div>
    </>
  )}
      <div className=" ">$2</div><Tooltip content={ isPinned ? "Soltar" : "Fixar" } />
          <Button
            size="sm"
            variant="ghost"
            onClick={ onTogglePin }
            className="w-8 h-8 p-0 hover:bg-white/30 dark:hover:bg-gray-800/50" />
            {isPinned ? (
              <PinOff className="w-3 h-3" />
            ) : (
              <Pin className="w-3 h-3" />
            )}
          </Button></Tooltip><Tooltip content={ isCollapsed ? "Expandir" : "Recolher" } />
          <Button
            size="sm"
            variant="ghost"
            onClick={ onToggleCollapse }
            className="w-8 h-8 p-0 hover:bg-white/30 dark:hover:bg-gray-800/50" />
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </Button></Tooltip><Tooltip content={ isMinimized ? "Expandir" : "Minimizar" } />
          <Button
            size="sm"
            variant="ghost"
            onClick={ onToggleMinimize }
            className="w-8 h-8 p-0 hover:bg-white/30 dark:hover:bg-gray-800/50" />
            {isMinimized ? (
              <Maximize2 className="w-3 h-3" />
            ) : (
              <Minimize2 className="w-3 h-3" />
            )}
          </Button></Tooltip></div>);};

export default SidebarHeader;
