// =========================================
// SOCIAL BUFFER LOADING SKELETON - SOCIAL BUFFER
// =========================================

import React from 'react';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { Animated } from '@/components/ui/AdvancedAnimations';

// =========================================
// INTERFACES
// =========================================

interface LoadingSkeletonProps {
  type?: 'dashboard' | 'posts' | 'schedules' | 'hashtags' | 'links' | 'media' | 'analytics' | 'engagement' | 'accounts';
  count?: number;
  className?: string;
}

interface SkeletonItemProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: boolean;
}

// =========================================
// COMPONENTES SKELETON
// =========================================

const SkeletonItem: React.FC<SkeletonItemProps> = ({ 
  className = '', 
  height = 'h-4', 
  width = 'w-full', 
  rounded = true 
}) => (
  <div 
    className={`
      bg-gray-200 animate-pulse
      ${height} ${width}
      ${rounded ? 'rounded' : ''}
      ${className}
    `}
  />
);

const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Card className={`p-6 ${className}`}>
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <SkeletonItem height="h-8" width="w-8" className="rounded-full" />
        <div className="space-y-2 flex-1">
          <SkeletonItem height="h-4" width="w-3/4" />
          <SkeletonItem height="h-3" width="w-1/2" />
        </div>
      </div>
      <SkeletonItem height="h-20" />
      <div className="flex space-x-2">
        <SkeletonItem height="h-6" width="w-16" />
        <SkeletonItem height="h-6" width="w-20" />
      </div>
    </div>
  </Card>
);

const SkeletonStatsCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <Card className={`p-6 ${className}`}>
    <div className="space-y-4">
      <SkeletonItem height="h-4" width="w-1/2" />
      <SkeletonItem height="h-8" width="w-3/4" />
      <SkeletonItem height="h-3" width="w-1/3" />
    </div>
  </Card>
);

const SkeletonTableRow: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <SkeletonItem height="h-4" width="w-full" />
      </td>
    ))}
  </tr>
);

const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({ rows = 5, columns = 4 }) => (
  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50">
        <tr>
          {Array.from({ length: columns }).map((_, index) => (
            <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <SkeletonItem height="h-4" width="w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonTableRow key={index} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

// =========================================
// SKELETONS ESPECIALIZADOS
// =========================================

const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <SkeletonItem height="h-8" width="w-48" />
        <SkeletonItem height="h-4" width="w-96" />
      </div>
      <div className="flex gap-3">
        <SkeletonItem height="h-10" width="w-32" />
        <SkeletonItem height="h-10" width="w-40" />
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Animated key={index} delay={index * 100}>
          <SkeletonStatsCard />
        </Animated>
      ))}
    </div>

    {/* Features Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="p-6">
          <SkeletonItem height="h-6" width="w-48" className="mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Animated key={index} delay={index * 100}>
                <SkeletonCard />
              </Animated>
            ))}
          </div>
        </Card>
      </div>
      <div>
        <Card className="p-6">
          <SkeletonItem height="h-6" width="w-32" className="mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Animated key={index} delay={index * 100}>
                <div className="flex items-start gap-3">
                  <SkeletonItem height="h-2" width="w-2" className="rounded-full mt-2" />
                  <div className="flex-1 space-y-2">
                    <SkeletonItem height="h-4" width="w-full" />
                    <div className="flex items-center gap-2">
                      <SkeletonItem height="h-3" width="w-16" />
                      <SkeletonItem height="h-4" width="w-12" />
                    </div>
                  </div>
                </div>
              </Animated>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </div>
);

const PostsSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <SkeletonItem height="h-8" width="w-32" />
        <SkeletonItem height="h-4" width="w-64" />
      </div>
      <SkeletonItem height="h-10" width="w-32" />
    </div>

    {/* Filters */}
    <Card className="p-4">
      <div className="flex flex-wrap gap-4">
        <SkeletonItem height="h-10" width="w-48" />
        <SkeletonItem height="h-10" width="w-32" />
        <SkeletonItem height="h-10" width="w-24" />
      </div>
    </Card>

    {/* Posts Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Animated key={index} delay={index * 100}>
          <SkeletonCard />
        </Animated>
      ))}
    </div>
  </div>
);

const SchedulesSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <SkeletonItem height="h-8" width="w-40" />
        <SkeletonItem height="h-4" width="w-72" />
      </div>
      <SkeletonItem height="h-10" width="w-36" />
    </div>

    {/* Calendar */}
    <Card className="p-6">
      <SkeletonItem height="h-6" width="w-32" className="mb-4" />
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, index) => (
          <SkeletonItem key={index} height="h-20" width="w-full" />
        ))}
      </div>
    </Card>

    {/* Schedules List */}
    <SkeletonTable rows={8} columns={5} />
  </div>
);

const HashtagsSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <SkeletonItem height="h-8" width="w-36" />
        <SkeletonItem height="h-4" width="w-80" />
      </div>
      <SkeletonItem height="h-10" width="w-28" />
    </div>

    {/* Trending Hashtags */}
    <Card className="p-6">
      <SkeletonItem height="h-6" width="w-40" className="mb-4" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 12 }).map((_, index) => (
          <SkeletonItem key={index} height="h-8" width="w-20" />
        ))}
      </div>
    </Card>

    {/* Hashtags Table */}
    <SkeletonTable rows={10} columns={6} />
  </div>
);

const LinksSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <SkeletonItem height="h-8" width="w-28" />
        <SkeletonItem height="h-4" width="w-56" />
      </div>
      <SkeletonItem height="h-10" width="w-32" />
    </div>

    {/* URL Shortener */}
    <Card className="p-6">
      <SkeletonItem height="h-6" width="w-32" className="mb-4" />
      <div className="space-y-4">
        <SkeletonItem height="h-10" width="w-full" />
        <SkeletonItem height="h-10" width="w-32" />
      </div>
    </Card>

    {/* Links Table */}
    <SkeletonTable rows={8} columns={5} />
  </div>
);

const MediaSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <SkeletonItem height="h-8" width="w-24" />
        <SkeletonItem height="h-4" width="w-48" />
      </div>
      <SkeletonItem height="h-10" width="w-36" />
    </div>

    {/* Upload Area */}
    <Card className="p-6">
      <SkeletonItem height="h-6" width="w-28" className="mb-4" />
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <SkeletonItem height="h-12" width="w-12" className="mx-auto mb-4 rounded-full" />
        <SkeletonItem height="h-4" width="w-48" className="mx-auto mb-2" />
        <SkeletonItem height="h-3" width="w-32" className="mx-auto" />
      </div>
    </Card>

    {/* Media Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <Animated key={index} delay={index * 50}>
          <SkeletonItem height="h-32" width="w-full" />
        </Animated>
      ))}
    </div>
  </div>
);

const AnalyticsSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <SkeletonItem height="h-8" width="w-40" />
        <SkeletonItem height="h-4" width="w-72" />
      </div>
      <div className="flex gap-3">
        <SkeletonItem height="h-10" width="w-32" />
        <SkeletonItem height="h-10" width="w-28" />
      </div>
    </div>

    {/* Metrics Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Animated key={index} delay={index * 100}>
          <SkeletonStatsCard />
        </Animated>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <Animated key={index} delay={index * 200}>
          <Card className="p-6">
            <SkeletonItem height="h-6" width="w-32" className="mb-4" />
            <SkeletonItem height="h-64" width="w-full" />
          </Card>
        </Animated>
      ))}
    </div>
  </div>
);

const EngagementSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <SkeletonItem height="h-8" width="w-44" />
        <SkeletonItem height="h-4" width="w-80" />
      </div>
      <SkeletonItem height="h-10" width="w-36" />
    </div>

    {/* Monitoring Status */}
    <Card className="p-6">
      <SkeletonItem height="h-6" width="w-40" className="mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonStatsCard key={index} />
        ))}
      </div>
    </Card>

    {/* Interactions */}
    <SkeletonTable rows={10} columns={6} />
  </div>
);

const AccountsSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <SkeletonItem height="h-8" width="w-32" />
        <SkeletonItem height="h-4" width="w-64" />
      </div>
      <SkeletonItem height="h-10" width="w-40" />
    </div>

    {/* Connected Accounts */}
    <Card className="p-6">
      <SkeletonItem height="h-6" width="w-36" className="mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Animated key={index} delay={index * 100}>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <SkeletonItem height="h-10" width="w-10" className="rounded-full" />
              <div className="space-y-2 flex-1">
                <SkeletonItem height="h-4" width="w-3/4" />
                <SkeletonItem height="h-3" width="w-1/2" />
              </div>
              <SkeletonItem height="h-6" width="w-16" />
            </div>
          </Animated>
        ))}
      </div>
    </Card>
  </div>
);

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

const SocialBufferLoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'dashboard', 
  count = 1,
  className = '' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'dashboard':
        return <DashboardSkeleton />;
      case 'posts':
        return <PostsSkeleton />;
      case 'schedules':
        return <SchedulesSkeleton />;
      case 'hashtags':
        return <HashtagsSkeleton />;
      case 'links':
        return <LinksSkeleton />;
      case 'media':
        return <MediaSkeleton />;
      case 'analytics':
        return <AnalyticsSkeleton />;
      case 'engagement':
        return <EngagementSkeleton />;
      case 'accounts':
        return <AccountsSkeleton />;
      default:
        return <DashboardSkeleton />;
    }
  };

  if (count > 1) {
    return (
      <div className={className}>
        {Array.from({ length: count }).map((_, index) => (
          <Animated key={index} delay={index * 100}>
            {renderSkeleton()}
          </Animated>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <Animated delay={0}>
        {renderSkeleton()}
      </Animated>
    </div>
  );
};

export default SocialBufferLoadingSkeleton;
