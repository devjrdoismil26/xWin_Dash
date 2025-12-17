/**
 * StandardGrid - Grid com configurações padronizadas
 */
import React from 'react';
import { cn } from '@/lib/utils';

interface StandardGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 2 | 3 | 4 | 6;
  gap?: 'tight' | 'normal' | 'loose'; }

export const StandardGrid: React.FC<StandardGridProps> = ({ children,
  className,
  cols = 3,
  gap = 'normal'
   }) => {
  const colsClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'};

  const gapClasses = {
    tight: 'gap-2',
    normal: 'gap-4',
    loose: 'gap-6'};

  return (
        <>
      <div className={cn('grid', colsClasses[cols], gapClasses[gap], className)  }>
      </div>{children}
    </div>);};

export { ResponsiveGrid };
