/**
 * Componente Grid - Sistema de Grid Layout
 *
 * @description
 * Sistema completo de grid layout com suporte a colunas customiz?veis (1-12),
 * gaps configur?veis e itens com span customiz?vel. Fornece componentes Grid
 * e GridItem para construir layouts responsivos baseados em grid.
 *
 * Funcionalidades principais:
 * - Grid com colunas customiz?veis (1-12)
 * - Gaps configur?veis (0-12)
 * - GridItem com span customiz?vel (1-12)
 * - Layout responsivo
 * - Suporte completo a dark mode
 * - Integra??o com Tailwind CSS grid system
 *
 * @module components/ui/Grid
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { Grid, GridItem } from '@/shared/components/ui/Grid';
 *
 * <Grid cols={12} gap={ 4 } />
 *   <GridItem span={ 8 }>Conte?do principal</GridItem>
 *   <GridItem span={ 4 }>Sidebar</GridItem>
 * </Grid>
 * ```
 */

import React, { useMemo } from "react";

/**
 * Fun??o auxiliar para limitar um valor entre min e max
 *
 * @description
 * Garante que um valor esteja dentro de um intervalo espec?fico.
 *
 * @param {number} value - Valor a ser limitado
 * @param {number} min - Valor m?nimo
 * @param {number} max - Valor m?ximo
 * @returns {number} Valor limitado entre min e max
 */
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * N?mero de colunas do grid (1-12)
 *
 * @description
 * Tipo que define o n?mero de colunas dispon?veis no grid.
 *
 * @typedef {(1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12)} GridCols
 */
export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Span do grid item (1-12)
 *
 * @description
 * Tipo que define o n?mero de colunas que um item do grid ocupa.
 *
 * @typedef {(1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12)} GridSpan
 */
export type GridSpan = GridCols;

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
export interface WithChildren {
  children?: React.ReactNode; }

/**
 * Props do componente Grid
 *
 * @description
 * Propriedades que podem ser passadas para o componente Grid.
 *
 * @interface GridProps
 * @extends BaseComponentProps
 * @extends WithChildren
 * @property {GridCols} [cols=12] - N?mero de colunas do grid (1-12)
 * @property {number} [gap=4] - Gap entre itens do grid (0-12)
 */
export interface GridProps extends BaseComponentProps, WithChildren {
  cols?: GridCols;
  gap?: number;
}

/**
 * Props do componente GridItem
 *
 * @description
 * Propriedades que podem ser passadas para o componente GridItem.
 *
 * @interface GridItemProps
 * @extends BaseComponentProps
 * @extends WithChildren
 * @property {GridSpan} [span=1] - N?mero de colunas que o item ocupa (1-12)
 */
export interface GridItemProps extends BaseComponentProps, WithChildren {
  span?: GridSpan;
}

/**
 * Componente Grid
 *
 * @description
 * Renderiza um container de grid com n?mero configur?vel de colunas e gap.
 * Usa classes do Tailwind CSS para criar o layout de grid.
 *
 * @component
 * @param {GridProps} props - Props do componente
 * @param {GridCols} [props.cols=12] - N?mero de colunas
 * @param {number} [props.gap=4] - Gap entre itens
 * @returns {JSX.Element} Container de grid estilizado
 */
export const Grid: React.FC<GridProps> = ({ cols = 12,
  gap = 4,
  className = "",
  children,
  ...props
   }) => {
  const gridClasses = useMemo(() => {
    const safeCols = clamp(cols, 1, 12);

    const safeGap = clamp(gap, 0, 12);

    return `grid grid-cols-${safeCols} gap-${safeGap} ${className}`.trim();

  }, [cols, gap, className]);

  return (
        <>
      <div className={gridClasses} { ...props }>
      </div>{children}
    </div>);};

/**
 * Componente GridItem
 *
 * @description
 * Renderiza um item do grid que ocupa um n?mero espec?fico de colunas.
 * Usa classes do Tailwind CSS para definir o span (col-span-*).
 *
 * @component
 * @param {GridItemProps} props - Props do componente
 * @param {GridSpan} [props.span=1] - N?mero de colunas que o item ocupa
 * @returns {JSX.Element} Item do grid estilizado
 */
export const GridItem: React.FC<GridItemProps> = ({ span = 1,
  className = "",
  children,
  ...props
   }) => {
  const itemClasses = useMemo(() => {
    const safeSpan = clamp(span, 1, 12);

    return `col-span-${safeSpan} ${className}`.trim();

  }, [span, className]);

  return (
        <>
      <div className={itemClasses} { ...props }>
      </div>{children}
    </div>);};
