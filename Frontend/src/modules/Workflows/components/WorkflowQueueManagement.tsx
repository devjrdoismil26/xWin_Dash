/**
 * Gerenciamento de fila de workflows
 *
 * @description
 * Componente completo para gerenciar fila de workflows incluindo processar,
 * retry de itens falhados, limpar fila e visualizar status.
 * Gerencia estados de processamento e exibe resultados.
 *
 * @module modules/Workflows/components/WorkflowQueueManagement
 * @since 1.0.0
 */

import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/Dialog';
import { Progress } from '@/shared/components/ui/Progress';
import { Play, Pause, RotateCcw, Trash2, Settings, AlertTriangle, CheckCircle, Clock, Activity, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { useWorkflowQueueStatus, useWorkflowQueueManagement } from '../hooks/useWorkflowsAdvanced';

/**
 * Props do componente WorkflowQueueManagement
 *
 * @interface WorkflowQueueManagementProps
 * @property {string} [className] - Classes CSS adicionais
 */
interface WorkflowQueueManagementProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente WorkflowQueueManagement
 *
 * @description
 * Renderiza interface de gerenciamento de fila com status, bot?es de controle
 * (processar, retry, limpar) e modais de confirma??o.
 * Exibe progresso e resultados de processamento.
 *
 * @param {WorkflowQueueManagementProps} [props] - Props do componente
 * @returns {JSX.Element} Gerenciador de fila
 */
export const WorkflowQueueManagement: React.FC<WorkflowQueueManagementProps> = () => {
  const { status, loading: statusLoading, error: statusError, refresh: refreshStatus, startProcessing, stopProcessing } = useWorkflowQueueStatus();

  const { loading: managementLoading, error: managementError, processQueue, retryFailed, retryAll, clearQueue } = useWorkflowQueueManagement();

  const [isProcessing, setIsProcessing] = useState(false);

  const [processResult, setProcessResult] = useState<any>(null);

  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const handleProcessQueue = async () => {
    try {
      setIsProcessing(true);

      const result = await processQueue();

      setProcessResult(result);

      setIsProcessModalOpen(true);

      await refreshStatus();

    } catch (error) {
      console.error('Error processing queue:', error);

    } finally {
      setIsProcessing(false);

    } ;

  const handleRetryFailed = async () => {
    try {
      setIsProcessing(true);

      const result = await retryFailed();

      setProcessResult(result);

      setIsProcessModalOpen(true);

      await refreshStatus();

    } catch (error) {
      console.error('Error retrying failed executions:', error);

    } finally {
      setIsProcessing(false);

    } ;

  const handleRetryAll = async () => {
    try {
      setIsProcessing(true);

      const result = await retryAll();

      setProcessResult(result);

      setIsProcessModalOpen(true);

      await refreshStatus();

    } catch (error) {
      console.error('Error retrying all executions:', error);

    } finally {
      setIsProcessing(false);

    } ;

  const handleClearQueue = async () => {
    try {
      setIsProcessing(true);

      const result = await clearQueue();

      setProcessResult(result);

      setIsClearModalOpen(false);

      await refreshStatus();

    } catch (error) {
      console.error('Error clearing queue:', error);

    } finally {
      setIsProcessing(false);

    } ;

  const handleStartProcessing = async () => {
    try {
      await startProcessing();

    } catch (error) {
      console.error('Error starting processing:', error);

    } ;

  const handleStopProcessing = async () => {
    try {
      await stopProcessing();

    } catch (error) {
      console.error('Error stopping processing:', error);

    } ;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();};

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'default' : 'secondary';};

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />;};

  if (statusLoading) return <div>Loading queue status...</div>;
  if (statusError) return <div>Error: {statusError}</div>;

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h2 className="text-2xl font-bold">Queue Management</h2>
        <div className=" ">$2</div><Button variant="outline" onClick={ refreshStatus } />
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          { status?.isProcessing ? (
            <Button variant="outline" onClick={handleStopProcessing } />
              <Pause className="w-4 h-4 mr-2" />
              Square Processing
            </Button>
          ) : (
            <Button onClick={ handleStartProcessing } />
              <Play className="w-4 h-4 mr-2" />
              Start Processing
            </Button>
          )}
        </div>

      <div className="{/* Queue Status */}">$2</div>
        <Card />
          <Card.Header />
            <Card.Title className="flex items-center gap-2" />
              <Settings className="w-5 h-5" />
              Queue Status
            </Card.Title>
          </Card.Header>
          <Card.Content />
            <div className=" ">$2</div><div className=" ">$2</div><span className="font-medium">Processing Status</span>
                <Badge variant={getStatusColor(status?.isProcessing || false)} className="flex items-center gap-1" />
                  {getStatusIcon(status?.isProcessing || false)}
                  {status?.isProcessing ? 'Active' : 'Paused'}
                </Badge></div><div className=" ">$2</div><div>
           
        </div><div className="text-sm font-medium text-muted-foreground">Queue Size</div>
                  <div className="text-2xl font-bold">{status?.queueSize || 0}</div>
                <div>
           
        </div><div className="text-sm font-medium text-muted-foreground">Currently Processing</div>
                  <div className="text-2xl font-bold">{status?.currentProcessing || 0}</div>
                <div>
           
        </div><div className="text-sm font-medium text-muted-foreground">Last Processed</div>
                  <div className="{status?.lastProcessedAt ? formatDate(status.lastProcessedAt) : 'Never'}">$2</div>
                  </div>
                <div>
           
        </div><div className="text-sm font-medium text-muted-foreground">Next Scheduled</div>
                  <div className="{status?.nextScheduledAt ? formatDate(status.nextScheduledAt) : 'Not scheduled'}">$2</div>
                  </div>
              </div>

              {status?.errors && status.errors.length > 0 && (
                <div>
           
        </div><div className="text-sm font-medium text-red-600 mb-2">Recent Errors</div>
                  <div className="{status.errors.slice(0, 3).map((error: unknown, index: unknown) => (">$2</div>
                      <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
                    ))}
                  </div>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Queue Actions */}
        <Card />
          <Card.Header />
            <Card.Title className="flex items-center gap-2" />
              <BarChart3 className="w-5 h-5" />
              Queue Actions
            </Card.Title>
          </Card.Header>
          <Card.Content />
            <div className=" ">$2</div><Button
                onClick={ handleProcessQueue }
                disabled={ isProcessing || managementLoading }
                className="h-20 flex flex-col items-center justify-center" />
                <Play className="w-6 h-6 mb-2" />
                <span>Process Queue</span></Button><Button
                variant="outline"
                onClick={ handleRetryFailed }
                disabled={ isProcessing || managementLoading }
                className="h-20 flex flex-col items-center justify-center" />
                <RotateCcw className="w-6 h-6 mb-2" />
                <span>Retry Failed</span></Button><Button
                variant="outline"
                onClick={ handleRetryAll }
                disabled={ isProcessing || managementLoading }
                className="h-20 flex flex-col items-center justify-center" />
                <RotateCcw className="w-6 h-6 mb-2" />
                <span>Retry All</span></Button><Dialog open={isClearModalOpen} onOpenChange={ setIsClearModalOpen } />
                <DialogTrigger asChild />
                  <Button
                    variant="destructive"
                    disabled={ isProcessing || managementLoading }
                    className="h-20 flex flex-col items-center justify-center" />
                    <Trash2 className="w-6 h-6 mb-2" />
                    <span>Clear Queue</span></Button></DialogTrigger>
                <DialogContent />
                  <DialogHeader />
                    <DialogTitle>Clear Queue</DialogTitle></DialogHeader><div className=" ">$2</div><p>Are you sure you want to clear the entire queue? This action cannot be undone.</p>
                    <div className=" ">$2</div><Button variant="outline" onClick={ () => setIsClearModalOpen(false)  }>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={ handleClearQueue } />
                        Clear Queue
                      </Button></div></DialogContent></Dialog></div>
          </Card.Content>
        </Card>

        {/* Processing Progress */}
        {isProcessing && (
          <Card />
            <Card.Header />
              <Card.Title className="flex items-center gap-2" />
                <Activity className="w-5 h-5" />
                Processing...
              </Card.Title>
            </Card.Header>
            <Card.Content />
              <div className=" ">$2</div><Progress value={undefined} className="w-full" />
                <p className="text-sm text-muted-foreground" />
                  Processing queue items. Please wait...
                </p></div></Card.Content>
      </Card>
    </>
  )}

        {/* Management Errors */}
        {managementError && (
          <Card />
            <Card.Header />
              <Card.Title className="flex items-center gap-2 text-red-600" />
                <AlertTriangle className="w-5 h-5" />
                Management Error
              </Card.Title>
            </Card.Header>
            <Card.Content />
              <div className="{managementError}">$2</div>
              </div>
            </Card.Content>
      </Card>
    </>
  )}
      </div>

      {/* Process Result Modal */}
      <Dialog open={isProcessModalOpen} onOpenChange={ setIsProcessModalOpen } />
        <DialogContent />
          <DialogHeader />
            <DialogTitle>Processing Result</DialogTitle>
          </DialogHeader>
          {processResult && (
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Processed: {processResult.processed}</span></div><div className=" ">$2</div><AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Failed: {processResult.failed}</span></div><div className=" ">$2</div><Clock className="w-5 h-5 text-blue-600" />
                  <span>Skipped: {processResult.skipped}</span></div><div className=" ">$2</div><Activity className="w-5 h-5 text-purple-600" />
                  <span>Time: {processResult.processingTime}s</span>
                </div>
              
              {processResult.errors && processResult.errors.length > 0 && (
                <div>
           
        </div><div className="text-sm font-medium text-red-600 mb-2">Errors</div>
                  <div className="{(processResult.errors || []).map((error: string, index: number) => (">$2</div>
                      <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
                    ))}
                  </div>
              )}
              
              <div className=" ">$2</div><Button onClick={ () => setIsProcessModalOpen(false)  }>
                  Close
                </Button>
      </div>
    </>
  )}
        </DialogContent></Dialog></div>);};
