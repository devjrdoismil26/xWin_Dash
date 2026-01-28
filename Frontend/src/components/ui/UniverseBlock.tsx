import React from 'react';
import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';

const UniverseBlock = ({ 
  data, 
  isConnectable = true, 
  selected = false,
  type = 'default',
  icon: Icon,
  color = 'primary',
  children,
  className = '',
  ...props 
}) => {
  const colorClasses = {
    primary: 'border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100',
    secondary: 'border-secondary-200 bg-gradient-to-br from-secondary-50 to-secondary-100',
    success: 'border-green-200 bg-gradient-to-br from-green-50 to-green-100',
    warning: 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100',
    error: 'border-red-200 bg-gradient-to-br from-red-50 to-red-100',
    purple: 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100',
    blue: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100',
    indigo: 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100',
    cyan: 'border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100',
    pink: 'border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100',
  };

  const iconColorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    cyan: 'bg-cyan-500',
    pink: 'bg-pink-500',
  };

  return (
    <div
      className={cn(
        'universe-block',
        colorClasses[color],
        selected && 'selected',
        className
      )}
      {...props}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-purple-500"
      />

      {/* Header */}
      <div className="universe-block-header">
        {Icon && (
          <div className={cn('universe-block-icon', iconColorClasses[color])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="universe-block-title">
          {data?.label || data?.title || 'Block'}
        </div>
      </div>

      {/* Content */}
      <div className="universe-block-content">
        {children || (
          <>
            {data?.description && (
              <p className="text-sm text-gray-600 mb-3">
                {data.description}
              </p>
            )}
            {data?.status && (
              <div className="mb-3">
                <span className={cn(
                  'badge',
                  data.status === 'active' && 'badge-success',
                  data.status === 'inactive' && 'badge-secondary',
                  data.status === 'error' && 'badge-error'
                )}>
                  {data.status}
                </span>
              </div>
            )}
            {data?.metrics && (
              <div className="space-y-2">
                {Object.entries(data.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Componentes específicos para diferentes tipos de blocos
export const DashboardBlock = (props) => (
  <UniverseBlock
    {...props}
    type="dashboard"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
      </svg>
    )}
    color="blue"
  />
);

export const CRMBlock = (props) => (
  <UniverseBlock
    {...props}
    type="crm"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
      </svg>
    )}
    color="success"
  />
);

export const AnalyticsBlock = (props) => (
  <UniverseBlock
    {...props}
    type="analytics"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    )}
    color="purple"
  />
);

export const AIBlock = (props) => (
  <UniverseBlock
    {...props}
    type="ai"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )}
    color="cyan"
  />
);

export const EmailMarketingBlock = (props) => (
  <UniverseBlock
    {...props}
    type="email-marketing"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    )}
    color="indigo"
  />
);

export const SocialBufferBlock = (props) => (
  <UniverseBlock
    {...props}
    type="social-buffer"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    )}
    color="pink"
  />
);

export const WorkflowsBlock = (props) => (
  <UniverseBlock
    {...props}
    type="workflows"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
      </svg>
    )}
    color="warning"
  />
);

export const MediaLibraryBlock = (props) => (
  <UniverseBlock
    {...props}
    type="media-library"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    )}
    color="success"
  />
);

export const ECommerceBlock = (props) => (
  <UniverseBlock
    {...props}
    type="ecommerce"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15V9h4v6H8z" clipRule="evenodd" />
      </svg>
    )}
    color="error"
  />
);

export default UniverseBlock;
