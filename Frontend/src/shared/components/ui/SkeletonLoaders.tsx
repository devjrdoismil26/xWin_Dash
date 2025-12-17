import React from 'react';

interface SkeletonProps {
  height?: string;
  width?: string;
  className?: string;
  animation?: 'pulse' | 'wave' | 'shimmer';
  rounded?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  height = 'h-4',
  width = 'w-full',
  className = '',
  animation = 'pulse',
  rounded = false
}) => {
  const animationClass = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    shimmer: 'animate-pulse'
  }[animation];

  return (
    <div
      className={`
        ${animationClass}
        bg-gray-200 dark:bg-gray-700
        ${height} ${width}
        ${rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
    />
  );
};

const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <Skeleton height="h-6" width="w-3/4" className="mb-2" />
          <Skeleton height="h-8" width="w-1/2" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 border rounded-lg">
        <Skeleton height="h-6" width="w-1/3" className="mb-4" />
        <Skeleton height="h-64" />
      </div>
      <div className="p-6 border rounded-lg">
        <Skeleton height="h-6" width="w-1/3" className="mb-4" />
        <Skeleton height="h-64" />
      </div>
    </div>
  </div>
);

const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton height="h-6" width="w-1/4" />
      <Skeleton height="h-10" width="w-32" />
    </div>
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} height="h-4" width="w-3/4" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="p-4 border-b last:border-b-0">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, j) => (
              <Skeleton key={j} height="h-4" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonCard: React.FC = () => (
  <div className="p-6 border rounded-lg space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton height="h-12" width="w-12" rounded />
      <div className="flex-1">
        <Skeleton height="h-4" width="w-3/4" className="mb-2" />
        <Skeleton height="h-3" width="w-1/2" />
      </div>
    </div>
    <Skeleton height="h-20" />
    <div className="flex justify-between">
      <Skeleton height="h-6" width="w-16" />
      <Skeleton height="h-6" width="w-20" />
    </div>
  </div>
);

const SkeletonForm: React.FC = () => (
  <div className="space-y-6">
    <Skeleton height="h-8" width="w-1/3" />
    <div className="space-y-4">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton height="h-4" width="w-1/4" />
          <Skeleton height="h-10" />
        </div>
      ))}
    </div>
    <div className="flex justify-end space-x-4">
      <Skeleton height="h-10" width="w-20" />
      <Skeleton height="h-10" width="w-24" />
    </div>
  </div>
);

export {
  Skeleton,
  SkeletonDashboard,
  SkeletonTable,
  SkeletonCard,
  SkeletonForm
};

export default Skeleton;
