/**
 * StandardContainer - Container com espaçamento padronizado
 */
import React from 'react';
import { cn } from '@/lib/utils';

interface StandardContainerProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'tight' | 'normal' | 'loose'; }

export const StandardContainer: React.FC<StandardContainerProps> = ({ children,
  className,
  spacing = 'normal'
   }) => {
  const spacingClasses = {
    tight: 'space-y-4',
    normal: 'space-y-6',
    loose: 'space-y-8'};

  return (
        <>
      <div className={cn(spacingClasses[spacing], className)  }>
      </div>{children}
    </div>);};

export { PageContainer };
