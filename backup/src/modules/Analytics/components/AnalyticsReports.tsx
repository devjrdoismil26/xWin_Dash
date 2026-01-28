// ========================================
// COMPONENTE RELATÓRIOS - ANALYTICS
// ========================================
// Componente para gerenciamento de relatórios de analytics

import React, { useState } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Plus, 
  Download, 
  Share2, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  User,
  Eye,
  MoreHorizontal,
  Filter,
  BarChart3
} from 'lucide-react';
import { AnalyticsReport } from '../types';

interface AnalyticsReportsProps {
  reports?: AnalyticsReport[];
  loading?: boolean;
  error?: string | null;
  onCreateReport?: (reportData: Partial<AnalyticsReport>) => void;
  onEditReport?: (reportId: string, reportData: Partial<AnalyticsReport>) => void;
  onDeleteReport?: (reportId: string) => void;
  onExportReport?: (reportId: string, format: string) => void;
  onShareReport?: (reportId: string) => void;
  onViewReport?: (reportId: string) => void;
  className?: string;
}

export const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({
  reports = [],
  loading = false,
  error = null,
  onCreateReport,
  onEditReport,
  onDeleteReport,
  onExportReport,
  onShareReport,
  onViewReport,
  className
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReport, setEditingReport] = useState<string | null>(null);
  const [newReport, setNewReport] = useState({
    name: '',
    description: '',
    type: 'custom',
    metrics: [] as string[],
    filters: {
      date_range: '30days',
      report_type: 'overview'
    },
    schedule: null as string | null,
    is_public: false
  });

  // Mock data para demonstração
  const mockReports: AnalyticsReport[] = [
    {
      id: '1',
      name: 'Relatório Semanal de Vendas',
      type: 'custom',
      description: 'Análise semanal de vendas e conversões',
      filters: {
        date_range: '7days',
        report_type: 'conversions',
        metrics: ['conversion_rate', 'revenue', 'transactions']
      },
      data: {},
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      created_by: 'user1',
      is_public: false
    },
    {
      id: '2',
      name: 'Dashboard de Tráfego',
      type: 'standard',
      description: 'Visão geral do tráfego do site',
      filters: {
        date_range: '30days',
        report_type: 'traffic',
        metrics: ['page_views', 'unique_visitors', 'sessions']
      },
      data: {},
      created_at: '2024-01-14T15:30:00Z',
      updated_at: '2024-01-14T15:30:00Z',
      created_by: 'user2',
      is_public: true
    },
    {
      id: '3',
      name: 'Análise de Audiência',
      type: 'custom',
      description: 'Comportamento e características da audiência',
      filters: {
        date_range: '90days',
        report_type: 'audience',
        metrics: ['bounce_rate', 'avg_session_duration']
      },
      data: {},
      created_at: '2024-01-13T09:15:00Z',
      updated_at: '2024-01-13T09:15:00Z',
      created_by: 'user1',
      is_public: false
    }
  ];

  const displayReports = reports.length > 0 ? reports : mockReports;

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

  const reportTypeOptions = [
    { value: 'custom', label: 'Personalizado' },
    { value: 'standard', label: 'Padrão' },
    { value: 'scheduled', label: 'Agendado' }
  ];

  const dateRangeOptions = [
    { value: '7days', label: 'Últimos 7 dias' },
    { value: '30days', label: 'Últimos 30 dias' },
    { value: '90days', label: 'Últimos 90 dias' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const handleCreateReport = () => {
    if (newReport.name.trim()) {
      onCreateReport?.(newReport);
      setNewReport({
        name: '',
        description: '',
        type: 'custom',
        metrics: [],
        filters: {
          date_range: '30days',
          report_type: 'overview'
        },
        schedule: null,
        is_public: false
      });
      setShowCreateForm(false);
    }
  };

  const handleEditReport = (reportId: string) => {
    const report = displayReports.find(r => r.id === reportId);
    if (report) {
      setNewReport({
        name: report.name,
        description: report.description || '',
        type: report.type,
        metrics: report.filters.metrics || [],
        filters: report.filters,
        schedule: null,
        is_public: report.is_public
      });
      setEditingReport(reportId);
      setShowCreateForm(true);
    }
  };

  const handleUpdateReport = () => {
    if (editingReport && newReport.name.trim()) {
      onEditReport?.(editingReport, newReport);
      setEditingReport(null);
      setShowCreateForm(false);
    }
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

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'custom':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'standard':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className={cn("", className)}>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Carregando relatórios...</span>
          </div>
        </Card.Content>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("", className)}>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios
            <Badge variant="secondary">{displayReports.length}</Badge>
          </Card.Title>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Relatório
          </Button>
        </div>
      </Card.Header>

      <Card.Content className="space-y-6">
        {/* Formulário de Criação/Edição */}
        {showCreateForm && (
          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">
              {editingReport ? 'Editar Relatório' : 'Criar Novo Relatório'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="report-name">Nome do Relatório</Label>
                <Input
                  id="report-name"
                  value={newReport.name}
                  onChange={(e) => setNewReport({...newReport, name: e.target.value})}
                  placeholder="Ex: Relatório Mensal de Vendas"
                />
              </div>

              <div>
                <Label htmlFor="report-type">Tipo</Label>
                <Select
                  value={newReport.type}
                  onValueChange={(value) => setNewReport({...newReport, type: value})}
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

              <div className="md:col-span-2">
                <Label htmlFor="report-description">Descrição</Label>
                <Textarea
                  id="report-description"
                  value={newReport.description}
                  onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                  placeholder="Descreva o propósito do relatório..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="date-range">Período</Label>
                <Select
                  value={newReport.filters.date_range}
                  onValueChange={(value) => setNewReport({
                    ...newReport,
                    filters: {...newReport.filters, date_range: value}
                  })}
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
                <Label htmlFor="report-type-filter">Tipo de Relatório</Label>
                <Select
                  value={newReport.filters.report_type}
                  onValueChange={(value) => setNewReport({
                    ...newReport,
                    filters: {...newReport.filters, report_type: value}
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Visão Geral</SelectItem>
                    <SelectItem value="traffic">Tráfego</SelectItem>
                    <SelectItem value="conversions">Conversões</SelectItem>
                    <SelectItem value="audience">Audiência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label className="mb-3 block">Métricas</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {metricsOptions.map((metric) => (
                    <div key={metric.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`metric-${metric.value}`}
                        checked={newReport.metrics.includes(metric.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewReport({
                              ...newReport,
                              metrics: [...newReport.metrics, metric.value]
                            });
                          } else {
                            setNewReport({
                              ...newReport,
                              metrics: newReport.metrics.filter(m => m !== metric.value)
                            });
                          }
                        }}
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

              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-public"
                    checked={newReport.is_public}
                    onCheckedChange={(checked) => setNewReport({...newReport, is_public: checked as boolean})}
                  />
                  <Label htmlFor="is-public" className="cursor-pointer">
                    Relatório público (pode ser compartilhado)
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={editingReport ? handleUpdateReport : handleCreateReport}
                disabled={!newReport.name.trim()}
              >
                {editingReport ? 'Atualizar' : 'Criar'} Relatório
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingReport(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Lista de Relatórios */}
        <div className="space-y-4">
          {displayReports.map((report) => (
            <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{report.name}</h3>
                    <Badge className={getReportTypeColor(report.type)}>
                      {report.type}
                    </Badge>
                    {report.is_public && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Público
                      </Badge>
                    )}
                  </div>
                  
                  {report.description && (
                    <p className="text-gray-600 mb-3">{report.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Criado em {formatDate(report.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {report.created_by}
                    </div>
                    {report.filters.metrics && report.filters.metrics.length > 0 && (
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {report.filters.metrics.length} métrica(s)
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewReport?.(report.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditReport(report.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onExportReport?.(report.id, 'pdf')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onShareReport?.(report.id)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteReport?.(report.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filtros do Relatório */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {report.filters.date_range}
                </Badge>
                <Badge variant="secondary">
                  {report.filters.report_type}
                </Badge>
                {report.filters.metrics && report.filters.metrics.map((metric) => (
                  <Badge key={metric} variant="outline" className="text-xs">
                    {metric}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {displayReports.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum relatório encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Crie seu primeiro relatório para começar a analisar seus dados
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Relatório
            </Button>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default AnalyticsReports;