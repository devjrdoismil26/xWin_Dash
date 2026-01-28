import React, { useCallback } from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHomeIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  className?: string;
}

const textSizeBySize = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
} as const;

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = <ChevronRight className="w-4 h-4" />,
  showHomeIcon = true,
  size = 'md',
  onItemClick,
  className = '',
}) => {
  const handleItemClick = useCallback(
    (event: React.MouseEvent, item: BreadcrumbItem, index: number) => {
      if (onItemClick) {
        event.preventDefault();
        onItemClick(item, index);
      }
    },
    [onItemClick],
  );

  return (
    <nav className={`flex items-center space-x-1 ${textSizeBySize[size]} ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isActive = item.active || isLast;
          const content = (
            <>
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {index === 0 && showHomeIcon && !item.icon && <Home className="w-4 h-4 mr-1" />}
              <span className={isActive ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}>{item.label}</span>
            </>
          );

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center">
              {item.href && !isActive ? (
                <a href={item.href} onClick={(e) => handleItemClick(e, item, index)} className="inline-flex items-center">
                  {content}
                </a>
              ) : (
                <span className="inline-flex items-center">{content}</span>
              )}
              {!isLast && <span className="mx-1 text-gray-400">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export { Breadcrumbs };
export default Breadcrumbs;
