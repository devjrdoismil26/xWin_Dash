/**
 * Filtros avançados de Analytics
 *
 * @description
 * Componente completo para filtros de analytics com suporte a períodos,
 * dispositivos, localizações, público-alvo e múltiplos critérios.
 * Permite salvar filtros e aplicá-los dinamicamente.
 *
 * @module modules/Analytics/components/AnalyticsFilters
 * @since 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/Select';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { cn } from '@/lib/utils';
import { Filter, Calendar, Users, Monitor, Globe, Target, X, Search, RefreshCw } from 'lucide-react';
import { AnalyticsFilters as AnalyticsFiltersType } from '../types';

/**
 * Props do componente AnalyticsFilters
 *
 * @interface AnalyticsFiltersProps
 * @property {AnalyticsFiltersType} filters - Objeto com filtros atuais
 * @property {(filters: AnalyticsFiltersType) => void} onFiltersChange - Callback quando filtros mudam
 * @property {() => void} [onClearFilters] - Callback para limpar filtros
 * @property {() => void} [onApplyFilters] - Callback para aplicar filtros
 * @property {boolean} [loading] - Se está carregando dados
 * @property {string} [className] - Classes CSS adicionais
 */
interface AnalyticsFiltersProps {
  filters: AnalyticsFiltersType;
  onFiltersChange?: (e: any) => void;
  onClearFilters???: (e: any) => void;
  onApplyFilters???: (e: any) => void;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente AnalyticsFilters
 *
 * @description
 * Renderiza painel de filtros expandível/colapsável com múltiplas opções:
 * período de datas, dispositivos, localizações, público-alvo e busca.
 * Exibe badges com filtros ativos e permite limpar todos.
 *
 * @param {AnalyticsFiltersProps} props - Props do componente
 * @returns {JSX.Element} Painel de filtros
 *
 * @example
 * ```tsx
 * <AnalyticsFilters
 *   filters={ currentFilters }
 *   onFiltersChange={ (filters: unknown) => updateFilters(filters) }
 *   onApplyFilters={ () => refreshData() }
 * />
 * ```
 */
export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({ filters,
  onFiltersChange,
  onClearFilters,
  onApplyFilters,
  loading = false,
  className
   }) => {
  const [localFilters, setLocalFilters] = useState<AnalyticsFiltersType>(filters);

  const [isExpanded, setIsExpanded] = useState(false);

  // Opções de filtros
  const dateRangeOptions = [
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: '7days', label: 'Últimos 7 dias' },
    { value: '30days', label: 'Últimos 30 dias' },
    { value: '90days', label: 'Últimos 90 dias' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const reportTypeOptions = [
    { value: 'overview', label: 'Visão Geral' },
    { value: 'traffic', label: 'Tráfego' },
    { value: 'conversions', label: 'Conversões' },
    { value: 'audience', label: 'Audiência' },
    { value: 'behavior', label: 'Comportamento' },
    { value: 'acquisition', label: 'Aquisição' }
  ];

  const metricsOptions = [
    { value: 'page_views', label: 'Visualizações de Página' },
    { value: 'unique_visitors', label: 'Visitantes Únicos' },
    { value: 'sessions', label: 'Sessões' },
    { value: 'bounce_rate', label: 'Taxa de Rejeição' },
    { value: 'avg_session_duration', label: 'Duração Média da Sessão' },
    { value: 'conversion_rate', label: 'Taxa de Conversão' },
    { value: 'revenue', label: 'Receita' },
    { value: 'transactions', label: 'Transações' }
  ];

  const deviceOptions = [
    { value: 'desktop', label: 'Monitor' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'tablet', label: 'Tablet' }
  ];

  const trafficSourceOptions = [
    { value: 'organic', label: 'Orgânico' },
    { value: 'direct', label: 'Direto' },
    { value: 'social', label: 'Social' },
    { value: 'email', label: 'Email' },
    { value: 'paid', label: 'Pago' },
    { value: 'referral', label: 'Referência' }
  ];

  const countryOptions = [
    { value: 'BR', label: 'Brasil' },
    { value: 'US', label: 'Estados Unidos' },
    { value: 'AR', label: 'Argentina' },
    { value: 'MX', label: 'México' },
    { value: 'CO', label: 'Colômbia' }
  ];

  useEffect(() => {
    setLocalFilters(filters);

  }, [filters]);

  const handleFilterChange = (key: keyof AnalyticsFiltersType, value: unknown) => {
    const newFilters = { ...localFilters, [key]: value};

    setLocalFilters(newFilters);

    onFiltersChange(newFilters);};

  const handleArrayFilterChange = (key: keyof AnalyticsFiltersType, value: string, checked: boolean) => {
    const currentArray = (localFilters[key] as string[]) || [];
    const newArray = checked 
      ? [...currentArray, value]
      : (currentArray || []).filter(item => item !== value);

    handleFilterChange(key, newArray);};

  const handleClearFilters = () => {
    const defaultFilters: AnalyticsFiltersType = {
      date_range: '30days',
      report_type: 'overview',
      start_date: undefined,
      end_date: undefined,
      metrics: [],
      devices: [],
      traffic_sources: [],
      countries: [],
      custom_filters: {} ;

    setLocalFilters(defaultFilters);

    onFiltersChange(defaultFilters);

    onClearFilters?.();};

  const handleApplyFilters = () => {
    onApplyFilters?.();};

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.metrics && localFilters.metrics.length > 0) count++;
    if (localFilters.devices && localFilters.devices.length > 0) count++;
    if (localFilters.traffic_sources && localFilters.traffic_sources.length > 0) count++;
    if (localFilters.countries && localFilters.countries.length > 0) count++;
    if (localFilters.start_date || localFilters.end_date) count++;
    return count;};

  const activeFiltersCount = getActiveFiltersCount();

  return (
        <>
      <Card className={cn("", className) } />
      <Card.Header />
        <div className=" ">$2</div><Card.Title className="flex items-center gap-2" />
            <Filter className="h-5 w-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </Card.Title>
          <div className=" ">$2</div><Button
              size="sm"
              variant="outline"
              onClick={ () => setIsExpanded(!isExpanded)  }>
              {isExpanded ? 'Recolher' : 'Expandir'}
            </Button>
            { activeFiltersCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearFilters } />
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              size="sm"
              onClick={ handleApplyFilters }
              disabled={ loading } />
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Search className="h-4 w-4 mr-1" />
              )}
              Aplicar
            </Button></div></Card.Header>

      <Card.Content className="space-y-6" />
        {/* Filtros Básicos */}
        <div className=" ">$2</div><div>
           
        </div><Label htmlFor="date-range">Período</Label>
            <Select
              value={ localFilters.date_range }
              onValueChange={ (value: unknown) => handleFilterChange('date_range', value)  }>
              <SelectTrigger />
                <SelectValue placeholder="Selecione o período" / /></SelectTrigger><SelectContent />
                {(dateRangeOptions || []).map((option: unknown) => (
                  <SelectItem key={option.value} value={ option.value } />
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent></Select></div>

          <div>
           
        </div><Label htmlFor="report-type">Tipo de Relatório</Label>
            <Select
              value={ localFilters.report_type }
              onValueChange={ (value: unknown) => handleFilterChange('report_type', value)  }>
              <SelectTrigger />
                <SelectValue placeholder="Selecione o tipo" / /></SelectTrigger><SelectContent />
                {(reportTypeOptions || []).map((option: unknown) => (
                  <SelectItem key={option.value} value={ option.value } />
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent></Select></div>

          {localFilters.date_range === 'custom' && (
            <div>
           
        </div><Label htmlFor="custom-date">Data Personalizada</Label>
              <div className=" ">$2</div><Input
                  type="date"
                  value={ localFilters.start_date || '' }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('start_date', e.target.value) }
                  placeholder="Data inicial" />
                <Input
                  type="date"
                  value={ localFilters.end_date || '' }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('end_date', e.target.value) }
                  placeholder="Data final" />
              </div>
          )}
        </div>

        {/* Filtros Expandidos */}
        {isExpanded && (
          <div className="{/* Métricas */}">$2</div>
            <div>
           
        </div><Label className="flex items-center gap-2 mb-3" />
                <Target className="h-4 w-4" />
                Métricas
              </Label>
              <div className="{(metricsOptions || []).map((metric: unknown) => (">$2</div>
                  <div key={metric.value} className="flex items-center space-x-2">
           
        </div><Checkbox
                      id={`metric-${metric.value}`}
                      checked={ localFilters.metrics?.includes(metric.value) || false }
                      onCheckedChange={ (checked: unknown) = />
                        handleArrayFilterChange('metrics', metric.value, checked as boolean)
   } />
                    <Label
                      htmlFor={`metric-${metric.value}`}
                      className="text-sm font-normal cursor-pointer" />
                      {metric.label}
                    </Label>
      </div>
    </>
  ))}
              </div>

            {/* Dispositivos */}
            <div>
           
        </div><Label className="flex items-center gap-2 mb-3" />
                <Monitor className="h-4 w-4" />
                Dispositivos
              </Label>
              <div className="{(deviceOptions || []).map((device: unknown) => (">$2</div>
                  <div key={device.value} className="flex items-center space-x-2">
           
        </div><Checkbox
                      id={`device-${device.value}`}
                      checked={ localFilters.devices?.includes(device.value) || false }
                      onCheckedChange={ (checked: unknown) = />
                        handleArrayFilterChange('devices', device.value, checked as boolean)
   } />
                    <Label
                      htmlFor={`device-${device.value}`}
                      className="text-sm font-normal cursor-pointer" />
                      {device.label}
                    </Label>
      </div>
    </>
  ))}
              </div>

            {/* Fontes de Tráfego */}
            <div>
           
        </div><Label className="flex items-center gap-2 mb-3" />
                <Globe className="h-4 w-4" />
                Fontes de Tráfego
              </Label>
              <div className="{(trafficSourceOptions || []).map((source: unknown) => (">$2</div>
                  <div key={source.value} className="flex items-center space-x-2">
           
        </div><Checkbox
                      id={`source-${source.value}`}
                      checked={ localFilters.traffic_sources?.includes(source.value) || false }
                      onCheckedChange={ (checked: unknown) = />
                        handleArrayFilterChange('traffic_sources', source.value, checked as boolean)
   } />
                    <Label
                      htmlFor={`source-${source.value}`}
                      className="text-sm font-normal cursor-pointer" />
                      {source.label}
                    </Label>
      </div>
    </>
  ))}
              </div>

            {/* Países */}
            <div>
           
        </div><Label className="flex items-center gap-2 mb-3" />
                <Users className="h-4 w-4" />
                Países
              </Label>
              <div className="{(countryOptions || []).map((country: unknown) => (">$2</div>
                  <div key={country.value} className="flex items-center space-x-2">
           
        </div><Checkbox
                      id={`country-${country.value}`}
                      checked={ localFilters.countries?.includes(country.value) || false }
                      onCheckedChange={ (checked: unknown) = />
                        handleArrayFilterChange('countries', country.value, checked as boolean)
   } />
                    <Label
                      htmlFor={`country-${country.value}`}
                      className="text-sm font-normal cursor-pointer" />
                      {country.label}
                    </Label>
      </div>
    </>
  ))}
              </div>
    </div>
  )}

        {/* Filtros Ativos */}
        {activeFiltersCount > 0 && (
          <div className=" ">$2</div><Label className="text-sm font-medium mb-2">Filtros Ativos</Label>
            <div className="{localFilters.metrics && localFilters.metrics.length > 0 && (">$2</div>
                <Badge variant="secondary" />
                  {localFilters.metrics.length} métrica(s)
                </Badge>
              )}
              {localFilters.devices && localFilters.devices.length > 0 && (
                <Badge variant="secondary" />
                  {localFilters.devices.length} dispositivo(s)
                </Badge>
              )}
              {localFilters.traffic_sources && localFilters.traffic_sources.length > 0 && (
                <Badge variant="secondary" />
                  {localFilters.traffic_sources.length} fonte(s)
                </Badge>
              )}
              {localFilters.countries && localFilters.countries.length > 0 && (
                <Badge variant="secondary" />
                  {localFilters.countries.length} país(es)
                </Badge>
              )}
              {(localFilters.start_date || localFilters.end_date) && (
                <Badge variant="secondary" />
                  Período personalizado
                </Badge>
              )}
            </div>
        )}
      </Card.Content>
    </Card>);};

export default AnalyticsFilters;