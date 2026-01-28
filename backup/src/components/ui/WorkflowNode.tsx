import React from 'react';
import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';

const WorkflowNode = ({ 
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
    primary: 'border-primary-300 bg-primary-50',
    secondary: 'border-secondary-300 bg-secondary-50',
    success: 'border-green-300 bg-green-50',
    warning: 'border-yellow-300 bg-yellow-50',
    error: 'border-red-300 bg-red-50',
    purple: 'border-purple-300 bg-purple-50',
    blue: 'border-blue-300 bg-blue-50',
    indigo: 'border-indigo-300 bg-indigo-50',
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
  };

  return (
    <div
      className={cn(
        'workflow-node',
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
        className="workflow-node-handle target"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="workflow-node-handle source"
      />

      {/* Header */}
      <div className="workflow-node-header">
        {Icon && (
          <div className={cn('workflow-node-icon', iconColorClasses[color])}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div className="workflow-node-title">
          {data?.label || data?.title || 'Node'}
        </div>
      </div>

      {/* Content */}
      <div className="workflow-node-content">
        {children || (
          <>
            {data?.description && (
              <p className="text-xs text-gray-600 mb-2">
                {data.description}
              </p>
            )}
            {data?.type && (
              <p className="text-xs text-gray-500">
                <strong>Tipo:</strong> {data.type}
              </p>
            )}
            {data?.status && (
              <div className="mt-2">
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
          </>
        )}
      </div>
    </div>
  );
};

// Componentes específicos para diferentes tipos de nós
export const MessageNode = (props) => (
  <WorkflowNode
    {...props}
    type="message"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
      </svg>
    )}
    color="blue"
  />
);

export const QuestionNode = (props) => (
  <WorkflowNode
    {...props}
    type="question"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    )}
    color="purple"
  />
);

export const ConditionNode = (props) => (
  <WorkflowNode
    {...props}
    type="condition"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )}
    color="warning"
  />
);

export const ActionNode = (props) => (
  <WorkflowNode
    {...props}
    type="action"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )}
    color="success"
  />
);

export const AiNode = (props) => (
  <WorkflowNode
    {...props}
    type="ai"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )}
    color="purple"
  />
);

export const WebhookNode = (props) => (
  <WorkflowNode
    {...props}
    type="webhook"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    )}
    color="error"
  />
);

export const DelayNode = (props) => (
  <WorkflowNode
    {...props}
    type="delay"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    )}
    color="indigo"
  />
);

export const HumanHandoffNode = (props) => (
  <WorkflowNode
    {...props}
    type="human-handoff"
    icon={({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
      </svg>
    )}
    color="error"
  />
);

export default WorkflowNode;
