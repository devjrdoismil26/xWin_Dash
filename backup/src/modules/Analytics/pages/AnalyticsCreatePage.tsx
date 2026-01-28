// ========================================
// PÁGINA DE CRIAÇÃO - ANALYTICS
// ========================================
// Página para criar novos relatórios e dashboards de analytics

import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
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
  ArrowLeft, 
  Save, 
  Eye, 
  Plus,
  BarChart3,
  FileText,
  Target,
  Calendar,
  Settings,
  Users,
  Globe,
  Monitor,
  RefreshCw
} from 'lucide-react';
import AnalyticsBreadcrumbs from '../components/AnalyticsBreadcrumbs';
import { useAnalytics } from '../hooks/useAnalytics';

interface AnalyticsCreatePageProps {
  auth?: any;
  type?: 'dashboard' | 'report' | 'insight';
}

export const AnalyticsCreatePage: React.FC<AnalyticsCreatePageProps> = ({
  auth,
  type = 'report'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: type,
    category: 'custom',
    metrics: [] as string[],
    filters: {
      date_range: '30days',
      report_type: 'overview',
      devices: [] as string[],
      traffic_sources: [] as string[],
      countries: [] as string[]
    },
    schedule: {
      enabled: false,
      frequency: 'weekly',
      time: '09:00'
    },
    is_public: false,
    template: 'blank'
  });

  const [activeStep, setActiveStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const { createReport } = useAnalytics();

  const steps = [
    { id: 1, title: 'Informações Básicas', description: 'Nome e descrição' },
    { id: 2, title: 'Configuração', description: 'Métricas e filtros' },
    { id: 3, title: 'Agendamento', description: 'Frequência e notificações' },
    { id: 4, title: 'Revisão', description: 'Verificar e criar' }
  ];

  const metricsOptions = [
    { value: 'page_views', label: 'Visualizações de Página', icon: Eye },
    { value: 'unique_visitors', label: 'Visitantes Únicos', icon: Users },
    { value: 'sessions', label: 'Sessões', icon: Globe },
    { value: 'bounce_rate', label: 'Taxa de Rejeição', icon: Target },
    { value: 'avg_session_duration', label: 'Duração Média da Sessão', icon: Calendar },
    { value: 'conversion_rate', label: 'Taxa de Conversão', icon: BarChart3 },
    { value: 'revenue', label: 'Receita', icon: FileText },
    { value: 'transactions', label: 'Transações', icon: Settings }
  ];

  const deviceOptions = [
    { value: 'desktop', label: 'Desktop', icon: Monitor },
    { value: 'mobile', label: 'Mobile', icon: Globe },
    { value: 'tablet', label: 'Tablet', icon: Monitor }
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

  const templateOptions = [
    { value: 'blank', label: 'Em Branco', description: 'Começar do zero' },
    { value: 'overview', label: 'Visão Geral', description: 'Dashboard completo' },
    { value: 'traffic', label: 'Tráfego', description: 'Análise de tráfego' },
    { value: 'conversions', label: 'Conversões', description: 'Foco em conversões' },
    { value: 'audience', label: 'Audiência', description: 'Análise de audiência' }
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    const currentArray = (formData[field as keyof typeof formData] as string[]) || [];
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await createReport(formData);
      // Redirecionar ou mostrar sucesso
      console.log('Relatório criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar relatório:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Implementar preview
    console.log('Preview do relatório:', formData);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'dashboard':
        return 'Dashboard';
      case 'report':
        return 'Relatório';
      case 'insight':
        return 'Insight';
      default:
        return 'Analytics';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dashboard':
        return BarChart3;
      case 'report':
        return FileText;
      case 'insight':
        return Target;
      default:
        return BarChart3;
    }
  };

  const TypeIcon = getTypeIcon(type);

  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title={`Criar ${getTypeLabel(type)} - Analytics`} />
      <PageLayout>
        <div className="space-y-6">
          {/* Breadcrumbs */}
          <AnalyticsBreadcrumbs 
            items={[
              { id: 'home', label: 'Dashboard', href: '/dashboard', icon: Eye },
              { id: 'analytics', label: 'Analytics', href: '/analytics', icon: BarChart3 },
              { id: 'create', label: `Criar ${getTypeLabel(type)}`, icon: Plus, current: true }
            ]}
          />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
              
              <div className="flex items-center gap-3">
                <TypeIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Criar {getTypeLabel(type)}
                  </h1>
                  <p className="text-gray-600">
                    Configure seu novo {getTypeLabel(type).toLowerCase()} de analytics
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePreview}
              >
                <Eye className="h-4 w-4 mr-1" />
                Visualizar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || !formData.name.trim()}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Steps */}
          <Card>
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                      activeStep >= step.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    )}>
                      {step.id}
                    </div>
                    <div className="ml-3">
                      <div className={cn(
                        "text-sm font-medium",
                        activeStep >= step.id ? "text-blue-600" : "text-gray-600"
                      )}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "w-16 h-0.5 mx-4",
                        activeStep > step.id ? "bg-blue-600" : "bg-gray-200"
                      )} />
                    )}
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Form Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {activeStep === 1 && (
                <Card>
                  <Card.Header>
                    <Card.Title>Informações Básicas</Card.Title>
                  </Card.Header>
                  <Card.Content className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome do {getTypeLabel(type)}</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder={`Ex: ${getTypeLabel(type)} Mensal de Vendas`}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Descreva o propósito do relatório..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="template">Template</Label>
                      <Select
                        value={formData.template}
                        onValueChange={(value) => handleInputChange('template', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templateOptions.map((template) => (
                            <SelectItem key={template.value} value={template.value}>
                              <div>
                                <div className="font-medium">{template.label}</div>
                                <div className="text-xs text-gray-500">{template.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is-public"
                        checked={formData.is_public}
                        onCheckedChange={(checked) => handleInputChange('is_public', checked)}
                      />
                      <Label htmlFor="is-public" className="cursor-pointer">
                        {getTypeLabel(type)} público (pode ser compartilhado)
                      </Label>
                    </div>
                  </Card.Content>
                </Card>
              )}

              {activeStep === 2 && (
                <div className="space-y-6">
                  {/* Métricas */}
                  <Card>
                    <Card.Header>
                      <Card.Title>Métricas</Card.Title>
                    </Card.Header>
                    <Card.Content>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {metricsOptions.map((metric) => {
                          const IconComponent = metric.icon;
                          return (
                            <div key={metric.value} className="flex items-center space-x-3 p-3 border rounded-lg">
                              <Checkbox
                                id={`metric-${metric.value}`}
                                checked={formData.metrics.includes(metric.value)}
                                onCheckedChange={(checked) => 
                                  handleArrayChange('metrics', metric.value, checked as boolean)
                                }
                              />
                              <IconComponent className="h-4 w-4 text-gray-600" />
                              <Label
                                htmlFor={`metric-${metric.value}`}
                                className="flex-1 cursor-pointer"
                              >
                                {metric.label}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </Card.Content>
                  </Card>

                  {/* Filtros */}
                  <Card>
                    <Card.Header>
                      <Card.Title>Filtros</Card.Title>
                    </Card.Header>
                    <Card.Content className="space-y-4">
                      <div>
                        <Label htmlFor="date-range">Período</Label>
                        <Select
                          value={formData.filters.date_range}
                          onValueChange={(value) => handleInputChange('filters.date_range', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o período" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7days">Últimos 7 dias</SelectItem>
                            <SelectItem value="30days">Últimos 30 dias</SelectItem>
                            <SelectItem value="90days">Últimos 90 dias</SelectItem>
                            <SelectItem value="custom">Personalizado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="report-type">Tipo de Relatório</Label>
                        <Select
                          value={formData.filters.report_type}
                          onValueChange={(value) => handleInputChange('filters.report_type', value)}
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

                      <div>
                        <Label className="mb-3 block">Dispositivos</Label>
                        <div className="flex gap-4">
                          {deviceOptions.map((device) => {
                            const IconComponent = device.icon;
                            return (
                              <div key={device.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`device-${device.value}`}
                                  checked={formData.filters.devices.includes(device.value)}
                                  onCheckedChange={(checked) => 
                                    handleArrayChange('filters.devices', device.value, checked as boolean)
                                  }
                                />
                                <IconComponent className="h-4 w-4 text-gray-600" />
                                <Label
                                  htmlFor={`device-${device.value}`}
                                  className="cursor-pointer"
                                >
                                  {device.label}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Card.Content>
                  </Card>
                </div>
              )}

              {activeStep === 3 && (
                <Card>
                  <Card.Header>
                    <Card.Title>Agendamento</Card.Title>
                  </Card.Header>
                  <Card.Content className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="schedule-enabled"
                        checked={formData.schedule.enabled}
                        onCheckedChange={(checked) => handleInputChange('schedule.enabled', checked)}
                      />
                      <Label htmlFor="schedule-enabled" className="cursor-pointer">
                        Habilitar agendamento automático
                      </Label>
                    </div>

                    {formData.schedule.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="schedule-frequency">Frequência</Label>
                          <Select
                            value={formData.schedule.frequency}
                            onValueChange={(value) => handleInputChange('schedule.frequency', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Diário</SelectItem>
                              <SelectItem value="weekly">Semanal</SelectItem>
                              <SelectItem value="monthly">Mensal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="schedule-time">Horário</Label>
                          <Input
                            id="schedule-time"
                            type="time"
                            value={formData.schedule.time}
                            onChange={(e) => handleInputChange('schedule.time', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </Card.Content>
                </Card>
              )}

              {activeStep === 4 && (
                <Card>
                  <Card.Header>
                    <Card.Title>Revisão</Card.Title>
                  </Card.Header>
                  <Card.Content className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium">Nome:</span> {formData.name}
                      </div>
                      <div>
                        <span className="font-medium">Descrição:</span> {formData.description}
                      </div>
                      <div>
                        <span className="font-medium">Métricas:</span> {formData.metrics.length} selecionadas
                      </div>
                      <div>
                        <span className="font-medium">Período:</span> {formData.filters.date_range}
                      </div>
                      <div>
                        <span className="font-medium">Agendamento:</span> {formData.schedule.enabled ? 'Habilitado' : 'Desabilitado'}
                      </div>
                      <div>
                        <span className="font-medium">Público:</span> {formData.is_public ? 'Sim' : 'Não'}
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Navigation */}
              <Card>
                <Card.Header>
                  <Card.Title>Navegação</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-2">
                    {steps.map((step) => (
                      <Button
                        key={step.id}
                        variant={activeStep === step.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveStep(step.id)}
                      >
                        {step.title}
                      </Button>
                    ))}
                  </div>
                </Card.Content>
              </Card>

              {/* Actions */}
              <Card>
                <Card.Header>
                  <Card.Title>Ações</Card.Title>
                </Card.Header>
                <Card.Content className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                    disabled={activeStep === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => setActiveStep(Math.min(4, activeStep + 1))}
                    disabled={activeStep === 4}
                  >
                    Próximo
                  </Button>
                </Card.Content>
              </Card>

              {/* Summary */}
              <Card>
                <Card.Header>
                  <Card.Title>Resumo</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Métricas:</span>
                      <Badge variant="secondary">{formData.metrics.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Filtros:</span>
                      <Badge variant="secondary">3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Agendamento:</span>
                      <Badge variant={formData.schedule.enabled ? "default" : "secondary"}>
                        {formData.schedule.enabled ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>
        </div>
      </PageLayout>
    </AuthenticatedLayout>
  );
};

export default AnalyticsCreatePage;