/**
 * @module ConnectionForm
 * @description Componente de formulário para criar ou editar conexões do Aura.
 * 
 * Este componente permite criar novas conexões (WhatsApp, etc.) ou editar conexões
 * existentes. Inclui validação de campos obrigatórios, formatação de telefone e
 * integração com a API do Aura. Suporta diferentes plataformas e configuração de webhooks.
 * 
 * @example
 * ```tsx
 * <ConnectionForm
 *   initialData={
 *     name: "WhatsApp Vendas",
 *     phone: "(11) 99999-9999",
 *     platform: "WhatsApp Cloud API"
 *   } *   isEdit={ true }
 *   onSuccess={ () =>  }
 *   onCancel={ () =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import auraService from '@/services/auraService';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { notify } from '@/lib/utils';

/**
 * Interface para os dados de uma conexão
 * 
 * @interface ConnectionData
 * @property {string} name - Nome da conexão
 * @property {string} phone - Número de telefone (formatado)
 * @property {string} [platform] - Plataforma da conexão (padrão: 'WhatsApp Cloud API')
 * @property {string} [webhook_url] - URL do webhook (opcional)
 * @property {string} [access_token] - Token de acesso da plataforma
 */
interface ConnectionData {
  /** Nome da conexão */
  name: string;
  /** Número de telefone (formatado) */
  phone: string;
  /** Plataforma da conexão (padrão: 'WhatsApp Cloud API') */
  platform?: string;
  /** URL do webhook (opcional) */
  webhook_url?: string;
  /** Token de acesso da plataforma */
  access_token?: string; }

/**
 * Interface para as propriedades do componente ConnectionForm
 * 
 * @interface ConnectionFormProps
 * @property {(data: ConnectionData) => void} [onSubmit] - Callback customizado para submissão (substitui comportamento padrão)
 * @property {() => void} [onSuccess] - Callback chamado após sucesso na criação/edição
 * @property {() => void} [onCancel] - Callback chamado quando o cancelamento é acionado
 * @property {Partial<ConnectionData & { id?: string }>} [initialData] - Dados iniciais do formulário (para edição)
 * @property {boolean} [isEdit] - Se está em modo de edição (padrão: false)
 */
interface ConnectionFormProps {
  /** Callback customizado para submissão (se fornecido, substitui comportamento padrão da API) */
onSubmit?: (e: any) => void;
  /** Callback chamado após sucesso na criação ou edição */
onSuccess???: (e: any) => void;
  /** Callback chamado quando o cancelamento é acionado */
onCancel???: (e: any) => void;
  /** Dados iniciais do formulário (usado para edição) */
initialData?: Partial<ConnectionData & { id?: string
children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }>;
  /** Se está em modo de edição (padrão: false) */
  isEdit?: boolean;
}

/**
 * Interface para erros de validação do formulário
 * 
 * @interface FormErrors
 * @property {string} [name] - Erro no campo nome
 * @property {string} [phone] - Erro no campo telefone
 * @property {string} [platform] - Erro no campo plataforma
 * @property {string} [access_token] - Erro no campo token de acesso
 */
interface FormErrors {
  /** Erro no campo nome */
  name?: string;
  /** Erro no campo telefone */
  phone?: string;
  /** Erro no campo plataforma */
  platform?: string;
  /** Erro no campo token de acesso */
  access_token?: string; }
const ConnectionForm: React.FC<ConnectionFormProps> = ({ 
  onSubmit, 
  onSuccess,
  onCancel,
  initialData = {} as any,
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
    const newErrors: FormErrors = {} as any;
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

    return Object.keys(newErrors).length === 0;};

  /**
   * Manipula a submissão do formulário
   * 
   * Valida o formulário e, se válido, chama onSubmit customizado ou
   * faz a requisição à API para criar/atualizar a conexão.
   * 
   * @async
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      notify?.warning('Formulário Inválido', 'Corrija os erros antes de continuar.');

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

      } catch (err) {
      notify?.error(
        isEdit ? 'Erro ao Atualizar' : 'Erro ao Criar', 
        'Não foi possível salvar a conexão. Verifique os dados e tente novamente.');

    } finally {
      setIsLoading(false);

    } ;

  const handleInputChange = (field: keyof ConnectionData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement />
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));

    } ;

  const formatPhone = (phone: string) => {
    // Simple phone formatting for Brazilian numbers
    const numbers = phone.replace(/\D/g, '');

    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');

    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

    } ;

  /**
   * Manipula a mudança no campo de telefone (aplica formatação automática)
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de mudança do input
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const formatted = formatPhone(e.target.value);

    setFormData(prev => ({ ...prev, phone: formatted }));

    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: undefined }));

    } ;

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>{isEdit ? 'Editar Conexão' : 'Nova Conexão'}</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-6" />
        <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
            Nome da Conexão *
          </label>
          <Input 
            value={ formData.name }
            onChange={ handleInputChange('name') }
            placeholder="Ex: WhatsApp Vendas"
            className={errors.name ? 'border-red-500' : ''} disabled={ isLoading  }>
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
            Número de Telefone *
          </label>
          <Input 
            value={ formData.phone }
            onChange={ handlePhoneChange }
            placeholder="(11) 99999-9999"
            className={errors.phone ? 'border-red-500' : ''} disabled={ isLoading  }>
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
        <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
            Plataforma
          </label>
          <Select
            value={ formData.platform }
            onChange={(value: unknown) => setFormData(prev => ({ ...prev, platform: value }))}
            options={[
              { value: 'WhatsApp Cloud API', label: 'WhatsApp Cloud API' },
              { value: 'WhatsApp Business API', label: 'WhatsApp Business API' }
            ]}
            disabled={ isLoading } /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
            Token de Acesso *
          </label>
          <Input 
            type="password"
            value={ formData.access_token }
            onChange={ handleInputChange('access_token') }
            placeholder="Seu token de acesso do WhatsApp"
            className={errors.access_token ? 'border-red-500' : ''} disabled={ isLoading  }>
          {errors.access_token && (
            <p className="text-red-600 text-sm mt-1">{errors.access_token}</p>
          )}
          <p className="text-sm text-gray-500 mt-1" />
            Token obtido no Facebook Developer Console
          </p></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
            URL do Webhook (Opcional)
          </label>
          <Input 
            value={ formData.webhook_url }
            onChange={ handleInputChange('webhook_url') }
            placeholder="https://seu-dominio.com/webhook/whatsapp"
            disabled={ isLoading }
          / />
          <p className="text-sm text-gray-500 mt-1" />
            Deixe em branco para usar o webhook padrão do sistema
          </p></div></Card.Content>
      <Card.Footer className="flex space-x-3" />
        <Button 
          onClick={ handleSubmit }
          disabled={ isLoading }
          className="flex items-center space-x-2" />
          {isLoading && <LoadingSpinner size="sm" />}
          <span>{isLoading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar Conexão')}</span>
        </Button>
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={ onCancel }
            disabled={ isLoading } />
            Cancelar
          </Button>
        )}
      </Card.Footer>
    </Card>);};

export default ConnectionForm;
