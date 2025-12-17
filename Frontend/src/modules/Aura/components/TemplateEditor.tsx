import React, { useState, useEffect } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Textarea from '@/shared/components/ui/Textarea';
import Select from '@/shared/components/ui/Select';
import Badge from '@/shared/components/ui/Badge';
import { TemplateEditorProps, AuraTemplate, AuraTemplateType, AuraPlatform } from '../types/auraTypes';
import { toast } from 'sonner';
const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, 
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

    } , [template]);

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));};

  const handleAddVariable = () => {
    if (newVariable.trim() && !variables.includes(newVariable.trim())) {
      setVariables(prev => [...prev, newVariable.trim()]);

      setNewVariable('');

    } ;

  /**
   * Remove uma variável do template
   * 
   * @param {string} variable - Nome da variável a ser removida
   */
  const handleRemoveVariable = (variable: string) => {
    setVariables(prev => (prev || []).filter(v => v !== variable));};

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
        updated_at: new Date().toISOString()};

      await onSave?.(templateData);

      toast.success('Template salvo com sucesso!');

    } catch (error) {
      toast.error('Erro ao salvar template');

    } finally {
      setIsSaving(false);

    } ;

  const getTemplateTypeIcon = (type: AuraTemplateType): string => {
    const icons = {
      welcome: '👋',
      follow_up: '🔄',
      reminder: '⏰',
      notification: '🔔',
      promotional: '🎯',
      support: '🆘'};

    return icons[type] || '📝';};

  /**
   * Retorna o ícone emoji para a plataforma
   * 
   * @param {AuraPlatform} platform - Plataforma
   * @returns {string} Emoji do ícone
   */
  const getPlatformIcon = (platform: AuraPlatform): string => {
    const icons = {
      whatsapp: '📱',
      telegram: '✈️',
      instagram: '📷',
      facebook: '👥',
      website: '🌐',
      email: '📧'};

    return icons[platform] || '🔧';};

  return (
        <>
      <Card />
      <Card.Header />
        <div className=" ">$2</div><Card.Title />
            {template ? 'Editar Template' : 'Criar Template'}
          </Card.Title>
          <div className=" ">$2</div><Badge variant={ formData.is_active ? 'success' : 'secondary' } />
              {formData.is_active ? 'Ativo' : 'Inativo'}
            </Badge></div></Card.Header>
      <Card.Content className="space-y-6" />
        {/* Informações Básicas */}
        <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="name">Nome do Template</InputLabel>
            <Input
              id="name"
              value={ formData.name }
              onChange={ (e: unknown) => handleInputChange('name', e.target.value) }
              placeholder="Ex: Boas-vindas WhatsApp" /></div><div>
           
        </div><InputLabel htmlFor="type">Tipo</InputLabel>
            <Select
              id="type"
              value={ formData.type }
              onChange={ (value: unknown) => handleInputChange('type', value as AuraTemplateType) }
              options={ templateTypeOptions } /></div><div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="platform">Plataforma</InputLabel>
            <Select
              id="platform"
              value={ formData.platform }
              onChange={ (value: unknown) => handleInputChange('platform', value as AuraPlatform) }
              options={ platformOptions } /></div><div className=" ">$2</div><label className="flex items-center gap-2" />
              <input
                type="checkbox"
                checked={ formData.is_active }
                onChange={ (e: unknown) => handleInputChange('is_active', e.target.checked) }
                className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Template ativo</span></label></div>
        {/* Conteúdo do Template */}
        <div>
           
        </div><InputLabel htmlFor="content" />
            Conteúdo {getTemplateTypeIcon(formData.type)} {getPlatformIcon(formData.platform)}
          </InputLabel>
          <Textarea
            id="content"
            value={ formData.content }
            onChange={ (e: unknown) => handleInputChange('content', e.target.value) }
            placeholder="Digite o conteúdo do template..."
            rows={ 6 }
            className="resize-none" />
          <div className="{formData.content.length} caracteres">$2</div>
          </div>
        {/* Variáveis */}
        <div>
           
        </div><InputLabel>Variáveis do Template</InputLabel>
          <div className=" ">$2</div><div className=" ">$2</div><Input
                value={ newVariable }
                onChange={ (e: unknown) => setNewVariable(e.target.value) }
                placeholder="Nome da variável (ex: nome_cliente)"
                onKeyPress={ (e: unknown) => e.key === 'Enter' && handleAddVariable() } />
              <Button 
                type="button" 
                variant="outline" 
                onClick={ handleAddVariable }
                disabled={ !newVariable.trim() } />
                Adicionar
              </Button>
            </div>
            {variables.length > 0 && (
              <div className="{(variables || []).map((variable: unknown) => (">$2</div>
                  <Badge 
                    key={ variable }
                    variant="outline" 
                    className="flex items-center gap-1" />
                    {`{${variable}`}
                    <button
                      type="button"
                      onClick={ () => handleRemoveVariable(variable) }
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
      </Badge>
    </>
  ))}
              </div>
            )}
          </div>
        {/* Eye */}
        {formData.content && (
          <div>
           
        </div><InputLabel>Eye</InputLabel>
            <div className=" ">$2</div><div className="{formData.content}">$2</div>
              </div>
    </div>
  )}
      </Card.Content>
      <Card.Footer />
        <div className=" ">$2</div><div className="{template ? `Editando template criado em ${new Date(template.created_at).toLocaleDateString('pt-BR')}` : 'Criando novo template'}">$2</div>
          </div>
          <div className="{ onCancel && (">$2</div>
              <Button variant="outline" onClick={onCancel } />
                Cancelar
              </Button>
            )}
            <Button 
              onClick={ handleSave }
              loading={ isSaving }
              disabled={ !formData.name.trim() || !formData.content.trim() } />
              {isSaving ? 'Salvando...' : 'Salvar Template'}
            </Button></div></Card.Footer>
    </Card>);};

export default TemplateEditor;
