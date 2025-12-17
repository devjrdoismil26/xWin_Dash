/**
 * Fila de execu??o de workflows
 *
 * @description
 * Componente completo para visualizar e gerenciar fila de execu??o de workflows.
 * Suporta filtros, ordena??o, pagina??o e a??es em lote.
 * Exibe status detalhado de cada item na fila.
 *
 * @module modules/Workflows/components/WorkflowExecutionQueue
 * @since 1.0.0
 */

import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/Select';
import { Badge } from '@/shared/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/Dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Play, Pause, RotateCcw, Trash2, X, Clock, AlertTriangle, CheckCircle, XCircle, Loader, Filter, Search, RefreshCw, Settings, Eye, Edit } from 'lucide-react';
import { useWorkflowExecutionQueue, useWorkflowQueueStatus, useWorkflowQueueManagement } from '../hooks/useWorkflowsAdvanced';
import { WorkflowExecutionQueue, WorkflowExecutionQueueStatus, WorkflowExecutionPriority } from '../types/workflowTypes';

/**
 * Props do componente WorkflowExecutionQueue
 *
 * @interface WorkflowExecutionQueueProps
 * @property {string} [className] - Classes CSS adicionais
 */
interface WorkflowExecutionQueueProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente WorkflowExecutionQueue
 *
 * @description
 * Renderiza tabela de execu??es com filtros, busca, ordena??o e pagina??o.
 * Exibe status, prioridade e permite a??es (visualizar, editar, cancelar).
 *
 * @param {WorkflowExecutionQueueProps} [props] - Props do componente
 * @returns {JSX.Element} Fila de execu??o
 */
export const WorkflowExecutionQueue: React.FC<WorkflowExecutionQueueProps> = () => {
  const { 
    queue, 
    stats, 
    pagination, 
    loading, 
    error, 
    filters, 
    sort, 
    setFilters, 
    setSort, 
    setPage, 
    refresh, 
    processQueue, 
    retryFailed, 
    retryAll, 
    clearQueue, 
    cancelExecution, 
    retryExecution 
  } = useWorkflowExecutionQueue();

  const { status, refresh: refreshStatus } = useWorkflowQueueStatus();

  const { updateExecutionPriority } = useWorkflowQueueManagement();

  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecutionQueue | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const getStatusColor = (status: WorkflowExecutionQueueStatus) => {
    switch (status) {
      case 'pending': return 'default';
      case 'processing': return 'secondary';
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      case 'cancelled': return 'outline';
      case 'retrying': return 'secondary';
      default: return 'default';
    } ;

  const getStatusIcon = (status: WorkflowExecutionQueueStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Loader className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      case 'retrying': return <RotateCcw className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    } ;

  const getPriorityColor = (priority: WorkflowExecutionPriority) => {
    switch (priority) {
      case 'low': return 'outline';
      case 'normal': return 'default';
      case 'high': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'default';
    } ;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();};

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start).getTime();

    const endTime = end ? new Date(end).getTime() : Date.now();

    const duration = endTime - startTime;
    return `${Math.round(duration / 1000)}s`;};

  const handleViewDetails = (execution: Record<string, any>) => {
    setSelectedExecution(execution);

    setIsDetailsModalOpen(true);};

  const handleUpdatePriority = async (id: string, priority: WorkflowExecutionPriority) => {
    try {
      await updateExecutionPriority(id, priority);

      await refresh();

    } catch (error) {
      console.error('Error updating priority:', error);

    } ;

  if (loading) return <div>Loading execution queue...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h2 className="text-2xl font-bold">Execution Queue</h2>
        <div className=" ">$2</div><Button variant="outline" onClick={ () => setIsFiltersModalOpen(true)  }>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" onClick={ refresh } />
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={ processQueue } />
            <Play className="w-4 h-4 mr-2" />
            Process Queue
          </Button></div><Tabs defaultValue="queue" className="space-y-4" />
        <TabsList />
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger></TabsList><TabsContent value="queue" className="space-y-4" />
          <div className="{ queue?.map((execution: unknown) => (">$2</div>
              <Card key={execution.id } />
                <Card.Header />
                  <div className=" ">$2</div><div>
           
        </div><Card.Title className="flex items-center gap-2" />
                        {execution.workflowName}
                        <Badge variant={getStatusColor(execution.status)} className="flex items-center gap-1" />
                          {getStatusIcon(execution.status)}
                          {execution.status}
                        </Badge>
                        <Badge variant={ getPriorityColor(execution.priority) } />
                          {execution.priority}
                        </Badge>
                      </Card.Title>
                      <p className="text-sm text-muted-foreground mt-1" />
                        Workflow ID: {execution.workflowId}
                      </p></div><div className=" ">$2</div><Button
                        variant="outline"
                        size="sm"
                        onClick={ () => handleViewDetails(execution)  }>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {execution.status === 'pending' && (
                        <Select
                          value={ execution.priority }
                          onChange={ (value: unknown) => handleUpdatePriority(execution.id, value as WorkflowExecutionPriority)  }>
                          <SelectTrigger className="w-32" />
                            <SelectValue / /></SelectTrigger><SelectContent />
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem></SelectContent></Select>
                      )}
                      { execution.status === 'failed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={ () => retryExecution(execution.id)  }>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                      { execution.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={ () => cancelExecution(execution.id)  }>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                </Card.Header>
                <Card.Content />
                  <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><div className="text-sm font-medium">Scheduled</div>
                        <div className="{formatDate(execution.scheduledAt)}">$2</div>
                        </div>
                      <div>
           
        </div><div className="text-sm font-medium">Started</div>
                        <div className="{execution.startedAt ? formatDate(execution.startedAt) : 'Not started'}">$2</div>
                        </div>
                      <div>
           
        </div><div className="text-sm font-medium">Duration</div>
                        <div className="{execution.startedAt ? formatDuration(execution.startedAt, execution.completedAt) : '-'}">$2</div>
                        </div>
                      <div>
           
        </div><div className="text-sm font-medium">Retries</div>
                        <div className="{execution.retryCount}/{execution.maxRetries}">$2</div>
                        </div>
                    </div>
                    
                    {execution.errorMessage && (
                      <div>
           
        </div><div className="text-sm font-medium text-red-600 mb-1">Error</div>
                        <div className="{execution.errorMessage}">$2</div>
    </div>
  )}
                  </div>
                </Card.Content>
      </Card>
    </>
  ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className=" ">$2</div><Button
                variant="outline"
                onClick={ () => setPage(pagination.page - 1) }
                disabled={ pagination.page === 1  }>
                Previous
              </Button>
              <span className="Page {pagination.page} of {pagination.totalPages}">$2</span>
              </span>
              <Button
                variant="outline"
                onClick={ () => setPage(pagination.page + 1) }
                disabled={ pagination.page === pagination.totalPages  }>
                Next
              </Button>
      </div>
    </>
  )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-4" />
          <div className=" ">$2</div><Card />
              <Card.Header />
                <Card.Title className="text-sm font-medium">Total</Card.Title>
              </Card.Header>
              <Card.Content />
                <div className="text-2xl font-bold">{stats.total}</div>
              </Card.Content></Card><Card />
              <Card.Header />
                <Card.Title className="text-sm font-medium">Pending</Card.Title>
              </Card.Header>
              <Card.Content />
                <div className="text-2xl font-bold">{stats.pending}</div>
              </Card.Content></Card><Card />
              <Card.Header />
                <Card.Title className="text-sm font-medium">Processing</Card.Title>
              </Card.Header>
              <Card.Content />
                <div className="text-2xl font-bold">{stats.processing}</div>
              </Card.Content></Card><Card />
              <Card.Header />
                <Card.Title className="text-sm font-medium">Completed</Card.Title>
              </Card.Header>
              <Card.Content />
                <div className="text-2xl font-bold">{stats.completed}</div>
              </Card.Content></Card><Card />
              <Card.Header />
                <Card.Title className="text-sm font-medium">Failed</Card.Title>
              </Card.Header>
              <Card.Content />
                <div className="text-2xl font-bold">{stats.failed}</div>
              </Card.Content></Card><Card />
              <Card.Header />
                <Card.Title className="text-sm font-medium">Error Rate</Card.Title>
              </Card.Header>
              <Card.Content />
                <div className="text-2xl font-bold">{stats.errorRate.toFixed(1)}%</div>
              </Card.Content></Card><Card />
              <Card.Header />
                <Card.Title className="text-sm font-medium">Avg Processing Time</Card.Title>
              </Card.Header>
              <Card.Content />
                <div className="text-2xl font-bold">{stats.averageProcessingTime.toFixed(1)}s</div>
              </Card.Content></Card><Card />
              <Card.Header />
                <Card.Title className="text-sm font-medium">Throughput</Card.Title>
              </Card.Header>
              <Card.Content />
                <div className="text-2xl font-bold">{stats.throughput.toFixed(1)}/min</div>
              </Card.Content></Card></div></TabsContent><TabsContent value="status" className="space-y-4" />
          { status && (
            <div className=" ">$2</div><Card />
                <Card.Header />
                  <Card.Title>Queue Status</Card.Title>
                </Card.Header>
                <Card.Content />
                  <div className=" ">$2</div><div className=" ">$2</div><span>Processing Status</span>
                      <Badge variant={status.isProcessing ? 'default' : 'secondary' } />
                        {status.isProcessing ? 'Active' : 'Paused'}
                      </Badge></div><div className=" ">$2</div><span>Queue Size</span>
                      <span>{status.queueSize}</span></div><div className=" ">$2</div><span>Currently Processing</span>
                      <span>{status.currentProcessing}</span></div><div className=" ">$2</div><span>Last Processed</span>
                      <span>{status.lastProcessedAt ? formatDate(status.lastProcessedAt) : 'Never'}</span></div><div className=" ">$2</div><span>Next Scheduled</span>
                      <span>{status.nextScheduledAt ? formatDate(status.nextScheduledAt) : 'Not scheduled'}</span></div></Card.Content></Card></div>
          )}
        </TabsContent></Tabs><Dialog open={isDetailsModalOpen} onOpenChange={ setIsDetailsModalOpen } />
        <DialogContent className="max-w-2xl" />
          <DialogHeader />
            <DialogTitle>Execution Details</DialogTitle>
          </DialogHeader>
          {selectedExecution && (
            <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><Label>Workflow</Label>
                  <div className="text-sm">{selectedExecution.workflowName}</div>
                <div>
           
        </div><Label>Status</Label>
                  <Badge variant={ getStatusColor(selectedExecution.status) } />
                    {selectedExecution.status}
                  </Badge></div><div>
           
        </div><Label>Priority</Label>
                  <Badge variant={ getPriorityColor(selectedExecution.priority) } />
                    {selectedExecution.priority}
                  </Badge></div><div>
           
        </div><Label>Retries</Label>
                  <div className="text-sm">{selectedExecution.retryCount}/{selectedExecution.maxRetries}</div></div><div>
           
        </div><Label>Trigger Data</Label>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto" />
                  {JSON.stringify(selectedExecution.triggerData, null, 2)}
                </pre></div><div>
           
        </div><Label>Context</Label>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto" />
                  {JSON.stringify(selectedExecution.context, null, 2)}
                </pre>
      </div>
    </>
  )}
        </DialogContent></Dialog><Dialog open={isFiltersModalOpen} onOpenChange={ setIsFiltersModalOpen } />
        <DialogContent />
          <DialogHeader />
            <DialogTitle>Filter Queue</DialogTitle></DialogHeader><div className=" ">$2</div><div>
           
        </div><Label>Status</Label>
              <Select
                value={ filters.status?.[0] || '' }
                onChange={(value: unknown) => setFilters({ ...filters, status: value ? [value as WorkflowExecutionQueueStatus] : undefined })}
  >
                <SelectTrigger />
                  <SelectValue placeholder="Select status" / /></SelectTrigger><SelectContent />
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="retrying">Retrying</SelectItem></SelectContent></Select></div><div>
           
        </div><Label>Priority</Label>
              <Select
                value={ filters.priority?.[0] || '' }
                onChange={(value: unknown) => setFilters({ ...filters, priority: value ? [value as WorkflowExecutionPriority] : undefined })}
  >
                <SelectTrigger />
                  <SelectValue placeholder="Select priority" / /></SelectTrigger><SelectContent />
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem></SelectContent></Select></div><div>
           
        </div><Label>Search</Label>
              <Input
                value={ filters.search || '' }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by workflow name..." /></div><div className=" ">$2</div><Button variant="outline" onClick={() => setFilters({})}>
                Clear Filters
              </Button>
              <Button onClick={ () => setIsFiltersModalOpen(false)  }>
                Apply Filters
              </Button></div></DialogContent></Dialog></div>);};
