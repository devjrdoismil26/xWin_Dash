import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
export interface ProviderConfig {
  apiKey?: string;
  defaultModel?: string;
}
export interface EnhancedAISettingsProps {
  initial?: {
    providers?: { openai?: ProviderConfig; claude?: ProviderConfig; gemini?: ProviderConfig };
    preferences?: { defaultProvider?: string };
  };
}
const EnhancedAISettings: React.FC<EnhancedAISettingsProps> = ({ initial }) => {
  const [providers, setProviders] = useState(initial?.providers || { openai: {}, claude: {}, gemini: {} });
  const [preferences, setPreferences] = useState(initial?.preferences || { defaultProvider: 'openai' });
  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <Card.Title>Providers</Card.Title>
        </Card.Header>
        <Card.Content className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['openai', 'claude', 'gemini'] as const).map((p) => (
            <div key={p} className="space-y-3">
              <h4 className="font-medium capitalize">{p}</h4>
              <Input
                type="password"
                placeholder="API Key"
                value={providers[p]?.apiKey || ''}
                onChange={(e) => setProviders((prev: Record<string, any>) => ({ ...prev, [p]: { ...prev[p], apiKey: e.target.value } }))}
              />
              <Select
                value={providers[p]?.defaultModel || ''}
                onChange={(e) => setProviders((prev: Record<string, any>) => ({ ...prev, [p]: { ...prev[p], defaultModel: e.target.value } }))}
              >
                <option value="">Selecione um modelo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="gemini-pro">Gemini Pro</option>
              </Select>
            </div>
          ))}
        </Card.Content>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>Preferências</Card.Title>
        </Card.Header>
        <Card.Content className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Provider padrão</label>
            <Select value={preferences.defaultProvider} onChange={(e) => setPreferences({ defaultProvider: e.target.value })}>
              <option value="openai">OpenAI</option>
              <option value="claude">Anthropic Claude</option>
              <option value="gemini">Google Gemini</option>
            </Select>
          </div>
        </Card.Content>
        <Card.Footer>
          <Button>Salvar</Button>
        </Card.Footer>
      </Card>
    </div>
  );
};
export default EnhancedAISettings;
