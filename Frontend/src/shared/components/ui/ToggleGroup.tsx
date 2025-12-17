/**
 * Componente ToggleGroup - Grupo de Toggles
 *
 * @description
 * Componente de grupo de toggles que permite sele??o ?nica ou m?ltipla
 * de op??es. Suporta m?ltiplos tamanhos, variantes e estados customiz?veis.
 *
 * Funcionalidades principais:
 * - Modo ?nico (single) ou m?ltiplo (multiple)
 * - M?ltiplos tamanhos (sm, md, lg)
 * - M?ltiplas variantes (default, outline)
 * - Estados de sele??o visual
 * - Suporte a children din?micos
 * - Acessibilidade (role="group")
 * - Estados disabled
 *
 * @module components/ui/ToggleGroup
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import ToggleGroup, { ToggleGroupItem } from '@/shared/components/ui/ToggleGroup';
 *
 * // ToggleGroup ?nico
 * <ToggleGroup
 *   type="single"
 *   value={ selected }
 *   onValueChange={ setSelected }
 * />
 *   <ToggleGroupItem value="option1">Op??o 1</ToggleGroupItem>
 *   <ToggleGroupItem value="option2">Op??o 2</ToggleGroupItem>
 * </ToggleGroup>
 *
 * // ToggleGroup m?ltiplo
 * <ToggleGroup
 *   type="multiple"
 *   value={ selectedArray }
 *   onValueChange={ setSelectedArray }
 * />
 *   <ToggleGroupItem value="opt1">Opt 1</ToggleGroupItem>
 *   <ToggleGroupItem value="opt2">Opt 2</ToggleGroupItem>
 * </ToggleGroup>
 * ```
 */

import React from 'react';

/**
 * Tamanhos dispon?veis para o toggle group
 *
 * @typedef {'sm' | 'md' | 'lg'} ToggleGroupSize
 */
type ToggleGroupSize = 'sm' | 'md' | 'lg';

/**
 * Variantes dispon?veis para o toggle group
 *
 * @typedef {'default' | 'outline'} ToggleGroupVariant
 */
type ToggleGroupVariant = 'default' | 'outline';

/**
 * Props do componente ToggleGroup
 *
 * @description
 * Propriedades que podem ser passadas para o componente ToggleGroup.
 *
 * @interface ToggleGroupProps
 * @property {string | number | Array<string | number>} [value] - Valor(s) selecionado(s) (opcional)
 * @property {(value: string | number | Array<string | number>) => void} onValueChange - Fun??o chamada ao alterar o valor
 * @property {'single' | 'multiple'} [type='single'] - Tipo de sele??o (opcional, padr?o: 'single')
 * @property {ToggleGroupSize} [size='md'] - Tamanho dos itens (opcional, padr?o: 'md')
 * @property {ToggleGroupVariant} [variant='default'] - Variante visual (opcional, padr?o: 'default')
 * @property {string} [className=''] - Classes CSS adicionais (opcional, padr?o: '')
 * @property {React.ReactNode} children - Componentes ToggleGroupItem filhos
 */
interface ToggleGroupProps {
  value?: string | number | Array<string | number>;
  onValueChange?: (e: any) => void;
  type?: 'single' | 'multiple';
  size?: ToggleGroupSize;
  variant?: ToggleGroupVariant;
  className?: string;
  children: React.ReactNode; }

/**
 * Componente ToggleGroup
 *
 * @description
 * Renderiza um grupo de toggles com suporte a sele??o ?nica ou m?ltipla.
 * Injeta propriedades nos filhos (ToggleGroupItem) para controlar estados.
 *
 * @component
 * @param {ToggleGroupProps} props - Props do componente
 * @param {string | number | Array<string | number>} [props.value] - Valor(s) selecionado(s)
 * @param {(value: string | number | Array<string | number>) => void} props.onValueChange - Fun??o ao alterar
 * @param {'single' | 'multiple'} [props.type='single'] - Tipo de sele??o
 * @param {ToggleGroupSize} [props.size='md'] - Tamanho dos itens
 * @param {ToggleGroupVariant} [props.variant='default'] - Variante visual
 * @param {string} [props.className=''] - Classes CSS adicionais
 * @param {React.ReactNode} props.children - Componentes filhos
 * @returns {JSX.Element} Componente de toggle group
 */
const ToggleGroup: React.FC<ToggleGroupProps> = ({ value, onValueChange, type = 'single', size = 'md', variant = 'default', className = '', children, ...props    }) => {
  const sizeClasses = { sm: 'text-xs px-2 py-1', md: 'text-sm px-3 py-2', lg: 'text-base px-4 py-3'};

  const variantClasses = { default: 'border border-gray-300', outline: 'border-2 border-gray-300'};

  return (
        <>
      <div className={`inline-flex rounded-md shadow-sm ${className} `} role="group" { ...props }>
      </div>{React.Children.map(children, (child: unknown, index: unknown) => {
        if (!React.isValidElement(child)) return child;
        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;
        const isSelected = type === 'single' ? value === child.props.value : Array.isArray(value) && value.includes(child.props.value);

        return React.cloneElement(child, {
          size,
          variant,
          isSelected,
          isFirst,
          isLast,
          onToggle: (val: unknown) => {
            if (!onValueChange) return;
            if (type === 'single') onValueChange(val);

            else {
              const arr = Array.isArray(value) ? value.slice() : [];
              const idx = arr.indexOf(val);

              if (idx >= 0) arr.splice(idx, 1);

              else arr.push(val);

              onValueChange(arr);

            } ,
          className: `${sizeClasses[size]} ${variantClasses[variant]} ${child.props.className || ''}`,
        });

      })}
    </div>);};

/**
 * Props do componente ToggleGroupItem
 *
 * @interface ToggleGroupItemProps
 * @property {string | number} value - Valor do item
 * @property {React.ReactNode} children - Conte?do do item
 * @property {boolean} [disabled=false] - Se o item est? desabilitado
 * @property {string} [className=''] - Classes CSS adicionais
 * @property {boolean} [isSelected] - Se o item est? selecionado (injetado pelo pai)
 * @property {boolean} [isFirst] - Se ? o primeiro item (injetado pelo pai)
 * @property {boolean} [isLast] - Se ? o ?ltimo item (injetado pelo pai)
 * @property {(value: string | number) => void} [onToggle] - Fun??o ao clicar (injetado pelo pai)
 */
interface ToggleGroupItemProps {
  value: string | number;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  isSelected?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onToggle??: (e: any) => void; }

/**
 * Componente ToggleGroupItem
 *
 * @description
 * Item individual do ToggleGroup. Recebe propriedades injetadas pelo componente pai.
 *
 * @component
 * @param {ToggleGroupItemProps} props - Props do componente
 * @returns {JSX.Element} Item do toggle group
 */
const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({ value, children, disabled = false, className = '', isSelected, isFirst, isLast, onToggle, ...props    }) => {
  const baseClasses = `relative inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`;
  const positionClasses = `${isFirst ? 'rounded-l-md' : ''} ${isLast ? 'rounded-r-md' : ''} ${!isFirst ? '-ml-px' : ''}`;
  const stateClasses = isSelected ? 'bg-blue-600 text-white border-blue-600 z-10' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';

  return (
            <button type="button" onClick={() => onToggle?.(value)} disabled={disabled} className={`${baseClasses} ${positionClasses} ${stateClasses} border ${className}`} { ...props }>
      {children}
    </button>);};

export { ToggleGroupItem };

export default ToggleGroup;
