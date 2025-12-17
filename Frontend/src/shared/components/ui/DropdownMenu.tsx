/**
 * Componente DropdownMenu - Menu Dropdown
 *
 * @description
 * Componente de menu dropdown que permite exibir um menu contextual
 * quando um trigger ? clicado. Suporta posicionamento, anima??es e
 * m?ltiplos itens de menu.
 *
 * Funcionalidades principais:
 * - Menu contextual posicionado
 * - M?ltiplos itens de menu
 * - Suporte a separadores e grupos
 * - Anima??es de entrada/sa?da
 * - Fechamento autom?tico ao clicar fora
 * - Acessibilidade (ARIA, keyboard navigation)
 * - Suporte completo a dark mode
 *
 * @module components/ui/DropdownMenu
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import DropdownMenu, { DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/shared/components/ui/DropdownMenu';
 *
 * <DropdownMenu />
 *   <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
 *   <DropdownMenuContent />
 *     <DropdownMenuItem>Item 1</DropdownMenuItem>
 *     <DropdownMenuItem>Item 2</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props do componente DropdownMenu
 *
 * @description
 * Propriedades que podem ser passadas para o componente DropdownMenu.
 *
 * @interface DropdownMenuProps
 * @property {React.ReactNode} children - Componentes filhos (Trigger e Content)
 * @property {boolean} [open] - Estado controlado de abertura (opcional)
 * @property {(open: boolean) => void} [onOpenChange] - Callback ao alterar estado (opcional)
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 */
interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange??: (e: any) => void;
  className?: string; }

/**
 * Componente DropdownMenu
 *
 * @description
 * Componente raiz que gerencia o estado de abertura/fechamento do menu.
 * Controla o posicionamento e eventos de clique fora.
 *
 * @component
 * @param {DropdownMenuProps} props - Props do componente
 * @param {React.ReactNode} props.children - Componentes filhos
 * @param {boolean} [props.open] - Estado controlado de abertura
 * @param {(open: boolean) => void} [props.onOpenChange] - Callback ao alterar estado
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de dropdown menu
 */
const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, open: controlledOpen, onOpenChange, className = ''    }) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);

    }
    onOpenChange?.(newOpen);};

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleOpenChange(false);

      } ;

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);

  }, [open]);

  return (
        <>
      <div ref={containerRef} className={cn('relative inline-block', className)  }>
      </div>{React.Children.map(children, (child: unknown) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            open,
            onOpenChange: handleOpenChange,
          });

        }
        return child;
      })}
    </div>);};

/**
 * Props do componente DropdownMenuTrigger
 *
 * @interface DropdownMenuTriggerProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement />
 * @property {React.ReactNode} children - Conte?do do trigger
 */
interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange??: (e: any) => void;
}

/**
 * Componente DropdownMenuTrigger
 *
 * @description
 * Componente que serve como trigger para abrir o menu dropdown.
 *
 * @component
 */
export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, open, onOpenChange, ...props    }) => {
  return (
            <button
      type="button"
      onClick={ () => onOpenChange?.(!open) }
      aria-expanded={ open }
      aria-haspopup="true"
      { ...props }>
      {children}
    </button>);};

/**
 * Props do componente DropdownMenuContent
 *
 * @interface DropdownMenuContentProps
 * @extends React.HTMLAttributes<HTMLDivElement />
 * @property {React.ReactNode} children - Itens do menu
 */
interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  open?: boolean;
}

/**
 * Componente DropdownMenuContent
 *
 * @description
 * Container que exibe o conte?do do menu quando aberto.
 *
 * @component
 */
export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children, open, className = '', ...props    }) => {
  if (!open) return null;

  return (
        <>
      <div
      className={cn(
        'absolute z-50 mt-2 min-w-[8rem] rounded-md border bg-white dark:bg-gray-800 shadow-lg p-1',
        'animate-in fade-in-0 zoom-in-95',
        className
      )} role="menu"
      { ...props }>
      </div>{children}
    </div>);};

/**
 * Props do componente DropdownMenuItem
 *
 * @interface DropdownMenuItemProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement />
 */
interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * Componente DropdownMenuItem
 *
 * @description
 * Item individual do menu dropdown.
 *
 * @component
 */
export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, className = '', ...props    }) => {
  return (
            <button
      type="button"
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'transition-colors focus:bg-gray-100 dark:focus:bg-gray-700',
        'hover:bg-gray-100 dark:hover:bg-gray-700',
        className
      )} role="menuitem"
      { ...props } />
      {children}
    </button>);};

export default DropdownMenu;
