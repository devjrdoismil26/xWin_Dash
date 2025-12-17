import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, ChevronDown, RotateCcw, Save, Bookmark } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Badge from '@/shared/components/ui/Badge';
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/Select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Modal } from '@/shared/components/ui/Modal';
import CalendarComponent from '@/shared/components/ui/Calendar';
import { Animated } from '@/shared/components/ui/AdvancedAnimations';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interfaces
interface WorkflowFilters {
  status?: string;
  search?: string;
  trigger_type?: string;
  created_after?: string;
  created_before?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc'; }

interface WorkflowsFiltersProps {
  filters: WorkflowFilters;
  onFiltersChange?: (e: any) => void;
  onClearFilters??: (e: any) => void;
  className?: string;
  showAdvancedFilters?: boolean;
  showPresets?: boolean;
  showSortOptions?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

// Opções de filtros
const STATUS_OPTIONS = [
  { value: '', label: 'Todos os Status' },
  { value: 'active', label: 'Ativo' },
  { value: 'draft', label: 'Rascunho' },
  { value: 'paused', label: 'Pausado' },
  { value: 'archived', label: 'Arquivado' }
];

const TRIGGER_TYPE_OPTIONS = [
  { value: '', label: 'Todos os Tipos' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'schedule', label: 'Agendado' },
  { value: 'email_received', label: 'Email Recebido' },
  { value: 'form_submitted', label: 'Formulário Enviado' },
  { value: 'user_action', label: 'Ação do Usuário' },
  { value: 'api_call', label: 'Chamada de API' },
  { value: 'manual', label: 'Manual' }
];

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Data de Criação' },
  { value: 'updated_at', label: 'Última Atualização' },
  { value: 'name', label: 'Nome' },
  { value: 'status', label: 'Status' },
  { value: 'executions_count', label: 'Número de Execuções' },
  { value: 'success_rate', label: 'Taxa de Sucesso' }
];

const SORT_ORDER_OPTIONS = [
  { value: 'desc', label: 'Decrescente' },
  { value: 'asc', label: 'Crescente' }
];

// Presets de filtros
const FILTER_PRESETS = [
  {
    id: 'active_workflows',
    name: 'Workflows Ativos',
    description: 'Apenas workflows ativos',
    filters: { status: 'active' } ,
  {
    id: 'recent_workflows',
    name: 'Recentes',
    description: 'Workflows criados nos últimos 7 dias',
    filters: { 
      created_after: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    } ,
  {
    id: 'high_performance',
    name: 'Alta Performance',
    description: 'Workflows com alta taxa de sucesso',
    filters: { sort_by: 'success_rate', sort_order: 'desc' } ,
  {
    id: 'webhook_workflows',
    name: 'Webhooks',
    description: 'Workflows acionados por webhook',
    filters: { trigger_type: 'webhook' } ];

/**
 * Componente de filtros para workflows
 * Permite filtrar por status, tipo de trigger, datas e outros critérios
 */
const WorkflowsFilters: React.FC<WorkflowsFiltersProps> = ({ filters,
  onFiltersChange,
  onClearFilters,
  className,
  showAdvancedFilters = true,
  showPresets = true,
  showSortOptions = true
   }) => {
  // Estados locais
  const [localFilters, setLocalFilters] = useState<WorkflowFilters>(filters);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  // Sincronizar com props
  useEffect(() => {
    setLocalFilters(filters);

  }, [filters]);

  // Handlers
  const handleFilterChange = (key: keyof WorkflowFilters, value: Record<string, any>) => {
    const newFilters = { ...localFilters, [key]: value};

    setLocalFilters(newFilters);

    onFiltersChange(newFilters);};

  const handleClearFilters = () => {
    setLocalFilters({});

    setDateRange({});

    onClearFilters();};

  const handlePresetSelect = (preset: typeof FILTER_PRESETS[0]) => {
    setLocalFilters(preset.filters);

    onFiltersChange(preset.filters);};

  const handleDateRangeChange = (from?: Date, to?: Date) => {
    setDateRange({ from, to });

    const newFilters = {
      ...localFilters,
      created_after: from ? format(from, 'yyyy-MM-dd') : undefined,
      created_before: to ? format(to, 'yyyy-MM-dd') : undefined};

    setLocalFilters(newFilters);

    onFiltersChange(newFilters);};

  // Contar filtros ativos
  const activeFiltersCount = Object.values(localFilters).filter(value => 
    value !== undefined && value !== '' && value !== null
  ).length;

  return (
        <>
      <Card className={className } />
      <Card.Header className="pb-4" />
        <div className=" ">$2</div><Card.Title className="flex items-center gap-2" />
            <Filter className="h-5 w-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2" />
                {activeFiltersCount}
              </Badge>
            )}
          </Card.Title>
          
          <div className="{showAdvancedFilters && (">$2</div>
              <Button
                variant="outline"
                size="sm"
                onClick={ () => setShowAdvanced(!showAdvanced) }
                className="gap-2"
              >
                <ChevronDown className={cn('h-4 w-4 transition-transform', showAdvanced && 'rotate-180')} / />
                Avançado
              </Button>
            )}
            
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={ handleClearFilters }
                className="gap-2" />
                <RotateCcw className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
      </Card.Header>

      <Card.Content className="space-y-4" />
        {/* Filtros Básicos */}
        <div className="{/* Busca */}">$2</div>
          <div className=" ">$2</div><label className="text-sm font-medium">Buscar</label>
            <div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nome ou descrição..."
                value={ localFilters.search || '' }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('search', e.target.value) }
                className="pl-10" />
            </div>

          {/* Status */}
          <div className=" ">$2</div><label className="text-sm font-medium">Status</label>
            <Select
              value={ localFilters.status || '' }
              onChange={ (value: unknown) => handleFilterChange('status', value || undefined)  }>
              <SelectTrigger />
                <SelectValue placeholder="Selecionar status" / /></SelectTrigger><SelectContent />
                {(STATUS_OPTIONS || []).map((option: unknown) => (
                  <SelectItem key={option.value} value={ option.value } />
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent></Select></div>

          {/* Tipo de Trigger */}
          <div className=" ">$2</div><label className="text-sm font-medium">Tipo de Trigger</label>
            <Select
              value={ localFilters.trigger_type || '' }
              onChange={ (value: unknown) => handleFilterChange('trigger_type', value || undefined)  }>
              <SelectTrigger />
                <SelectValue placeholder="Selecionar tipo" / /></SelectTrigger><SelectContent />
                {(TRIGGER_TYPE_OPTIONS || []).map((option: unknown) => (
                  <SelectItem key={option.value} value={ option.value } />
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent></Select></div>

          {/* Ordenação */}
          {showSortOptions && (
            <div className=" ">$2</div><label className="text-sm font-medium">Ordenar por</label>
              <div className=" ">$2</div><Select
                  value={ localFilters.sort_by || 'created_at' }
                  onChange={ (value: unknown) => handleFilterChange('sort_by', value)  }>
                  <SelectTrigger className="flex-1" />
                    <SelectValue / /></SelectTrigger><SelectContent />
                    {(SORT_OPTIONS || []).map((option: unknown) => (
                      <SelectItem key={option.value} value={ option.value } />
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent></Select><Select
                  value={ localFilters.sort_order || 'desc' }
                  onChange={ (value: unknown) => handleFilterChange('sort_order', value as 'asc' | 'desc')  }>
                  <SelectTrigger className="w-20" />
                    <SelectValue / /></SelectTrigger><SelectContent />
                    {(SORT_ORDER_OPTIONS || []).map((option: unknown) => (
                      <SelectItem key={option.value} value={ option.value } />
                        {option.label === 'Crescente' ? '↑' : '↓'}
                      </SelectItem>
                    ))}
                  </SelectContent></Select></div>
          )}
        </div>

        {/* Filtros Avançados */}
        <Animated}
          className="overflow-hidden" />
          <div className="{/* Filtro de Data */}">$2</div>
            <div className=" ">$2</div><label className="text-sm font-medium">Período de Criação</label>
              <Popover />
                <PopoverTrigger asChild />
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateRange.from && 'text-muted-foreground'
                    ) } />
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} -{' '}
                          {format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
                        </>
                      ) : (
                        format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
                      )
                    ) : (
                      'Selecionar período'
                    )}
                  </Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start" />
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={ dateRange.from }
                    selected={ dateRange }
                    onSelect={ (range: unknown) => handleDateRangeChange(range?.from, range?.to) }
                    numberOfMonths={ 2 }
                    locale={ ptBR } /></PopoverContent></Popover>
            </div>

            {/* Filtros Adicionais */}
            <div className=" ">$2</div><label className="text-sm font-medium">Filtros Rápidos</label>
              <div className=" ">$2</div><Button
                  variant="outline"
                  size="sm"
                  onClick={ () => handleFilterChange('status', 'active') }
                  className={cn(
                    localFilters.status === 'active' && 'bg-primary text-primary-foreground'
                  )  }>
                  Apenas Ativos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={ () => handleFilterChange('status', 'draft') }
                  className={cn(
                    localFilters.status === 'draft' && 'bg-primary text-primary-foreground'
                  )  }>
                  Apenas Rascunhos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

                    handleDateRangeChange(lastWeek, new Date());

                  } >
                  Última Semana
                </Button></div></div>
        </Animated>

        {/* Presets de Filtros */}
        {showPresets && (
          <div className=" ">$2</div><label className="text-sm font-medium flex items-center gap-2" />
              <Bookmark className="h-4 w-4" />
              Filtros Salvos
            </label>
            <div className="{(FILTER_PRESETS || []).map((preset: unknown) => (">$2</div>
                <Button
                  key={ preset.id }
                  variant="outline"
                  size="sm"
                  onClick={ () => handlePresetSelect(preset) }
                  className="gap-2"
                >
                  <Save className="h-3 w-3" />
                  {preset.name}
                </Button>
              ))}
            </div>
        )}

        {/* Filtros Ativos */}
        {activeFiltersCount > 0 && (
          <div className=" ">$2</div><label className="text-sm font-medium">Filtros Ativos</label>
            <div className="{Object.entries(localFilters).map(([key, value]) => {">$2</div>
                if (!value || value === '') return null;
                
                const getLabel = (k: string, v: Record<string, any>) => {
                  switch (k) {
                    case 'status':
                      return STATUS_OPTIONS.find(opt => opt.value === v)?.label || v;
                    case 'trigger_type':
                      return TRIGGER_TYPE_OPTIONS.find(opt => opt.value === v)?.label || v;
                    case 'sort_by':
                      return SORT_OPTIONS.find(opt => opt.value === v)?.label || v;
                    case 'search':
                      return `Busca: "${v}"`;
                    case 'created_after':
                      return `Após: ${format(new Date(v), 'dd/MM/yyyy', { locale: ptBR })}`;
                    case 'created_before':
                      return `Antes: ${format(new Date(v), 'dd/MM/yyyy', { locale: ptBR })}`;
                    default:
                      return `${k}: ${v}`;
                  } ;

                return (
                          <Badge
                    key={ key }
                    variant="secondary"
                    className="gap-1 pr-1" />
                    {getLabel(key, value)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={ () => handleFilterChange(key as keyof WorkflowFilters, undefined)  }>
                      <X className="h-3 w-3" /></Button></Badge>);

              })}
            </div>
        )}
      </Card.Content>
    </Card>);};

export default WorkflowsFilters;
