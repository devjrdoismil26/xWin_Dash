import React from 'react';

interface SkeletonItemProps {
  height?: string;
  width?: string;
  className?: string;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({ 
  height = 'h-4', 
  width = 'w-full', 
  className = '' 
}) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${height} ${width} ${className}`} />
);

interface SkeletonCardProps {
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => (
  <div className={`p-6 border rounded-lg bg-white dark:bg-gray-800 ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonItem height="h-8" width="w-8" className="rounded-full" />
      <div className="flex-1">
        <SkeletonItem height="h-4" width="w-3/4" className="mb-2" />
        <SkeletonItem height="h-3" width="w-1/2" />
      </div>
    </div>
    <SkeletonItem height="h-20" className="mb-4" />
    <div className="flex justify-between">
      <SkeletonItem height="h-6" width="w-16" />
      <SkeletonItem height="h-6" width="w-20" />
    </div>
  </div>
);

const SkeletonStatsCard: React.FC<SkeletonCardProps> = ({ className = '' }) => (
  <div className={`p-6 border rounded-lg bg-white dark:bg-gray-800 ${className}`}>
    <div className="text-center">
      <SkeletonItem height="h-4" width="w-1/2" className="mx-auto mb-2" />
      <SkeletonItem height="h-8" width="w-20" className="mx-auto" />
    </div>
  </div>
);

interface SocialBufferLoadingSkeletonProps {
  type?: 'posts' | 'stats' | 'grid';
  count?: number;
  className?: string;
}

const SocialBufferLoadingSkeleton: React.FC<SocialBufferLoadingSkeletonProps> = ({
  type = 'posts',
  count = 3,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'stats':
        return Array.from({ length: count }, (_, i) => (
          <SkeletonStatsCard key={i} className="mb-4" />
        ));
      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        );
      default:
        return Array.from({ length: count }, (_, i) => (
          <SkeletonCard key={i} className="mb-4" />
        ));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {renderSkeleton()}
    </div>
  );
};

export default SocialBufferLoadingSkeleton;
export { SkeletonItem, SkeletonCard, SkeletonStatsCard };
