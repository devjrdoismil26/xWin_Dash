import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  X, 
  Save, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Loader2,
  BookOpen,
  Zap,
  Calendar,
  Globe,
  Mail,
  Code,
  Bot,
  Database
} from 'lucide-react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card } from "@/components/ui/Card";
import Badge from '@/components/ui/Badge';
import { Animated } from '@/components/ui/AdvancedAnimations';
import { cn } from '@/lib/utils';

// Interfaces
interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  is_public: boolean;
  usage_count: number;
  rating: number;
  preview_image?: string;
}

interface CreateWorkflowData {
  name: string;
  description: string;
  trigger_type: string;
  template_id?: string;
  is_active: boolean;
}

interface WorkflowsCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (workflow: any) => void;
  className?: string;
  showTemplates?: boolean;
  showAdvancedOptions?: boolean;
}

// Templates disponíveis
const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'email-automation',
    name: 'Automação de Email',
    description: 'Workflow para automação de campanhas de email marketing',
    category: 'Marketing',
    tags: ['email', 'marketing', 'automation'],
    is_public: true,
    usage_count: 1250,
    rating: 4.8,
    preview_image: '/templates/email-automation.png'
  },
  {
    id: 'lead-nurturing',
    name: 'Nutrição de Leads',
    description: 'Sequência de nutrição automática para novos leads',
    category: 'Sales',
    tags: ['leads', 'sales', 'nurturing'],
    is_public: true,
    usage_count: 890,
    rating: 4.6,
    preview_image: '/templates/lead-nurturing.png'
  },
  {
    id: 'social-media-posting',
    name: 'Postagem em Redes Sociais',
    description: 'Agendamento e publicação automática em redes sociais',
    category: 'Social Media',
    tags: ['social', 'posting', 'scheduling'],
    is_public: true,
    usage_count: 2100,
    rating: 4.9,
    preview_image: '/templates/social-posting.png'
  },
  {
    id: 'data-processing',
    name: 'Processamento de Dados',
    description: 'Workflow para processamento e análise de dados',
    category: 'Analytics',
    tags: ['data', 'processing', 'analytics'],
    is_public: true,
    usage_count: 650,
    rating: 4.4,
    preview_image: '/templates/data-processing.png'
  },
  {
    id: 'customer-support',
    name: 'Suporte ao Cliente',
    description: 'Automação de tickets e respostas de suporte',
    category: 'Support',
    tags: ['support', 'tickets', 'automation'],
    is_public: true,
    usage_count: 750,
    rating: 4.5,
    preview_image: '/templates/customer-support.png'
  }
];

// Tipos de trigger
const TRIGGER_TYPES = [
  { value: 'webhook', label: 'Webhook', icon: Globe, description: 'Acionado por requisições HTTP' },
  { value: 'schedule', label: 'Agendado', icon: Calendar, description: 'Executado em horários específicos' },
  { value: 'email_received', label: 'Email Recebido', icon: Mail, description: 'Acionado por emails recebidos' },
  { value: 'form_submitted', label: 'Formulário Enviado', icon: Database, description: 'Acionado por envio de formulários' },
  { value: 'user_action', label: 'Ação do Usuário', icon: Bot, description: 'Acionado por ações do usuário' },
  { value: 'api_call', label: 'Chamada de API', icon: Code, description: 'Acionado por chamadas de API' },
  { value: 'manual', label: 'Manual', icon: Zap, description: 'Executado manualmente' }
];

/**
 * Modal para criação de workflows
 * Permite criar workflows do zero ou a partir de templates
 */
const WorkflowsCreateModal: React.FC<WorkflowsCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  className,
  showTemplates = true,
  showAdvancedOptions = true
}) => {
  // Estados
  const [activeTab, setActiveTab] = useState<'basic' | 'template' | 'advanced'>('basic');
  const [formData, setFormData] = useState<CreateWorkflowData>({
    name: '',
    description: '',
    trigger_type: '',
    template_id: undefined,
    is_active: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        trigger_type: '',
        template_id: undefined,
        is_active: false
      });
      setErrors({});
      setSelectedTemplate(null);
      setActiveTab('basic');
    }
  }, [isOpen]);

  // Handlers
  const handleInputChange = (field: keyof CreateWorkflowData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTemplateSelect = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      template_id: template.id
    }));
    setActiveTab('basic');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Nome deve ter no máximo 100 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }

    if (!formData.trigger_type) {
      newErrors.trigger_type = 'Tipo de trigger é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simular criação do workflow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newWorkflow = {
        id: Date.now(),
        ...formData,
        status: 'draft',
        executions_count: 0,
        success_rate: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      onSuccess(newWorkflow);
    } catch (error) {
      console.error('Erro ao criar workflow:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" className={className}>
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Criar Novo Workflow</h2>
            <p className="text-sm text-muted-foreground">
              Crie um workflow personalizado ou use um template
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            {showTemplates && <TabsTrigger value="template">Templates</TabsTrigger>}
            {showAdvancedOptions && <TabsTrigger value="advanced">Avançado</TabsTrigger>}
          </TabsList>

          {/* Aba Básico */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações Básicas</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Workflow *</label>
                  <Input
                    placeholder="Digite o nome do workflow"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={cn(errors.name && 'border-red-500')}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição *</label>
                  <Textarea
                    placeholder="Descreva o que este workflow faz"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className={cn(errors.description && 'border-red-500')}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Trigger *</label>
                  <Select
                    value={formData.trigger_type}
                    onValueChange={(value) => handleInputChange('trigger_type', value)}
                  >
                    <SelectTrigger className={cn(errors.trigger_type && 'border-red-500')}>
                      <SelectValue placeholder="Selecione o tipo de trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIGGER_TYPES.map((trigger) => {
                        const Icon = trigger.icon;
                        return (
                          <SelectItem key={trigger.value} value={trigger.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{trigger.label}</div>
                                <div className="text-xs text-muted-foreground">
                                  {trigger.description}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.trigger_type && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.trigger_type}
                    </p>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preview</h3>
                
                <Card>
                  <Card.Header>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-muted rounded">
                        <Zap className="h-4 w-4" />
                      </div>
                      <Card.Title className="text-base">
                        {formData.name || 'Nome do Workflow'}
                      </Card.Title>
                    </div>
                    <Card.Description>
                      {formData.description || 'Descrição do workflow'}
                    </Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Trigger:</span>
                        {formData.trigger_type ? (
                          <Badge variant="outline">
                            {TRIGGER_TYPES.find(t => t.value === formData.trigger_type)?.label}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">Não selecionado</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant="secondary">Rascunho</Badge>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Aba Templates */}
          {showTemplates && (
            <TabsContent value="template" className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium mb-2">Escolha um Template</h3>
                <p className="text-sm text-muted-foreground">
                  Templates populares para começar rapidamente
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WORKFLOW_TEMPLATES.map((template) => (
                  <Animated key={template.id}>
                    <Card 
                      className={cn(
                        'cursor-pointer transition-all hover:shadow-md',
                        selectedTemplate?.id === template.id && 'ring-2 ring-primary'
                      )}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <Card.Header>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Card.Title className="text-base">{template.name}</Card.Title>
                            <Card.Description className="mt-1">
                              {template.description}
                            </Card.Description>
                          </div>
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                      </Card.Header>
                      <Card.Content>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {template.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {template.usage_count} usos
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              {template.rating}/5
                            </div>
                          </div>
                        </div>
                      </Card.Content>
                    </Card>
                  </Animated>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Aba Avançado */}
          {showAdvancedOptions && (
            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Opções Avançadas</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Ativar Imediatamente</label>
                      <p className="text-xs text-muted-foreground">
                        O workflow será ativado automaticamente após a criação
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-muted-foreground">
            {selectedTemplate && (
              <span>Usando template: <strong>{selectedTemplate.name}</strong></span>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Criar Workflow
                </>
              )}
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default WorkflowsCreateModal;
