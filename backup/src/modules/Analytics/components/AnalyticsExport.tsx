// ========================================
// COMPONENTE EXPORTAÇÃO - ANALYTICS
// ========================================
// Componente para exportação de dados de analytics

import React, { useState } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Share2
} from 'lucide-react';

interface ExportOptions {
  format: 'json' | 'csv' | 'excel' | 'pdf';
  includeCharts: boolean;
  includeRawData: boolean;
  includeSummary: boolean;
  dateRange: string;
  customDateRange?: {
    start: string;
    end: string;
  };
  filters: string[];
  emailNotification: boolean;
  emailAddress?: string;
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
  };
}

interface AnalyticsExportProps {
  data?: any;
  loading?: boolean;
  error?: string | null;
  onExport?: (options: ExportOptions) => void;
  onScheduleExport?: (options: ExportOptions) => void;
  onShareExport?: (exportId: string) => void;
  className?: string;
}

export const AnalyticsExport: React.FC<AnalyticsExportProps> = ({
  data,
  loading = false,
  error = null,
  onExport,
  onScheduleExport,
  onShareExport,
  className
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeCharts: true,
    includeRawData: false,
    includeSummary: true,
    dateRange: '30days',
    filters: [],
    emailNotification: false,
    emailAddress: '',
    schedule: {
      enabled: false,
      frequency: 'weekly',
      time: '09:00'
    }
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([
    {
      id: '1',
      name: 'Relatório Mensal - Janeiro 2024',
      format: 'pdf',
      size: '2.3 MB',
      status: 'completed',
      createdAt: '2024-01-15T10:30:00Z',
      downloadUrl: '#'
    },
    {
      id: '2',
      name: 'Dados de Tráfego - CSV',
      format: 'csv',
      size: '1.8 MB',
      status: 'completed',
      createdAt: '2024-01-14T15:45:00Z',
      downloadUrl: '#'
    },
    {
      id: '3',
      name: 'Análise Completa - Excel',
      format: 'excel',
      size: '4.1 MB',
      status: 'processing',
      createdAt: '2024-01-15T11:20:00Z',
      downloadUrl: null
    }
  ]);

  const formatOptions = [
    { value: 'json', label: 'JSON', icon: FileText, description: 'Dados estruturados' },
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Planilha simples' },
    { value: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Planilha avançada' },
    { value: 'pdf', label: 'PDF', icon: FileImage, description: 'Relatório visual' }
  ];

  const dateRangeOptions = [
    { value: '7days', label: 'Últimos 7 dias' },
    { value: '30days', label: 'Últimos 30 dias' },
    { value: '90days', label: 'Últimos 90 dias' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const scheduleFrequencyOptions = [
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport?.(exportOptions);
      // Simular delay de exportação
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Erro na exportação:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleScheduleExport = () => {
    onScheduleExport?.(exportOptions);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'processing':
        return 'Processando';
      case 'failed':
        return 'Falhou';
      default:
        return 'Pendente';
    }
  };

  const getFormatIcon = (format: string) => {
    const formatOption = formatOptions.find(f => f.value === format);
    return formatOption ? formatOption.icon : FileText;
  };

  return (
    <Card className={cn("", className)}>
      <Card.Header>
        <Card.Title className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Dados
        </Card.Title>
      </Card.Header>

      <Card.Content className="space-y-6">
        {/* Opções de Exportação */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="export-format">Formato de Exportação</Label>
            <Select
              value={exportOptions.format}
              onValueChange={(value: any) => setExportOptions({...exportOptions, format: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date-range">Período</Label>
            <Select
              value={exportOptions.dateRange}
              onValueChange={(value) => setExportOptions({...exportOptions, dateRange: value})}
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

          {exportOptions.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Data Inicial</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={exportOptions.customDateRange?.start || ''}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    customDateRange: {
                      ...exportOptions.customDateRange,
                      start: e.target.value
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="end-date">Data Final</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={exportOptions.customDateRange?.end || ''}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    customDateRange: {
                      ...exportOptions.customDateRange,
                      end: e.target.value
                    }
                  })}
                />
              </div>
            </div>
          )}

          <div>
            <Label className="mb-3 block">Conteúdo a Incluir</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-charts"
                  checked={exportOptions.includeCharts}
                  onCheckedChange={(checked) => setExportOptions({...exportOptions, includeCharts: checked as boolean})}
                />
                <Label htmlFor="include-charts" className="cursor-pointer">
                  Gráficos e visualizações
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-summary"
                  checked={exportOptions.includeSummary}
                  onCheckedChange={(checked) => setExportOptions({...exportOptions, includeSummary: checked as boolean})}
                />
                <Label htmlFor="include-summary" className="cursor-pointer">
                  Resumo executivo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-raw-data"
                  checked={exportOptions.includeRawData}
                  onCheckedChange={(checked) => setExportOptions({...exportOptions, includeRawData: checked as boolean})}
                />
                <Label htmlFor="include-raw-data" className="cursor-pointer">
                  Dados brutos
                </Label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="email-notification"
                checked={exportOptions.emailNotification}
                onCheckedChange={(checked) => setExportOptions({...exportOptions, emailNotification: checked as boolean})}
              />
              <Label htmlFor="email-notification" className="cursor-pointer">
                Receber por email quando concluído
              </Label>
            </div>
            
            {exportOptions.emailNotification && (
              <div>
                <Label htmlFor="email-address">Email</Label>
                <Input
                  id="email-address"
                  type="email"
                  value={exportOptions.emailAddress || ''}
                  onChange={(e) => setExportOptions({...exportOptions, emailAddress: e.target.value})}
                  placeholder="seu@email.com"
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="schedule-export"
                checked={exportOptions.schedule?.enabled || false}
                onCheckedChange={(checked) => setExportOptions({
                  ...exportOptions,
                  schedule: {
                    ...exportOptions.schedule!,
                    enabled: checked as boolean
                  }
                })}
              />
              <Label htmlFor="schedule-export" className="cursor-pointer">
                Agendar exportação automática
              </Label>
            </div>
            
            {exportOptions.schedule?.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schedule-frequency">Frequência</Label>
                  <Select
                    value={exportOptions.schedule?.frequency || 'weekly'}
                    onValueChange={(value: any) => setExportOptions({
                      ...exportOptions,
                      schedule: {
                        ...exportOptions.schedule!,
                        frequency: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      {scheduleFrequencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="schedule-time">Horário</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={exportOptions.schedule?.time || '09:00'}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      schedule: {
                        ...exportOptions.schedule!,
                        time: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3">
          <Button
            onClick={handleExport}
            disabled={isExporting || loading}
            className="flex-1"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar Agora
              </>
            )}
          </Button>
          
          {exportOptions.schedule?.enabled && (
            <Button
              variant="outline"
              onClick={handleScheduleExport}
              disabled={loading}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agendar
            </Button>
          )}
        </div>

        {/* Histórico de Exportações */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Histórico de Exportações</h3>
          
          <div className="space-y-3">
            {exportHistory.map((exportItem) => {
              const FormatIcon = getFormatIcon(exportItem.format);
              return (
                <div key={exportItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FormatIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">{exportItem.name}</div>
                      <div className="text-sm text-gray-600">
                        {formatDate(exportItem.createdAt)} • {exportItem.size}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(exportItem.status)}
                      <span className="text-sm">{getStatusText(exportItem.status)}</span>
                    </div>
                    
                    {exportItem.status === 'completed' && exportItem.downloadUrl && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Baixar
                      </Button>
                    )}
                    
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Erro na exportação</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default AnalyticsExport;