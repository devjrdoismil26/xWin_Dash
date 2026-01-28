import React, { useMemo } from 'react';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridSpan = GridCols;

export interface BaseComponentProps {
  className?: string;
}
export interface WithChildren {
  children?: React.ReactNode;
}

export interface GridProps extends BaseComponentProps, WithChildren {
  cols?: GridCols;
  gap?: number;
}

export interface GridItemProps extends BaseComponentProps, WithChildren {
  span?: GridSpan;
}

export const Grid: React.FC<GridProps> = ({ cols = 12, gap = 4, className = '', children, ...props }) => {
  const gridClasses = useMemo(() => {
    const safeCols = clamp(cols, 1, 12);
    const safeGap = clamp(gap, 0, 12);
    return `grid grid-cols-${safeCols} gap-${safeGap} ${className}`.trim();
  }, [cols, gap, className]);

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
};

export const GridItem: React.FC<GridItemProps> = ({ span = 1, className = '', children, ...props }) => {
  const itemClasses = useMemo(() => {
    const safeSpan = clamp(span, 1, 12);
    return `col-span-${safeSpan} ${className}`.trim();
  }, [span, className]);

  return (
    <div className={itemClasses} {...props}>
      {children}
    </div>
  );
};
