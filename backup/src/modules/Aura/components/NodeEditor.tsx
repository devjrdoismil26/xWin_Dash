import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Textarea from '@/components/ui/Textarea';
import { Select } from '@/components/ui/select';
import Badge from '@/components/ui/Badge';
import { NodeEditorProps, AuraFlowNode, AuraNodeType } from '../types/auraTypes';
import { toast } from 'sonner';
const NodeEditor: React.FC<NodeEditorProps> = ({ 
  node, 
  onNodeUpdate, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    id: '',
    type: 'message' as AuraNodeType,
    config: {} as Record<string, unknown>,
    position: { x: 0, y: 0 }
  });
  const nodeTypeOptions = [
    { value: 'message', label: 'Mensagem' },
    { value: 'condition', label: 'Condição' },
    { value: 'delay', label: 'Delay' },
    { value: 'webhook', label: 'Webhook' },
    { value: 'assign', label: 'Atribuir' },
    { value: 'tag', label: 'Tag' },
    { value: 'transfer', label: 'Transferir' }
  ];
  useEffect(() => {
    if (node) {
      setFormData({
        id: node.id,
        type: node.type,
        config: node.config || {},
        position: node.position || { x: 0, y: 0 }
      });
    }
  }, [node]);
  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleConfigChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };
  const handleSave = () => {
    if (!formData.id.trim()) {
      toast.error('ID do nó é obrigatório');
      return;
    }
    const updatedNode: AuraFlowNode = {
      ...node,
      id: formData.id,
      type: formData.type,
      config: formData.config,
      position: formData.position,
      connections: node?.connections || []
    };
    onNodeUpdate?.(updatedNode);
    toast.success('Nó atualizado com sucesso!');
  };
  const getNodeTypeIcon = (type: AuraNodeType): string => {
    const icons = {
      message: '💬',
      condition: '❓',
      delay: '⏱️',
      webhook: '🔗',
      assign: '📝',
      tag: '🏷️',
      transfer: '🔄'
    };
    return icons[type] || '📦';
  };
  const renderNodeConfig = () => {
    switch (formData.type) {
      case 'message':
        return (
          <div className="space-y-4">
            <div>
              <InputLabel htmlFor="message_content">Conteúdo da Mensagem</InputLabel>
              <Textarea
                id="message_content"
                value={formData.config.content || ''}
                onChange={(e) => handleConfigChange('content', e.target.value)}
                placeholder="Digite o conteúdo da mensagem..."
                rows={4}
              />
            </div>
            <div>
              <InputLabel htmlFor="message_type">Tipo de Mensagem</InputLabel>
              <Select
                id="message_type"
                value={formData.config.messageType || 'text'}
                onChange={(value) => handleConfigChange('messageType', value)}
                options={[
                  { value: 'text', label: 'Texto' },
                  { value: 'image', label: 'Imagem' },
                  { value: 'video', label: 'Vídeo' },
                  { value: 'audio', label: 'Áudio' }
                ]}
              />
            </div>
          </div>
        );
      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <InputLabel htmlFor="condition_field">Campo</InputLabel>
              <Input
                id="condition_field"
                value={formData.config.field || ''}
                onChange={(e) => handleConfigChange('field', e.target.value)}
                placeholder="Ex: user.age, message.content"
              />
            </div>
            <div>
              <InputLabel htmlFor="condition_operator">Operador</InputLabel>
              <Select
                id="condition_operator"
                value={formData.config.operator || 'equals'}
                onChange={(value) => handleConfigChange('operator', value)}
                options={[
                  { value: 'equals', label: 'Igual a' },
                  { value: 'contains', label: 'Contém' },
                  { value: 'starts_with', label: 'Começa com' },
                  { value: 'ends_with', label: 'Termina com' },
                  { value: 'greater_than', label: 'Maior que' },
                  { value: 'less_than', label: 'Menor que' }
                ]}
              />
            </div>
            <div>
              <InputLabel htmlFor="condition_value">Valor</InputLabel>
              <Input
                id="condition_value"
                value={formData.config.value || ''}
                onChange={(e) => handleConfigChange('value', e.target.value)}
                placeholder="Valor para comparação"
              />
            </div>
          </div>
        );
      case 'delay':
        return (
          <div className="space-y-4">
            <div>
              <InputLabel htmlFor="delay_duration">Duração (segundos)</InputLabel>
              <Input
                id="delay_duration"
                type="number"
                value={formData.config.duration || ''}
                onChange={(e) => handleConfigChange('duration', parseInt(e.target.value) || 0)}
                placeholder="60"
                min="0"
              />
            </div>
            <div>
              <InputLabel htmlFor="delay_unit">Unidade</InputLabel>
              <Select
                id="delay_unit"
                value={formData.config.unit || 'seconds'}
                onChange={(value) => handleConfigChange('unit', value)}
                options={[
                  { value: 'seconds', label: 'Segundos' },
                  { value: 'minutes', label: 'Minutos' },
                  { value: 'hours', label: 'Horas' },
                  { value: 'days', label: 'Dias' }
                ]}
              />
            </div>
          </div>
        );
      case 'webhook':
        return (
          <div className="space-y-4">
            <div>
              <InputLabel htmlFor="webhook_url">URL do Webhook</InputLabel>
              <Input
                id="webhook_url"
                value={formData.config.url || ''}
                onChange={(e) => handleConfigChange('url', e.target.value)}
                placeholder="https://api.exemplo.com/webhook"
              />
            </div>
            <div>
              <InputLabel htmlFor="webhook_method">Método HTTP</InputLabel>
              <Select
                id="webhook_method"
                value={formData.config.method || 'POST'}
                onChange={(value) => handleConfigChange('method', value)}
                options={[
                  { value: 'GET', label: 'GET' },
                  { value: 'POST', label: 'POST' },
                  { value: 'PUT', label: 'PUT' },
                  { value: 'DELETE', label: 'DELETE' }
                ]}
              />
            </div>
          </div>
        );
      case 'assign':
        return (
          <div className="space-y-4">
            <div>
              <InputLabel htmlFor="assign_variable">Variável</InputLabel>
              <Input
                id="assign_variable"
                value={formData.config.variable || ''}
                onChange={(e) => handleConfigChange('variable', e.target.value)}
                placeholder="Ex: user.name, lead.score"
              />
            </div>
            <div>
              <InputLabel htmlFor="assign_value">Valor</InputLabel>
              <Input
                id="assign_value"
                value={formData.config.value || ''}
                onChange={(e) => handleConfigChange('value', e.target.value)}
                placeholder="Valor a ser atribuído"
              />
            </div>
          </div>
        );
      case 'tag':
        return (
          <div className="space-y-4">
            <div>
              <InputLabel htmlFor="tag_name">Nome da Tag</InputLabel>
              <Input
                id="tag_name"
                value={formData.config.tagName || ''}
                onChange={(e) => handleConfigChange('tagName', e.target.value)}
                placeholder="Ex: vip, premium, ativo"
              />
            </div>
            <div>
              <InputLabel htmlFor="tag_action">Ação</InputLabel>
              <Select
                id="tag_action"
                value={formData.config.action || 'add'}
                onChange={(value) => handleConfigChange('action', value)}
                options={[
                  { value: 'add', label: 'Adicionar' },
                  { value: 'remove', label: 'Remover' },
                  { value: 'replace', label: 'Substituir' }
                ]}
              />
            </div>
          </div>
        );
      case 'transfer':
        return (
          <div className="space-y-4">
            <div>
              <InputLabel htmlFor="transfer_destination">Destino</InputLabel>
              <Input
                id="transfer_destination"
                value={formData.config.destination || ''}
                onChange={(e) => handleConfigChange('destination', e.target.value)}
                placeholder="Ex: agente@empresa.com, departamento_vendas"
              />
            </div>
            <div>
              <InputLabel htmlFor="transfer_message">Mensagem de Transferência</InputLabel>
              <Textarea
                id="transfer_message"
                value={formData.config.message || ''}
                onChange={(e) => handleConfigChange('message', e.target.value)}
                placeholder="Mensagem enviada ao transferir..."
                rows={3}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-4 text-gray-500">
            <div className="text-2xl mb-2">📦</div>
            <p>Configurações não disponíveis para este tipo de nó</p>
          </div>
        );
    }
  };
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>
            Editor de Nó {getNodeTypeIcon(formData.type)}
          </Card.Title>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Content className="space-y-4">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputLabel htmlFor="node_id">ID do Nó</InputLabel>
            <Input
              id="node_id"
              value={formData.id}
              onChange={(e) => handleInputChange('id', e.target.value)}
              placeholder="Ex: node_1, message_start"
            />
          </div>
          <div>
            <InputLabel htmlFor="node_type">Tipo de Nó</InputLabel>
            <Select
              id="node_type"
              value={formData.type}
              onChange={(value) => handleInputChange('type', value as AuraNodeType)}
              options={nodeTypeOptions}
            />
          </div>
        </div>
        {/* Posição */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <InputLabel htmlFor="position_x">Posição X</InputLabel>
            <Input
              id="position_x"
              type="number"
              value={formData.position.x}
              onChange={(e) => handleInputChange('position', { 
                ...formData.position, 
                x: parseInt(e.target.value) || 0 
              })}
            />
          </div>
          <div>
            <InputLabel htmlFor="position_y">Posição Y</InputLabel>
            <Input
              id="position_y"
              type="number"
              value={formData.position.y}
              onChange={(e) => handleInputChange('position', { 
                ...formData.position, 
                y: parseInt(e.target.value) || 0 
              })}
            />
          </div>
        </div>
        {/* Configurações Específicas */}
        <div>
          <InputLabel>Configurações do Nó</InputLabel>
          {renderNodeConfig()}
        </div>
      </Card.Content>
      <Card.Footer>
        <div className="flex justify-end gap-2">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          )}
          <Button onClick={handleSave}>
            Salvar Nó
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};
export default NodeEditor;
