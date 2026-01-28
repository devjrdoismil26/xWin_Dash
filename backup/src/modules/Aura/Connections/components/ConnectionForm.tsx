import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import auraService from '../../services/auraService';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
interface ConnectionData {
  name: string;
  phone: string;
  platform?: string;
  webhook_url?: string;
  access_token?: string;
}
interface ConnectionFormProps {
  onSubmit?: (data: ConnectionData) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<ConnectionData>;
  isEdit?: boolean;
}
interface FormErrors {
  name?: string;
  phone?: string;
  platform?: string;
  access_token?: string;
}
const ConnectionForm: React.FC<ConnectionFormProps> = ({ 
  onSubmit, 
  onSuccess,
  onCancel,
  initialData = {},
  isEdit = false
}) => {
  const [formData, setFormData] = useState<ConnectionData>({
    name: initialData.name || '',
    phone: initialData.phone || '',
    platform: initialData.platform || 'WhatsApp Cloud API',
    webhook_url: initialData.webhook_url || '',
    access_token: initialData.access_token || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    // Nome é obrigatório
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    // Telefone é obrigatório e deve ter formato válido
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = 'Formato de telefone inválido';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone deve ter pelo menos 10 dígitos';
    }
    // Access token é obrigatório para WhatsApp Cloud API
    if (formData.platform === 'WhatsApp Cloud API' && !formData.access_token?.trim()) {
      newErrors.access_token = 'Token de acesso é obrigatório para WhatsApp Cloud API';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      notify.warning('Formulário Inválido', 'Corrija os erros antes de continuar.');
      return;
    }
    setIsLoading(true);
    try {
      if (onSubmit) {
        // Custom submit handler
        onSubmit(formData);
      } else {
        // Default API integration
        if (isEdit) {
          // Update existing connection
          await auraService.connections.update(initialData.id, formData);
          notify.success('Conexão Atualizada', 'Conexão foi atualizada com sucesso!');
        } else {
          // Create new connection
          await auraService.connections.create(formData);
          notify.success('Conexão Criada', 'Nova conexão foi configurada com sucesso!');
        }
        onSuccess?.();
      }
      // Reset form if creating new
      if (!isEdit) {
        setFormData({
          name: '',
          phone: '',
          platform: 'WhatsApp Cloud API',
          webhook_url: '',
          access_token: '',
        });
        setErrors({});
      }
    } catch (err) {
      notify.error(
        isEdit ? 'Erro ao Atualizar' : 'Erro ao Criar', 
        'Não foi possível salvar a conexão. Verifique os dados e tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (field: keyof ConnectionData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  const formatPhone = (phone: string) => {
    // Simple phone formatting for Brazilian numbers
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };
  return (
    <Card>
      <Card.Header>
        <Card.Title>{isEdit ? 'Editar Conexão' : 'Nova Conexão'}</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Conexão *
          </label>
          <Input 
            value={formData.name} 
            onChange={handleInputChange('name')}
            placeholder="Ex: WhatsApp Vendas"
            className={errors.name ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Telefone *
          </label>
          <Input 
            value={formData.phone} 
            onChange={handlePhoneChange}
            placeholder="(11) 99999-9999"
            className={errors.phone ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plataforma
          </label>
          <Select
            value={formData.platform}
            onChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
            options={[
              { value: 'WhatsApp Cloud API', label: 'WhatsApp Cloud API' },
              { value: 'WhatsApp Business API', label: 'WhatsApp Business API' }
            ]}
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token de Acesso *
          </label>
          <Input 
            type="password"
            value={formData.access_token} 
            onChange={handleInputChange('access_token')}
            placeholder="Seu token de acesso do WhatsApp"
            className={errors.access_token ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.access_token && (
            <p className="text-red-600 text-sm mt-1">{errors.access_token}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Token obtido no Facebook Developer Console
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL do Webhook (Opcional)
          </label>
          <Input 
            value={formData.webhook_url} 
            onChange={handleInputChange('webhook_url')}
            placeholder="https://seu-dominio.com/webhook/whatsapp"
            disabled={isLoading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Deixe em branco para usar o webhook padrão do sistema
          </p>
        </div>
      </Card.Content>
      <Card.Footer className="flex space-x-3">
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          {isLoading && <LoadingSpinner size="sm" />}
          <span>{isLoading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar Conexão')}</span>
        </Button>
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};
export default ConnectionForm;
