/**
 * Skeleton Loaders Específicos por Módulo - xWin Dash
 * Loading states elegantes e contextuais
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { ENHANCED_TRANSITIONS } from './design-tokens';

// ===== BASE SKELETON COMPONENT =====
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animation?: 'pulse' | 'wave' | 'shimmer';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = 'md',
  animation = 'pulse'
}) => {
  const getRoundedClasses = () => {
    switch (rounded) {
      case 'none': return '';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-lg';
      case 'full': return 'rounded-full';
      default: return 'rounded-md';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse': return 'animate-pulse bg-gray-200 dark:bg-gray-700';
      case 'wave': return 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-[wave_1.5s_ease-in-out_infinite]';
      case 'shimmer': return 'relative overflow-hidden bg-gray-200 dark:bg-gray-700 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-[shimmer_2s_infinite]';
      default: return 'animate-pulse bg-gray-200 dark:bg-gray-700';
    }
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={cn(
        getRoundedClasses(),
        getAnimationClasses(),
        className
      )}
      style={style}
    />
  );
};

// ===== SKELETON COMPONENTS POR MÓDULO =====

// Dashboard Skeleton
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <Skeleton width={200} height={32} />
      <Skeleton width={120} height={40} rounded="lg" />
    </div>
    
    {/* Metrics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-6 border rounded-lg space-y-3">
          <Skeleton width={100} height={20} />
          <Skeleton width={80} height={32} />
          <Skeleton width={120} height={16} />
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 border rounded-lg">
        <Skeleton width={150} height={24} className="mb-4" />
        <Skeleton width="100%" height={300} />
      </div>
      <div className="p-6 border rounded-lg">
        <Skeleton width={150} height={24} className="mb-4" />
        <Skeleton width="100%" height={300} />
      </div>
    </div>
  </div>
);

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="space-y-4">
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {[...Array(columns)].map((_, i) => (
        <Skeleton key={i} width="80%" height={20} />
      ))}
    </div>
    
    {/* Rows */}
    {[...Array(rows)].map((_, rowIndex) => (
      <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {[...Array(columns)].map((_, colIndex) => (
          <Skeleton key={colIndex} width="90%" height={16} />
        ))}
      </div>
    ))}
  </div>
);

// Chat Skeleton
export const ChatSkeleton: React.FC = () => (
  <div className="space-y-4">
    {/* Messages */}
    {[...Array(5)].map((_, i) => (
      <div key={i} className={cn("flex", i % 2 === 0 ? "justify-end" : "justify-start")}>
        <div className={cn("max-w-[70%] space-y-2", i % 2 === 0 ? "items-end" : "items-start")}>
          <div className={cn("flex items-center space-x-2", i % 2 === 0 && "flex-row-reverse space-x-reverse")}>
            <Skeleton width={32} height={32} rounded="full" />
            <Skeleton width={60} height={16} />
          </div>
          <div className={cn("p-3 rounded-lg", i % 2 === 0 ? "bg-blue-100" : "bg-gray-100")}>
            <Skeleton width="100%" height={16} className="mb-2" />
            <Skeleton width="80%" height={16} />
          </div>
        </div>
      </div>
    ))}
    
    {/* Input */}
    <div className="flex items-center space-x-2 p-4 border-t">
      <Skeleton width="100%" height={40} rounded="lg" />
      <Skeleton width={40} height={40} rounded="lg" />
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => (
  <div className="space-y-6">
    <Skeleton width={200} height={32} className="mb-6" />
    
    {[...Array(fields)].map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton width={120} height={20} />
        <Skeleton width="100%" height={40} rounded="lg" />
        <Skeleton width={180} height={16} />
      </div>
    ))}
    
    <div className="flex space-x-3 pt-4">
      <Skeleton width={120} height={40} rounded="lg" />
      <Skeleton width={80} height={40} rounded="lg" />
    </div>
  </div>
);

// Card Grid Skeleton
export const CardGridSkeleton: React.FC<{ cards?: number; columns?: number }> = ({ 
  cards = 6, 
  columns = 3 
}) => (
  <div className={cn("grid gap-6", {
    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': columns === 3,
    'grid-cols-1 md:grid-cols-2': columns === 2,
    'grid-cols-1 md:grid-cols-2 lg:grid-cols-4': columns === 4,
  })}>
    {[...Array(cards)].map((_, i) => (
      <div key={i} className="p-6 border rounded-lg space-y-4">
        <Skeleton width="100%" height={120} />
        <Skeleton width="80%" height={24} />
        <Skeleton width="100%" height={16} className="mb-2" />
        <Skeleton width="60%" height={16} />
        <div className="flex items-center justify-between pt-4">
          <Skeleton width={80} height={32} rounded="lg" />
          <Skeleton width={24} height={24} rounded="full" />
        </div>
      </div>
    ))}
  </div>
);

// Profile Skeleton
export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center space-x-4">
      <Skeleton width={80} height={80} rounded="full" />
      <div className="space-y-2">
        <Skeleton width={200} height={24} />
        <Skeleton width={150} height={16} />
        <Skeleton width={120} height={16} />
      </div>
    </div>
    
    {/* Stats */}
    <div className="grid grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="text-center space-y-2">
          <Skeleton width={60} height={32} className="mx-auto" />
          <Skeleton width={80} height={16} className="mx-auto" />
        </div>
      ))}
    </div>
    
    {/* Content */}
    <div className="space-y-4">
      <Skeleton width={150} height={20} />
      <Skeleton width="100%" height={120} />
    </div>
  </div>
);

// Calendar Skeleton
export const CalendarSkeleton: React.FC = () => (
  <div className="space-y-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Skeleton width={40} height={40} rounded="lg" />
        <Skeleton width={150} height={24} />
        <Skeleton width={40} height={40} rounded="lg" />
      </div>
      <Skeleton width={100} height={32} rounded="lg" />
    </div>
    
    {/* Calendar Grid */}
    <div className="border rounded-lg p-4">
      {/* Days header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} width={40} height={20} className="mx-auto" />
        ))}
      </div>
      
      {/* Calendar cells */}
      {[...Array(5)].map((_, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 gap-2 mb-2">
          {[...Array(7)].map((_, dayIndex) => (
            <div key={dayIndex} className="h-24 border rounded p-2 space-y-1">
              <Skeleton width={20} height={16} />
              <Skeleton width="80%" height={12} />
              <Skeleton width="60%" height={12} />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Export main Skeleton component and all module-specific skeletons
// Components are already exported individually above

// ===== CSS ANIMATIONS (to be added to globals.css) =====
/*
@keyframes wave {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
*/

// Export the base Skeleton component
export { Skeleton };
export default Skeleton;
