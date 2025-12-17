import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { Play, Pause, Square, MoreVertical, CheckCircle, XCircle, AlertCircle, Copy, Trash2, Edit, Eye, Clock, Activity, Zap, Calendar, User, ChevronRight, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { Modal } from '@/shared/components/ui/Modal';
import { LoadingSkeleton } from '@/shared/components/ui/LoadingStates';
import { Animated } from '@/shared/components/ui/AdvancedAnimations';
import { Progress } from '@/shared/components/ui/AdvancedProgress';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interfaces
interface Workflow {
  id: number;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  trigger: {
    type: string; };

  is_active: boolean;
  executions_count: number;
  success_rate: number;
  last_execution?: string;
  created_at: string;
  updated_at: string;
}

interface WorkflowSelection {
  selectedIds: Set<string | number>;
  isAllSelected: boolean; }

interface WorkflowPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number; }

interface WorkflowsGridProps {
  workflows: Workflow[];
  loading?: boolean;
  pagination: WorkflowPagination;
  selection: WorkflowSelection;
  onWorkflowSelect?: (e: any) => void;
  onWorkflowAction?: (e: any) => void;
  onPageChange?: (e: any) => void;
  className?: string;
  showSelection?: boolean;
  showActions?: boolean;
  showStats?: boolean;
  gridCols?: 1 | 2 | 3 | 4;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente de grid de workflows
 * Exibe workflows em formato de cards com visualização em grid
 */
const WorkflowsGrid: React.FC<WorkflowsGridProps> = ({ workflows,
  loading = false,
  pagination,
  selection,
  onWorkflowSelect,
  onWorkflowAction,
  onPageChange,
  className,
  showSelection = true,
  showActions = true,
  showStats = true,
  gridCols = 3
   }) => {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  // Handlers
  const handleSelectWorkflow = (workflowId: string | number) => {
    onWorkflowSelect(workflowId);};

  const handleSelectAll = () => {
    workflows.forEach(workflow => {
      onWorkflowSelect(workflow.id);

    });};

  const handleWorkflowAction = (workflowId: string | number, action: string) => {
    onWorkflowAction(workflowId, action);};

  const toggleCardExpansion = (workflowId: number) => {
    const newExpanded = new Set(expandedCards);

    if (newExpanded.has(workflowId)) {
      newExpanded.delete(workflowId);

    } else {
      newExpanded.add(workflowId);

    }
    setExpandedCards(newExpanded);};

  // Formatação
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });};

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);

    const now = new Date();

    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d atrás`;
    return format(date, 'dd/MM/yyyy', { locale: ptBR });};

  const getStatusBadge = (status: string, isActive: boolean) => {
    const statusConfig = {
      active: { label: 'Ativo', variant: 'default' as const, icon: CheckCircle },
      draft: { label: 'Rascunho', variant: 'secondary' as const, icon: Edit },
      paused: { label: 'Pausado', variant: 'outline' as const, icon: Pause },
      archived: { label: 'Arquivado', variant: 'destructive' as const, icon: Square } ;

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
        <>
      <Badge variant={config.variant} className="gap-1" />
      <Icon className="h-3 w-3" />
        {config.label}
      </Badge>);};

  const getTriggerTypeBadge = (type: string) => {
    const triggerConfig = {
      webhook: { label: 'Webhook', color: 'bg-blue-100 text-blue-800' },
      schedule: { label: 'Agendado', color: 'bg-green-100 text-green-800' },
      email_received: { label: 'Email', color: 'bg-purple-100 text-purple-800' },
      form_submitted: { label: 'Formulário', color: 'bg-orange-100 text-orange-800' },
      user_action: { label: 'Usuário', color: 'bg-pink-100 text-pink-800' },
      api_call: { label: 'API', color: 'bg-gray-100 text-gray-800' },
      manual: { label: 'Manual', color: 'bg-yellow-100 text-yellow-800' } ;

    const config = triggerConfig[type as keyof typeof triggerConfig] || triggerConfig.manual;

    return (
              <Badge variant="outline" className={config.color } />
        {config.label}
      </Badge>);};

  const getGridColsClass = () => {
    switch (gridCols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    } ;

  if (loading) { return (
        <>
      <div className={cn('grid gap-4', getGridColsClass(), className)  }>
      </div>{Array.from({ length: 6 }).map((_: unknown, index: unknown) => (
          <Card key={ index } />
            <Card.Header />
              <LoadingSkeleton className="h-4 w-3/4" />
              <LoadingSkeleton className="h-3 w-1/2" />
            </Card.Header>
            <Card.Content />
              <LoadingSkeleton className="h-20 w-full" />
            </Card.Content>
      </Card>
    </>
  ))}
      </div>);

  }

  if (workflows.length === 0) { return (
        <>
      <Card className={className } />
      <Card.Content className="flex flex-col items-center justify-center py-12" />
          <LayoutGrid className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum workflow encontrado</h3>
          <p className="text-muted-foreground text-center" />
            Crie seu primeiro workflow ou ajuste os filtros para ver mais resultados.
          </p>
        </Card.Content>
      </Card>);

  }

  return (
        <>
      <div className={cn('space-y-6', className)  }>
      </div>{/* Header com seleção */}
      {showSelection && workflows.length > 0 && (
        <div className=" ">$2</div><div className=" ">$2</div><Checkbox
              checked={ selection.isAllSelected }
              onCheckedChange={ handleSelectAll }
              aria-label="Selecionar todos"
            / />
            <span className="{selection.selectedIds.size} de {workflows.length} selecionados">$2</span>
            </span>
      </div>
    </>
  )}

      {/* Grid de Workflows */}
      <div className={cn('grid gap-4', getGridColsClass())  }>
        </div>{ (workflows || []).map((workflow: unknown, index: unknown) => (
          <Animated key={workflow.id } />
            <Card className={cn(
              'group hover:shadow-md transition-all duration-200 cursor-pointer',
              selection.selectedIds.has(workflow.id) && 'ring-2 ring-primary'
            ) } />
              <Card.Header className="pb-3" />
                <div className=" ">$2</div><div className=" ">$2</div><div className="{showSelection && (">$2</div>
                        <Checkbox
                          checked={ selection.selectedIds.has(workflow.id) }
                          onCheckedChange={ () => handleSelectWorkflow(workflow.id) }
                          onClick={ (e: unknown) => e.stopPropagation() }
                          aria-label={`Selecionar workflow ${workflow.name}`} />
                      )}
                      <Card.Title className="text-lg line-clamp-1 group-hover:text-primary transition-colors" />
                        {workflow.name}
                      </Card.Title>
                    </div>
                    
                    {workflow.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3" />
                        {workflow.description}
                      </p>
                    )}
                    
                    <div className="{getStatusBadge(workflow.status, workflow.is_active)}">$2</div>
                      {getTriggerTypeBadge(workflow.trigger.type)}
                    </div>
                  
                  { showActions && (
                    <DropdownMenu />
                      <DropdownMenuTrigger asChild />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={ (e: unknown) => e.stopPropagation()  }>
                          <MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" />
                        <DropdownMenuItem onClick={ () => handleWorkflowAction(workflow.id, 'view')  }>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={ () => handleWorkflowAction(workflow.id, 'edit')  }>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={ () => handleWorkflowAction(workflow.id, 'duplicate')  }>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator>
          { workflow.is_active ? (
                          <DropdownMenuItem onClick={ () => handleWorkflowAction(workflow.id, 'pause')  }>
                            <Pause className="h-4 w-4 mr-2" />
                            Pausar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={ () => handleWorkflowAction(workflow.id, 'activate')  }>
                            <Play className="h-4 w-4 mr-2" />
                            Ativar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={ () => handleWorkflowAction(workflow.id, 'execute')  }>
                          <Zap className="h-4 w-4 mr-2" />
                          Executar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator / />
                        <DropdownMenuItem 
                          onClick={ () => handleWorkflowAction(workflow.id, 'delete') }
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                  )}
                </div>
              </Card.Header>

              <Card.Content className="pt-0" />
                {showStats && (
                  <div className="{/* Estatísticas */}">$2</div>
                    <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="text-2xl font-bold">{workflow.executions_count}</span></div><p className="text-xs text-muted-foreground">Execuções</p></div><div className=" ">$2</div><div className=" ">$2</div><CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="{workflow.success_rate.toFixed(0)}%">$2</span>
                          </span></div><p className="text-xs text-muted-foreground">Sucesso</p>
                      </div>

                    {/* Barra de Progresso */}
                    <div className=" ">$2</div><div className=" ">$2</div><span>Taxa de Sucesso</span>
                        <span>{workflow.success_rate.toFixed(1)}%</span></div><Progress 
                        value={ workflow.success_rate }
                        className="h-2"
                        color={ workflow.success_rate > 80 ? 'green' : workflow.success_rate > 60 ? 'yellow' : 'red' } />
                    </div>

                    {/* Última Execução */}
                    <div className=" ">$2</div><div className=" ">$2</div><Clock className="h-4 w-4" />
                        <span>Última execução</span></div><span className="{workflow.last_execution ">$2</span>
                          ? formatRelativeDate(workflow.last_execution)
                          : 'Nunca'
                        }
                      </span>
      </div>
    </>
  )}

                {/* Informações Expandidas */}
                {expandedCards.has(workflow.id) && (
                  <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><span className="text-muted-foreground">ID:</span>
                        <span className="ml-2 font-mono">{workflow.id}</span></div><div>
           
        </div><span className="text-muted-foreground">Criado:</span>
                        <span className="ml-2">{formatRelativeDate(workflow.created_at)}</span></div><div className=" ">$2</div><Button
                        variant="outline"
                        size="sm"
                        onClick={ () => handleWorkflowAction(workflow.id, 'view') }
                        className="gap-1 flex-1"
                      >
                        <Eye className="h-3 w-3" />
                        Ver Detalhes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={ () => handleWorkflowAction(workflow.id, 'edit') }
                        className="gap-1 flex-1"
                      >
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>
      </div>
    </>
  )}

                {/* Botão de Expandir */}
                <div className=" ">$2</div><Button
                    variant="ghost"
                    size="sm"
                    onClick={ () => toggleCardExpansion(workflow.id) }
                    className="w-full gap-2"
                  >
                    {expandedCards.has(workflow.id) ? (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Menos detalhes
                      </>
                    ) : (
                      <>
                        <ChevronRight className="h-4 w-4" />
                        Mais detalhes
                      </>
                    )}
                  </Button></div></Card.Content></Card></Animated>
        ))}
      </div>

      {/* Paginação */}
      {pagination.total_pages > 1 && (
        <div className=" ">$2</div><div className="Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}">$2</div>
            {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
            {pagination.total} workflows
          </div>
          
          <div className=" ">$2</div><Button
              variant="outline"
              size="sm"
              onClick={ () => onPageChange(pagination.page - 1) }
              disabled={ pagination.page <= 1  }>
              Anterior
            </Button>
            
            <div className="{Array.from({ length: Math.min(5, pagination.total_pages) }, (_: unknown, i: unknown) => {">$2</div>
                const page = i + 1;
                return (
                          <Button
                    key={ page }
                    variant={ page === pagination.page ? 'default' : 'outline' }
                    size="sm"
                    onClick={ () => onPageChange(page) }
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>);

              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={ () => onPageChange(pagination.page + 1) }
              disabled={ pagination.page >= pagination.total_pages  }>
              Próximo
            </Button>
      </div>
    </>
  )}
    </div>);};

export default WorkflowsGrid;
