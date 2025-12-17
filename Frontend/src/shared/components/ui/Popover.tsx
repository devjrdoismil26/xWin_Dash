/**
 * Componente Popover - Popover Flutuante
 *
 * @description
 * Componente de popover que exibe conte?do flutuante posicionado em rela??o
 * a um elemento trigger. Suporta posicionamento inteligente, anima??es e
 * fechamento autom?tico.
 *
 * Funcionalidades principais:
 * - Posicionamento inteligente (top, bottom, left, right)
 * - Anima??es de entrada/sa?da
 * - Fechamento autom?tico ao clicar fora
 * - Suporte a trigger customizado
 * - Acessibilidade (ARIA, focus management)
 * - Suporte completo a dark mode
 *
 * @module components/ui/Popover
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import Popover, { PopoverTrigger, PopoverContent } from '@/shared/components/ui/popover';
 *
 * <Popover />
 *   <PopoverTrigger>Clique aqui</PopoverTrigger>
 *   <PopoverContent />
 *     Conte?do do popover
 *   </PopoverContent>
 * </Popover>
 * ```
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Posicionamentos dispon?veis para o popover
 *
 * @typedef {'top' | 'bottom' | 'left' | 'right'} PopoverPosition
 */
type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props do componente Popover
 *
 * @description
 * Propriedades que podem ser passadas para o componente Popover.
 *
 * @interface PopoverProps
 * @property {React.ReactNode} children - Componentes filhos (Trigger e Content)
 * @property {boolean} [open] - Estado controlado de abertura (opcional)
 * @property {(open: boolean) => void} [onOpenChange] - Callback ao alterar estado (opcional)
 * @property {PopoverPosition} [position='bottom'] - Posicionamento do popover (opcional, padr?o: 'bottom')
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 */
interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange??: (e: any) => void;
  position?: PopoverPosition;
  className?: string; }

/**
 * Componente Popover
 *
 * @description
 * Componente raiz que gerencia o estado de abertura/fechamento e posicionamento
 * do popover. Controla eventos de clique fora e posicionamento.
 *
 * @component
 * @param {PopoverProps} props - Props do componente
 * @param {React.ReactNode} props.children - Componentes filhos
 * @param {boolean} [props.open] - Estado controlado de abertura
 * @param {(open: boolean) => void} [props.onOpenChange] - Callback ao alterar estado
 * @param {PopoverPosition} [props.position='bottom'] - Posicionamento do popover
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @returns {JSX.Element} Componente de popover
 */
const Popover: React.FC<PopoverProps> = ({ children,
  open: controlledOpen,
  onOpenChange,
  position = 'bottom',
  className = '',
   }) => {
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
            position,
          });

        }
        return child;
      })}
    </div>);};

/**
 * Props do componente PopoverTrigger
 *
 * @interface PopoverTriggerProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement />
 */
interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange??: (e: any) => void;
}

/**
 * Componente PopoverTrigger
 *
 * @description
 * Componente que serve como trigger para abrir o popover.
 *
 * @component
 */
export const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ children, open, onOpenChange, ...props    }) => {
  return (
            <button
      type="button"
      onClick={ () => onOpenChange?.(!open) }
      aria-expanded={ open }
      aria-haspopup="dialog"
      { ...props }>
      {children}
    </button>);};

/**
 * Props do componente PopoverContent
 *
 * @interface PopoverContentProps
 * @extends React.HTMLAttributes<HTMLDivElement />
 */
interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  open?: boolean;
  position?: PopoverPosition;
}

/**
 * Componente PopoverContent
 *
 * @description
 * Container que exibe o conte?do do popover quando aberto.
 *
 * @component
 */
export const PopoverContent: React.FC<PopoverContentProps> = ({ children,
  open,
  position = 'bottom',
  className = '',
  ...props
   }) => {
  if (!open) return null;

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',};

  return (
        <>
      <div
      className={cn(
        'absolute z-50 min-w-[12rem] rounded-md border bg-white dark:bg-gray-800 shadow-lg p-4',
        'animate-in fade-in-0 zoom-in-95',
        positionClasses[position],
        className
      )} role="dialog"
      { ...props }>
      </div>{children}
    </div>);};

export default Popover;
