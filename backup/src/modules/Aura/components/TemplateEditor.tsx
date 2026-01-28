import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Textarea from '@/components/ui/Textarea';
import { Select } from '@/components/ui/select';
import Badge from '@/components/ui/Badge';
import { TemplateEditorProps, AuraTemplate, AuraTemplateType, AuraPlatform } from '../types/auraTypes';
import { toast } from 'sonner';
const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  template, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'welcome' as AuraTemplateType,
    content: '',
    platform: 'whatsapp' as AuraPlatform,
    is_active: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [variables, setVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState('');
  const templateTypeOptions = [
    { value: 'welcome', label: 'Boas-vindas' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'reminder', label: 'Lembrete' },
    { value: 'notification', label: 'Notificação' },
    { value: 'promotional', label: 'Promocional' },
    { value: 'support', label: 'Suporte' }
  ];
  const platformOptions = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'website', label: 'Website' },
    { value: 'email', label: 'Email' }
  ];
  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        type: template.type,
        content: template.content,
        platform: template.platform,
        is_active: template.is_active
      });
      setVariables(template.variables);
    }
  }, [template]);
  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleAddVariable = () => {
    if (newVariable.trim() && !variables.includes(newVariable.trim())) {
      setVariables(prev => [...prev, newVariable.trim()]);
      setNewVariable('');
    }
  };
  const handleRemoveVariable = (variable: string) => {
    setVariables(prev => prev.filter(v => v !== variable));
  };
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      toast.error('Nome e conteúdo são obrigatórios');
      return;
    }
    setIsSaving(true);
    try {
      const templateData: AuraTemplate = {
        id: template?.id || 0,
        name: formData.name,
        type: formData.type,
        content: formData.content,
        variables: variables,
        platform: formData.platform,
        is_active: formData.is_active,
        created_at: template?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await onSave?.(templateData);
      toast.success('Template salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar template');
    } finally {
      setIsSaving(false);
    }
  };
  const getTemplateTypeIcon = (type: AuraTemplateType): string => {
    const icons = {
      welcome: '👋',
      follow_up: '🔄',
      reminder: '⏰',
      notification: '🔔',
      promotional: '🎯',
      support: '🆘'
    };
    return icons[type] || '📝';
  };
  const getPlatformIcon = (platform: AuraPlatform): string => {
    const icons = {
      whatsapp: '📱',
      telegram: '✈️',
      instagram: '📷',
      facebook: '👥',
      website: '🌐',
      email: '📧'
    };
    return icons[platform] || '🔧';
  };
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>
            {template ? 'Editar Template' : 'Criar Template'}
          </Card.Title>
          <div className="flex items-center gap-2">
            <Badge variant={formData.is_active ? 'success' : 'secondary'}>
              {formData.is_active ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </div>
      </Card.Header>
      <Card.Content className="space-y-4">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputLabel htmlFor="name">Nome do Template</InputLabel>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Boas-vindas WhatsApp"
            />
          </div>
          <div>
            <InputLabel htmlFor="type">Tipo</InputLabel>
            <Select
              id="type"
              value={formData.type}
              onChange={(value) => handleInputChange('type', value as AuraTemplateType)}
              options={templateTypeOptions}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputLabel htmlFor="platform">Plataforma</InputLabel>
            <Select
              id="platform"
              value={formData.platform}
              onChange={(value) => handleInputChange('platform', value as AuraPlatform)}
              options={platformOptions}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Template ativo</span>
            </label>
          </div>
        </div>
        {/* Conteúdo do Template */}
        <div>
          <InputLabel htmlFor="content">
            Conteúdo {getTemplateTypeIcon(formData.type)} {getPlatformIcon(formData.platform)}
          </InputLabel>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Digite o conteúdo do template..."
            rows={6}
            className="resize-none"
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.content.length} caracteres
          </div>
        </div>
        {/* Variáveis */}
        <div>
          <InputLabel>Variáveis do Template</InputLabel>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={newVariable}
                onChange={(e) => setNewVariable(e.target.value)}
                placeholder="Nome da variável (ex: nome_cliente)"
                onKeyPress={(e) => e.key === 'Enter' && handleAddVariable()}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddVariable}
                disabled={!newVariable.trim()}
              >
                Adicionar
              </Button>
            </div>
            {variables.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {variables.map((variable) => (
                  <Badge 
                    key={variable} 
                    variant="outline" 
                    className="flex items-center gap-1"
                  >
                    {`{{${variable}}}`}
                    <button
                      type="button"
                      onClick={() => handleRemoveVariable(variable)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Preview */}
        {formData.content && (
          <div>
            <InputLabel>Preview</InputLabel>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {formData.content}
              </div>
            </div>
          </div>
        )}
      </Card.Content>
      <Card.Footer>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-gray-500">
            {template ? `Editando template criado em ${new Date(template.created_at).toLocaleDateString('pt-BR')}` : 'Criando novo template'}
          </div>
          <div className="flex gap-2">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button 
              onClick={handleSave} 
              loading={isSaving}
              disabled={!formData.name.trim() || !formData.content.trim()}
            >
              {isSaving ? 'Salvando...' : 'Salvar Template'}
            </Button>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};
export default TemplateEditor;
