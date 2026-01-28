import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ComponentSize } from '@/components/ui/design-tokens';

export interface PageLayoutProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  showHeader?: boolean;
  padded?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  centered?: boolean;
  size?: ComponentSize;
  variant?: 'default' | 'contained' | 'fluid';
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}

const maxWidthClassesMap: Record<NonNullable<PageLayoutProps['maxWidth']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

const paddingBySize: Record<ComponentSize, string> = {
  sm: 'p-3 md:p-4',
  md: 'p-4 md:p-6 lg:p-8',
  lg: 'p-6 md:p-8 lg:p-12',
  xl: 'p-8 md:p-12 lg:p-16',
};

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  showHeader = true,
  padded = true,
  maxWidth = '7xl',
  centered = true,
  size = 'md',
  variant = 'default',
  className = '',
  headerClassName = '',
  contentClassName = '',
  children,
}) => {
  const containerClasses = useMemo(() => {
    const baseClasses = 'min-h-screen';
    
    switch (variant) {
      case 'contained':
        return cn(baseClasses, 'bg-gray-50 dark:bg-gray-900', className);
      case 'fluid':
        return cn(baseClasses, 'bg-white dark:bg-gray-800', className);
      default:
        return cn(baseClasses, 'bg-gray-50 dark:bg-gray-900', className);
    }
  }, [variant, className]);

  const contentClasses = useMemo(() => {
    const baseClasses = [
      'w-full',
      centered && 'mx-auto',
      padded && paddingBySize[size],
      maxWidthClassesMap[maxWidth],
    ].filter(Boolean);

    return cn(...baseClasses, contentClassName);
  }, [maxWidth, centered, padded, size, contentClassName]);

  const headerClasses = useMemo(() => {
    const baseClasses = [
      'mb-6 pb-4',
      (title || subtitle || actions) && 'border-b border-gray-200 dark:border-gray-700',
    ].filter(Boolean);

    return cn(...baseClasses, headerClassName);
  }, [title, subtitle, actions, headerClassName]);

  return (
    <div className={containerClasses}>
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className={cn('mx-auto', maxWidthClassesMap[maxWidth])}>
            {breadcrumbs}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={contentClasses}>
        {/* Page Header */}
        {showHeader && (title || subtitle || actions) && (
          <header className={cn(headerClasses, "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6")}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1">
          {variant === 'contained' ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {children}
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
