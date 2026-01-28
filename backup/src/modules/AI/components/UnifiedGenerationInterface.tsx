import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card"
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Input from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { useAI } from '@/modules/AI/hooks/useAI';
import AIProviderSelector from './AIProviderSelector';
interface GenerationResult {
  text: string;
  tokens_used: number;
  cost: number;
  model: string;
  provider: string;
  response_time_ms?: number;
}
const UnifiedGenerationInterface: React.FC<{ onGenerate?: (data: AIGeneration) => void }> = React.memo(function UnifiedGenerationInterface({ onGenerate }) {
  const [type, setType] = useState('text');
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const { generate, generateContent, providers, loadProviders, loading, error } = useAI();
  useEffect(() => {
    loadProviders();
  }, [loadProviders]);
  // Set default model based on provider
  useEffect(() => {
    const providerModels = {
      'openai': 'gpt-4-turbo-preview',
      'claude': 'claude-3-sonnet-20240229',
      'gemini': 'gemini-1.5-pro'
    };
    setModel(providerModels[provider as keyof typeof providerModels] || '');
  }, [provider]);
  const handleGenerate = async () => {
    try {
      let resultText = '';
      if (type === 'content') {
        // For specific content types
        const contentType = prompt.includes('email') ? 'email' : 
                           prompt.includes('blog') ? 'blog' : 
                           prompt.includes('social') ? 'social' : 
                           prompt.includes('ad') ? 'ad' : 
                           prompt.includes('code') ? 'code' : 'creative';
        resultText = await generateContent(contentType, prompt, {
          provider,
          tone: 'professional',
          length: 'medium'
        });
      } else {
        // Standard text generation
        resultText = await generate({
          prompt,
          provider: provider as any,
          model,
          temperature,
          max_tokens: maxTokens,
          system_prompt: systemPrompt || undefined
        });
      }
      const generationResult: GenerationResult = {
        text: resultText,
        tokens_used: 0, // Will be filled by the service
        cost: 0, // Will be filled by the service
        model,
        provider,
        response_time_ms: 0
      };
      setResult(generationResult);
      onGenerate?.(generationResult);
    } catch (err: unknown) {
      console.error('Erro na geração unificada:', err);
    }
  };
  const contentTypes = [
    { value: 'text', label: 'Texto Geral' },
    { value: 'content', label: 'Conteúdo Específico' },
    { value: 'code', label: 'Código' },
    { value: 'analysis', label: 'Análise de Texto' }
  ];
  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <Card.Title>🤖 Geração de Conteúdo IA</Card.Title>
          <p className="text-sm text-gray-600 mt-1">
            Gere conteúdo usando OpenAI, Claude ou Gemini
          </p>
        </Card.Header>
        <Card.Content className="space-y-4">
          {/* Provider and Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Provider</label>
              <AIProviderSelector value={provider} onChange={setProvider} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Conteúdo</label>
              <Select 
                value={type} 
                onChange={(value) => setType(value)}
                options={contentTypes}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Modelo</label>
              <Input 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
                placeholder="Modelo específico"
              />
            </div>
          </div>
          {/* Main Prompt */}
          <div>
            <label className="block text-sm font-medium mb-2">Prompt Principal</label>
            <Textarea 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)} 
              placeholder="Descreva o que deseja gerar..."
              rows={4}
              className="min-h-[100px]"
            />
          </div>
          {/* Advanced Options */}
          <details className="border rounded-lg p-4">
            <summary className="cursor-pointer font-medium">⚙️ Opções Avançadas</summary>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">System Prompt</label>
                <Textarea 
                  value={systemPrompt} 
                  onChange={(e) => setSystemPrompt(e.target.value)} 
                  placeholder="Instruções do sistema (opcional)"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Temperatura: {temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Preciso</span>
                    <span>Criativo</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Tokens</label>
                  <Input 
                    type="number"
                    value={maxTokens} 
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    min={100}
                    max={8000}
                  />
                </div>
              </div>
            </div>
          </details>
          {/* Provider Status */}
          {providers && Object.keys(providers).length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                ✅ {Object.keys(providers).length} providers disponíveis
              </p>
            </div>
          )}
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">❌ {error}</p>
            </div>
          )}
        </Card.Content>
        <Card.Footer>
          <Button 
            onClick={handleGenerate} 
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? 'Gerando...' : '✨ Gerar Conteúdo'}
          </Button>
        </Card.Footer>
      </Card>
      {/* Results Display */}
      {result && (
        <Card>
          <Card.Header>
            <Card.Title>📝 Resultado Gerado</Card.Title>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <span>🤖 {result.provider}</span>
              <span>🔧 {result.model}</span>
              {result.tokens_used > 0 && <span>🎯 {result.tokens_used} tokens</span>}
              {result.cost > 0 && <span>💰 ${result.cost.toFixed(4)}</span>}
              {result.response_time_ms && <span>⚡ {result.response_time_ms}ms</span>}
            </div>
          </Card.Header>
          <Card.Content>
            <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
              {result.text}
            </div>
          </Card.Content>
          <Card.Footer>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigator.clipboard.writeText(result.text)}
              >
                📋 Copiar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setResult(null)}
              >
                🗑️ Limpar
              </Button>
            </div>
          </Card.Footer>
        </Card>
      )}
      {loading && <LoadingSpinner text="Gerando conteúdo com IA..." />}
    </div>
  );
});
export default UnifiedGenerationInterface;
