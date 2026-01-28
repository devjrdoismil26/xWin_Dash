import React, { useEffect, useState } from 'react';
import { Select } from '@/components/ui/select';
import aiService from '../services/aiService';
interface AIProviderSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  showCapabilities?: boolean;
}
const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({ 
  value, 
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
          }
        });
      } finally {
        setLoading(false);
      }
    };
    loadProviders();
  }, []);
  const getProviderDisplayName = (key: string, provider: AIProvider) => {
    const statusEmoji = provider.models?.length > 0 ? '🟢' : '🟡';
    return `${statusEmoji} ${provider.name}`;
  };
  const getProviderDescription = (provider: AIProvider) => {
    if (!showCapabilities) return '';
    return ` - ${provider.capabilities?.slice(0, 2).join(', ')}`;
  };
  if (loading) {
    return (
      <Select 
        value={value} 
        onChange={() => {}} 
        disabled
        options={[{ value: '', label: 'Carregando providers...' }]}
      />
    );
  }
  return (
    <div className="space-y-1">
      <Select 
        value={value} 
        onChange={(value) => onChange(value)}
        disabled={disabled}
        className="w-full"
        options={Object.entries(providers).map(([key, provider]) => ({
          value: key,
          label: `${getProviderDisplayName(key, provider)}${getProviderDescription(provider)}`
        }))}
      />
      {showCapabilities && providers[value] && (
        <div className="text-xs text-gray-600 mt-1">
          <span className="font-medium">Capacidades:</span>{' '}
          {providers[value].capabilities?.join(', ')}
          <br />
          <span className="font-medium">Pontos fortes:</span>{' '}
          {providers[value].strengths?.join(', ')}
        </div>
      )}
    </div>
  );
};
export default AIProviderSelector;
