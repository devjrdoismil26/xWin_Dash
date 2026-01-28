// ========================================
// COMPONENTE FILTROS - ANALYTICS
// ========================================
// Componente para filtros avançados de analytics

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import { cn } from '@/lib/utils';
import { 
  Filter, 
  Calendar, 
  Users, 
  Monitor, 
  Globe, 
  Target,
  X,
  Search,
  RefreshCw
} from 'lucide-react';
import { AnalyticsFilters as AnalyticsFiltersType } from '../types';

interface AnalyticsFiltersProps {
  filters: AnalyticsFiltersType;
  onFiltersChange: (filters: AnalyticsFiltersType) => void;
  onClearFilters?: () => void;
  onApplyFilters?: () => void;
  loading?: boolean;
  className?: string;
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
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
    { value: 'desktop', label: 'Desktop' },
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

  const handleFilterChange = (key: keyof AnalyticsFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayFilterChange = (key: keyof AnalyticsFiltersType, value: string, checked: boolean) => {
    const currentArray = (localFilters[key] as string[]) || [];
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    handleFilterChange(key, newArray);
  };

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
      custom_filters: {}
    };
    
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    onClearFilters?.();
  };

  const handleApplyFilters = () => {
    onApplyFilters?.();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.metrics && localFilters.metrics.length > 0) count++;
    if (localFilters.devices && localFilters.devices.length > 0) count++;
    if (localFilters.traffic_sources && localFilters.traffic_sources.length > 0) count++;
    if (localFilters.countries && localFilters.countries.length > 0) count++;
    if (localFilters.start_date || localFilters.end_date) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={cn("", className)}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </Card.Title>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Recolher' : 'Expandir'}
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearFilters}
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleApplyFilters}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Search className="h-4 w-4 mr-1" />
              )}
              Aplicar
            </Button>
          </div>
        </div>
      </Card.Header>

      <Card.Content className="space-y-6">
        {/* Filtros Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="date-range">Período</Label>
            <Select
              value={localFilters.date_range}
              onValueChange={(value) => handleFilterChange('date_range', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="report-type">Tipo de Relatório</Label>
            <Select
              value={localFilters.report_type}
              onValueChange={(value) => handleFilterChange('report_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {reportTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {localFilters.date_range === 'custom' && (
            <div>
              <Label htmlFor="custom-date">Data Personalizada</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={localFilters.start_date || ''}
                  onChange={(e) => handleFilterChange('start_date', e.target.value)}
                  placeholder="Data inicial"
                />
                <Input
                  type="date"
                  value={localFilters.end_date || ''}
                  onChange={(e) => handleFilterChange('end_date', e.target.value)}
                  placeholder="Data final"
                />
              </div>
            </div>
          )}
        </div>

        {/* Filtros Expandidos */}
        {isExpanded && (
          <div className="space-y-6 border-t pt-6">
            {/* Métricas */}
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4" />
                Métricas
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {metricsOptions.map((metric) => (
                  <div key={metric.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`metric-${metric.value}`}
                      checked={localFilters.metrics?.includes(metric.value) || false}
                      onCheckedChange={(checked) => 
                        handleArrayFilterChange('metrics', metric.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`metric-${metric.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {metric.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispositivos */}
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Monitor className="h-4 w-4" />
                Dispositivos
              </Label>
              <div className="flex gap-4">
                {deviceOptions.map((device) => (
                  <div key={device.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`device-${device.value}`}
                      checked={localFilters.devices?.includes(device.value) || false}
                      onCheckedChange={(checked) => 
                        handleArrayFilterChange('devices', device.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`device-${device.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {device.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Fontes de Tráfego */}
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4" />
                Fontes de Tráfego
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {trafficSourceOptions.map((source) => (
                  <div key={source.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`source-${source.value}`}
                      checked={localFilters.traffic_sources?.includes(source.value) || false}
                      onCheckedChange={(checked) => 
                        handleArrayFilterChange('traffic_sources', source.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`source-${source.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {source.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Países */}
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4" />
                Países
              </Label>
              <div className="flex gap-4">
                {countryOptions.map((country) => (
                  <div key={country.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`country-${country.value}`}
                      checked={localFilters.countries?.includes(country.value) || false}
                      onCheckedChange={(checked) => 
                        handleArrayFilterChange('countries', country.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`country-${country.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {country.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filtros Ativos */}
        {activeFiltersCount > 0 && (
          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-2">Filtros Ativos</Label>
            <div className="flex flex-wrap gap-2">
              {localFilters.metrics && localFilters.metrics.length > 0 && (
                <Badge variant="secondary">
                  {localFilters.metrics.length} métrica(s)
                </Badge>
              )}
              {localFilters.devices && localFilters.devices.length > 0 && (
                <Badge variant="secondary">
                  {localFilters.devices.length} dispositivo(s)
                </Badge>
              )}
              {localFilters.traffic_sources && localFilters.traffic_sources.length > 0 && (
                <Badge variant="secondary">
                  {localFilters.traffic_sources.length} fonte(s)
                </Badge>
              )}
              {localFilters.countries && localFilters.countries.length > 0 && (
                <Badge variant="secondary">
                  {localFilters.countries.length} país(es)
                </Badge>
              )}
              {(localFilters.start_date || localFilters.end_date) && (
                <Badge variant="secondary">
                  Período personalizado
                </Badge>
              )}
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default AnalyticsFilters;