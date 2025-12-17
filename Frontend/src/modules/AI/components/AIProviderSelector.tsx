/**
 * Componente AIProviderSelector - Seletor de Provedor de IA
 * @module modules/AI/components/AIProviderSelector
 * @description
 * Componente seletor de provedor de IA que exibe lista de provedores disponíveis,
 * suas capacidades, modelos e pontos fortes. Permite seleção de provedor e
 * exibição opcional de capacidades de cada provedor.
 * @since 1.0.0
 */
import React, { useEffect, useState } from 'react';
import Select from '@/shared/components/ui/Select';
import aiService from '../services/aiService';
import { AIProvider } from '../types';

type AIProviders = Record<string, AIProvider>;

/**
 * Interface AIProviderSelectorProps - Props do componente AIProviderSelector
 * @interface AIProviderSelectorProps
 * @property {string} value - Valor selecionado (ID do provedor)
 * @property {function} onChange - Função callback chamada ao alterar seleção
 * @property {(value: string) => void} onChange - Callback com ID do provedor selecionado
 * @property {boolean} [disabled=false] - Se o seletor está desabilitado (opcional, padrão: false)
 * @property {boolean} [showCapabilities=false] - Se deve exibir capacidades dos provedores (opcional, padrão: false)
 */
interface AIProviderSelectorProps {
  value: string;
  onChange?: (e: any) => void;
  disabled?: boolean;
  showCapabilities?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

/**
 * Componente AIProviderSelector - Seletor de Provedor de IA
 * @component
 * @description
 * Componente que renderiza um seletor de provedor de IA com lista de provedores
 * disponíveis, suas capacidades, modelos e pontos fortes.
 * 
 * @param {AIProviderSelectorProps} props - Props do componente
 * @returns {JSX.Element} Seletor de provedor de IA
 * 
 * @example
 * ```tsx
 * <AIProviderSelector 
 *   value="openai"
 *   onChange={ (providerId: unknown) => setProvider(providerId) }
 *   showCapabilities={ true }
 * />
 * ```
 */
const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({ value, 
  onChange, 
  disabled = false,
  showCapabilities = false 
   }) => {
  const [providers, setProviders] = useState<AIProviders>({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const providersData = await aiService.getProviders();

        setProviders(providersData);

      } catch (error) {
        // Fallback to default providers
        setProviders({
          openai: {
            name: 'OpenAI',
            capabilities: ['text_generation', 'image_generation'],
            models: ['gpt-4-turbo', 'gpt-3.5-turbo'],
            strengths: ['General purpose', 'Code generation'],
            pricing_model: 'token_based'
          },
          claude: {
            name: 'Anthropic Claude',
            capabilities: ['text_generation', 'analysis'],
            models: ['claude-3-opus', 'claude-3-sonnet'],
            strengths: ['Reasoning', 'Safety'],
            pricing_model: 'token_based'
          },
          gemini: {
            name: 'Google Gemini',
            capabilities: ['text_generation', 'multimodal'],
            models: ['gemini-1.5-pro', 'gemini-1.0-pro'],
            strengths: ['Multimodal', 'Long context'],
            pricing_model: 'token_based'
          } );

      } finally {
        setLoading(false);

      } ;

    loadProviders();

  }, []);

  const getProviderDisplayName = (key: string, provider: AIProvider) => {
    const statusEmoji = provider.models?.length > 0 ? '🟢' : '🟡';
    return `${statusEmoji} ${provider.name}`;};

  const getProviderDescription = (provider: AIProvider) => {
    if (!showCapabilities) return '';
    return ` - ${provider.capabilities?.slice(0, 2).join(', ')}`;};

  if (loading) {
    return (
              <Select 
        value={ value }
        onChange={() => {} disabled
        options={[{ value: '', label: 'Carregando providers...' }]} />);

  }
  return (
            <div className=" ">$2</div><Select 
        value={ value }
        onChange={ (value: unknown) => onChange(value) }
        disabled={ disabled }
        className="w-full"
        options={Object.entries(providers).map(([key, provider]) => ({
          value: key,
          label: `${getProviderDisplayName(key, provider)}${getProviderDescription(provider)}`
        }))} />
      {showCapabilities && providers[value] && (
        <div className=" ">$2</div><span className="font-medium">Capacidades:</span>{' '}
          {providers[value].capabilities?.join(', ')}
          <br / />
          <span className="font-medium">Pontos fortes:</span>{' '}
          {providers[value].strengths?.join(', ')}
        </div>
      )}
    </div>);};

export default AIProviderSelector;
