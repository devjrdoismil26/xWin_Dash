import React, { useState } from 'react';
import { Trash2, Play, Pause, Copy, Download, Archive, AlertTriangle, CheckCircle, X, Loader2 } from 'lucide-react';
import {  } from '@/lib/utils';
// getErrorMessage removido - usar try/catch direto
import { Card } from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { Progress } from '@/shared/components/ui/Progress';
import { Animated } from '@/shared/components/ui/AdvancedAnimations';
import { cn } from '@/lib/utils';

// Interfaces
interface WorkflowsActionsProps {
  selectedCount: number;
  onClearSelection??: (e: any) => void;
  onBulkAction?: (action: string) => Promise<{ success: boolean;
  processedCount: number;
  errors: string[]
children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }>;
  className?: string;
  showProgress?: boolean;
  allowDestructiveActions?: boolean;
}

interface BulkAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string;
}>;
  variant: 'default' | 'destructive' | 'outline';
  requiresConfirmation: boolean;
  confirmationTitle: string;
  confirmationMessage: string;
}

// Ações disponíveis
const BULK_ACTIONS: BulkAction[] = [
  {
    id: 'activate',
    label: 'Ativar',
    description: 'Ativar todos os workflows selecionados',
    icon: Play,
    variant: 'default',
    requiresConfirmation: false,
    confirmationTitle: '',
    confirmationMessage: ''
  },
  {
    id: 'pause',
    label: 'Pausar',
    description: 'Pausar todos os workflows selecionados',
    icon: Pause,
    variant: 'outline',
    requiresConfirmation: false,
    confirmationTitle: '',
    confirmationMessage: ''
  },
  {
    id: 'duplicate',
    label: 'Duplicar',
    description: 'Criar cópias dos workflows selecionados',
    icon: Copy,
    variant: 'outline',
    requiresConfirmation: true,
    confirmationTitle: 'Duplicar Workflows',
    confirmationMessage: 'Tem certeza que deseja duplicar os workflows selecionados? Isso criará cópias exatas de cada workflow.'
  },
  {
    id: 'archive',
    label: 'Arquivar',
    description: 'Arquivar todos os workflows selecionados',
    icon: Archive,
    variant: 'outline',
    requiresConfirmation: true,
    confirmationTitle: 'Arquivar Workflows',
    confirmationMessage: 'Tem certeza que deseja arquivar os workflows selecionados? Eles não aparecerão mais na lista principal.'
  },
  {
    id: 'export',
    label: 'Exportar',
    description: 'Exportar workflows selecionados',
    icon: Download,
    variant: 'outline',
    requiresConfirmation: false,
    confirmationTitle: '',
    confirmationMessage: ''
  },
  {
    id: 'delete',
    label: 'Excluir',
    description: 'Excluir permanentemente os workflows selecionados',
    icon: Trash2,
    variant: 'destructive',
    requiresConfirmation: true,
    confirmationTitle: 'Excluir Workflows',
    confirmationMessage: 'Tem certeza que deseja excluir permanentemente os workflows selecionados? Esta ação não pode ser desfeita.'
  }
];

/**
 * Componente de ações em lote para workflows
 * Permite executar ações em múltiplos workflows selecionados
 */
const WorkflowsActions: React.FC<WorkflowsActionsProps> = ({ selectedCount,
  onClearSelection,
  onBulkAction,
  className,
  showProgress = true,
  allowDestructiveActions = true
   }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const [currentAction, setCurrentAction] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [pendingAction, setPendingAction] = useState<BulkAction | null>(null);

  const [results, setResults] = useState<{
    success: boolean;
    processedCount: number;
    errors: string[];
  } | null>(null);

  // Filtrar ações baseado nas permissões
  const availableActions = (BULK_ACTIONS || []).filter(action => 
    allowDestructiveActions || action.variant !== 'destructive');

  // Handlers
  const handleBulkAction = async (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setPendingAction(action);

      setShowConfirmation(true);

      return;
    }

    await executeAction(action);};

  const executeAction = async (action: BulkAction) => {
    if (!onBulkAction) return;

    setIsProcessing(true);

    setCurrentAction(action.id);

    setProgress(0);

    setResults(null);

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);

            return 90;
          }
          return prev + 10;
        });

      }, 200);

      const result = await onBulkAction(action.id);

      clearInterval(progressInterval);

      setProgress(100);

      setResults(result);

      // Limpar seleção se a ação foi bem-sucedida
      if (result.success && result.processedCount > 0) {
        setTimeout(() => {
          onClearSelection();

          setResults(null);

        }, 2000);

      } catch (error) {
      setResults({
        success: false,
        processedCount: 0,
        errors: [getErrorMessage(error)]
      });

    } finally {
      setIsProcessing(false);

      setCurrentAction(null);

      setProgress(0);

    } ;

  const handleConfirmAction = async () => {
    if (pendingAction) {
      setShowConfirmation(false);

      await executeAction(pendingAction);

      setPendingAction(null);

    } ;

  const handleCancelAction = () => {
    setShowConfirmation(false);

    setPendingAction(null);};

  const clearResults = () => {
    setResults(null);};

  if (selectedCount === 0) {
    return null;
  }

  return (
            <>
      <Animated />
        <Card className={cn('border-primary/20 bg-primary/5', className) } />
          <Card.Content className="p-4" />
            <div className=" ">$2</div><div className=" ">$2</div><Badge variant="secondary" className="gap-1" />
                  <CheckCircle className="h-3 w-3" />
                  {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
                </Badge>
                
                <span className="Ações disponíveis para os workflows selecionados">$2</span>
                </span></div><Button
                variant="ghost"
                size="sm"
                onClick={ onClearSelection }
                className="gap-2" />
                <X className="h-4 w-4" />
                Limpar seleção
              </Button>
            </div>

            {/* Ações */}
            <div className="{(availableActions || []).map((action: unknown) => {">$2</div>
                const Icon = action.icon;
                const isCurrentAction = currentAction === action.id;
                
                return (
                          <Button
                    key={ action.id }
                    variant={ action.variant }
                    size="sm"
                    onClick={ () => handleBulkAction(action) }
                    disabled={ isProcessing }
                    className="gap-2"
                  >
                    {isCurrentAction ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    {action.label}
                  </Button>);

              })}
            </div>

            {/* Progresso */}
            {isProcessing && showProgress && (
              <div className=" ">$2</div><div className=" ">$2</div><span>Processando ação...</span>
                  <span>{progress}%</span></div><Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Resultados */}
            { results && (
              <div className={cn(
                'mt-4 p-3 rounded-md border',
                results.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              )  }>
        </div><div className="{results.success ? (">$2</div>
      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
    </>
  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  
                  <div className=" ">$2</div><div className="{results.success ? 'Ação concluída com sucesso!' : 'Ação falhou'}">$2</div>
                    </div>
                    
                    <div className="{results.success ">$2</div>
                        ? `${results.processedCount} workflow${results.processedCount > 1 ? 's' : ''} processado${results.processedCount > 1 ? 's' : ''} com sucesso.`
                        : `${results.processedCount} workflow${results.processedCount > 1 ? 's' : ''} processado${results.processedCount > 1 ? 's' : ''}.`
                      }
                    </div>

                    {results.errors.length > 0 && (
                      <div className=" ">$2</div><div className="text-sm font-medium">Erros encontrados:</div>
                        <ul className="text-sm mt-1 space-y-1" />
                          {(results.errors || []).map((error: unknown, index: unknown) => (
                            <li key={index} className="flex items-start gap-1" />
                              <span className="text-red-600">•</span>
                              <span>{error}</span>
      </li>
    </>
  ))}
                        </ul>
      </div>
    </>
  )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={ clearResults }
                    className="h-6 w-6 p-0" />
                    <X className="h-4 w-4" /></Button></div>
            )}
          </Card.Content></Card></Animated>

      {/* Modal de Confirmação */}
      { showConfirmation && pendingAction && (
        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className={cn(
                  'p-2 rounded-full',
                  pendingAction.variant === 'destructive' 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-blue-100 text-blue-600'
                )  }>
        </div><pendingAction.icon className="h-5 w-5" /></div><h3 className="text-lg font-semibold" />
                  {pendingAction.confirmationTitle}
                </h3></div><p className="text-muted-foreground mb-6" />
                {pendingAction.confirmationMessage}
              </p>

              <div className=" ">$2</div><Button
                  variant="outline"
                  onClick={ handleCancelAction }
                  disabled={ isProcessing } />
                  Cancelar
                </Button>
                <Button
                  variant={ pendingAction.variant }
                  onClick={ handleConfirmAction }
                  disabled={ isProcessing }
                  className="gap-2" />
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <pendingAction.icon className="h-4 w-4" />
                      Confirmar
                    </>
                  )}
                </Button></div></div>
      )}
    </>);};

export default WorkflowsActions;
