import React, { useEffect, useState } from 'react';
import { Play, Pause, Square, Eye, Download, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle, Calendar, Timer, Activity, Filter, Search, MoreVertical, Trash2, Copy, ExternalLink } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Badge from '@/shared/components/ui/Badge';
import { useWorkflows } from '../hooks/useWorkflows';
import { WorkflowExecution } from '../types/workflowTypes';
interface WorkflowExecutionsProps {
  workflowId?: string | number;
  autoRefresh?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const WorkflowExecutions: React.FC<WorkflowExecutionsProps> = ({ workflowId, 
  autoRefresh = false 
   }) => {
  const {
    workflowExecutions,
    loading,
    error,
    fetchWorkflowExecutions,
    pauseExecution,
    resumeExecution,
    cancelExecution
  } = useWorkflows();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [statusFilter, setStatusFilter] = useState<string>('');

  const [sortBy, setSortBy] = useState<string>('started_at');

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [selectedExecutions, setSelectedExecutions] = useState<string[]>([]);

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchWorkflowExecutions(workflowId);

      }, 30000);

      return () => clearInterval(interval);

    } , [autoRefresh, workflowId, fetchWorkflowExecutions]);

  // Load executions
  useEffect(() => {
    if (workflowId) {
      fetchWorkflowExecutions(workflowId);

    } , [workflowId, fetchWorkflowExecutions]);

  const handlePauseExecution = async (executionId: string) => {
    await pauseExecution(executionId);

    fetchWorkflowExecutions(workflowId);};

  const handleResumeExecution = async (executionId: string) => {
    await resumeExecution(executionId);

    fetchWorkflowExecutions(workflowId);};

  const handleCancelExecution = async (executionId: string) => {
    if (confirm('Are you sure you want to cancel this execution?')) {
      await cancelExecution(executionId);

      fetchWorkflowExecutions(workflowId);

    } ;

  const handleRefresh = () => {
    fetchWorkflowExecutions(workflowId);};

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ComponentType<any> }> = {
      pending: { color: 'blue', icon: Clock },
      running: { color: 'green', icon: Activity },
      completed: { color: 'green', icon: CheckCircle },
      failed: { color: 'red', icon: XCircle },
      cancelled: { color: 'gray', icon: Square },
      paused: { color: 'yellow', icon: Pause } ;

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
        <>
      <Badge color={config.color as any} className="flex items-center gap-1" />
      <Icon size={ 12  }>
          {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>);};

  const formatDuration = (startTime?: string, endTime?: string): string => {
    if (!startTime) return 'Not started';
    if (!endTime) return 'Running...';
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime();

    const seconds = Math.floor(duration / 1000);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;};

  const formatDateTime = (dateTime?: string): string => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleString();};

  const filteredExecutions = (workflowExecutions || []).filter(execution => {
    const matchesSearch = !searchTerm || 
      execution.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      execution.workflow_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || execution.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedExecutions = [...filteredExecutions].sort((a: unknown, b: unknown) => {
    const aValue = a[sortBy as keyof WorkflowExecution];
    const bValue = b[sortBy as keyof WorkflowExecution];
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    } );

  const getExecutionActions = (execution: WorkflowExecution) => { const actions: React.ReactNode[] = [] as unknown[];
    switch (execution.status) {
      case 'running':
        actions.push(
          <Button
            key="pause"
            variant="ghost"
            size="sm"
            onClick={ () => handlePauseExecution(execution.id)  }>
            <Pause size={14} / />
          </Button>,
          <Button
            key="cancel"
            variant="ghost"
            size="sm"
            onClick={ () => handleCancelExecution(execution.id)  }>
            <Square size={14} / />
          </Button>);

        break;
      case 'paused':
        actions.push(
          <Button
            key="resume"
            variant="ghost"
            size="sm"
            onClick={ () => handleResumeExecution(execution.id)  }>
            <Play size={14} / />
          </Button>,
          <Button
            key="cancel"
            variant="ghost"
            size="sm"
            onClick={ () => handleCancelExecution(execution.id)  }>
            <Square size={14} / />
          </Button>);

        break;
      case 'completed':
      case 'failed':
        actions.push(
          <Button
            key="view"
            variant="ghost"
            size="sm"
            onClick={() => {/* View execution details */} >
            <Eye size={14} / />
          </Button>,
          <Button
            key="download"
            variant="ghost"
            size="sm"
            onClick={() => {/* Download logs */} >
            <Download size={14} / />
          </Button>);

        break;
    }
    return actions;};

  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div>
           
        </div><h2 className="text-lg font-semibold text-gray-900">Executions</h2>
          <p className="text-sm text-gray-600" />
            {workflowExecutions.length} total executions
          </p></div><div className=" ">$2</div><Button
            variant="outline"
            size="sm"
            onClick={ handleRefresh }
            disabled={ loading } />
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} / />
            Refresh
          </Button>
        </div>
      {/* Filters */}
      <Card />
        <Card.Content className="p-4" />
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} / />
                <Input
                  placeholder="Search executions..."
                  value={ searchTerm }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value) }
                  className="pl-10" /></div><div className=" ">$2</div><select
                value={ statusFilter }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setStatusFilter(e.target.value) }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="paused">Paused</option></select><select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const [field, order] = e.target.value.split('-');

                  setSortBy(field);

                  setSortOrder(order as 'asc' | 'desc');

                } className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="started_at-desc">Newest First</option>
                <option value="started_at-asc">Oldest First</option>
                <option value="status-asc">Status A-Z</option>
                <option value="status-desc">Status Z-A</option>
                <option value="duration-asc">Duration Shortest</option>
                <option value="duration-desc">Duration Longest</option></select></div>
        </Card.Content>
      </Card>
      {/* Error Display */}
      {error && (
        <Card />
          <Card.Content className="p-4" />
            <div className=" ">$2</div><AlertCircle size={16} / />
              <span>{error}</span></div></Card.Content>
      </Card>
    </>
  )}
      {/* Executions List */}
      <Card />
        <Card.Content className="p-0" />
          {sortedExecutions.length === 0 ? (
            <div className=" ">$2</div><Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No executions</h3>
              <p className="mt-1 text-sm text-gray-500" />
                {workflowId 
                  ? 'This workflow has not been executed yet.'
                  : 'No workflow executions found.'
                }
              </p>
      </div>
    </>
  ) : (
            <div className="{(sortedExecutions || []).map((execution: unknown) => (">$2</div>
                <div key={execution.id} className="p-4 hover:bg-gray-50">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><span className="{execution.id.substring(0, 8)}...">$2</span>
                        </span>
                        {getStatusBadge(execution.status)}
                        {execution.workflow_name && (
                          <span className="{execution.workflow_name}">$2</span>
      </span>
    </>
  )}
                      </div>
                      <div className=" ">$2</div><span className=" ">$2</span><Calendar size={12} / />
                          Started: {formatDateTime(execution.started_at)}
                        </span>
                        {execution.completed_at && (
                          <span className=" ">$2</span><Timer size={12} / />
                            Completed: {formatDateTime(execution.completed_at)}
                          </span>
                        )}
                        <span className=" ">$2</span><Clock size={12} / />
                          Duration: {formatDuration(execution.started_at, execution.completed_at)}
                        </span>
                      </div>
                      {execution.error_message && (
                        <div className=" ">$2</div><strong>Error:</strong> {execution.error_message}
                        </div>
                      )}
                    </div>
                    <div className="{getExecutionActions(execution)}">$2</div>
                      <Button variant="ghost" size="sm" />
                        <MoreVertical size={14} / /></Button></div>
    </div>
  ))}
            </div>
          )}
        </Card.Content></Card></div>);};

export default WorkflowExecutions;
