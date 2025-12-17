/**
 * Componente UnifiedGenerationInterface - Interface Unificada de Geração de IA
 * @module modules/AI/components/UnifiedGenerationInterface
 * @description
 * Interface unificada para geração de conteúdo com IA, fornecendo suporte a múltiplos
 * tipos de geração (texto, conteúdo, imagem, código), seleção de provedor e modelo,
 * configuração de parâmetros (temperature, max_tokens, system_prompt), exibição de
 * resultados com métricas (tokens, custo, tempo de resposta) e integração com hooks
 * do módulo AI para operações de geração.
 * @since 1.0.0
 */
import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/Card'
import Select from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';
import Textarea from '@/shared/components/ui/Textarea';
import Input from '@/shared/components/ui/Input';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { useAI } from '@/modules/AI/hooks/useAI';
import AIProviderSelector from './AIProviderSelector';

/**
 * Interface GenerationResult - Resultado de geração
 * @interface GenerationResult
 * @property {string} text - Texto gerado
 * @property {number} tokens_used - Número de tokens usados
 * @property {number} cost - Custo da geração
 * @property {string} model - Modelo usado
 * @property {string} provider - Provedor usado
 * @property {number} [response_time_ms] - Tempo de resposta em ms (opcional)
 */
interface GenerationResult {
  text: string;
  tokens_used: number;
  cost: number;
  model: string;
  provider: string;
  response_time_ms?: number; }

/**
 * Interface AIGeneration - Dados de geração de IA
 * @interface AIGeneration
 * @property {string} type - Tipo de geração
 * @property {string} prompt - Prompt da geração
 * @property {string} provider - Provedor usado
 * @property {string} model - Modelo usado
 * @property {number} temperature - Temperatura usada
 * @property {number} maxTokens - Máximo de tokens
 * @property {string} [systemPrompt] - Prompt do sistema (opcional)
 * @property {GenerationResult} [result] - Resultado da geração (opcional)
 */
interface AIGeneration {
  type: string;
  prompt: string;
  provider: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  result?: GenerationResult; }

/**
 * Interface UnifiedGenerationInterfaceProps - Props do componente UnifiedGenerationInterface
 * @interface UnifiedGenerationInterfaceProps
 * @property {function} [onGenerate] - Função callback chamada ao gerar conteúdo (opcional)
 * @property {(data: AIGeneration) => void} [onGenerate] - Callback com dados da geração
 */
interface UnifiedGenerationInterfaceProps {
  onGenerate??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente UnifiedGenerationInterface - Interface Unificada de Geração de IA
 * @component
 * @description
 * Componente que renderiza interface unificada para geração de conteúdo com IA,
 * incluindo seleção de tipo, provedor, modelo, configuração de parâmetros e
 * exibição de resultados.
 * 
 * @param {UnifiedGenerationInterfaceProps} props - Props do componente
 * @returns {JSX.Element} Interface unificada de geração
 * 
 * @example
 * ```tsx
 * <UnifiedGenerationInterface 
 *   onGenerate={ (data: unknown) =>  }
 * />
 * ```
 */
const UnifiedGenerationInterface: React.FC<UnifiedGenerationInterfaceProps> = React.memo(function UnifiedGenerationInterface({ onGenerate }) {
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
      'gemini': 'gemini-1.5-pro'};

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
          provider: provider as string,
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
        response_time_ms: 0};

      setResult(generationResult);

      onGenerate?.(generationResult);

    } catch (err: unknown) {
      console.error('Erro na geração unificada:', err);

    } ;

  const contentTypes = [
    { value: 'text', label: 'Texto Geral' },
    { value: 'content', label: 'Conteúdo Específico' },
    { value: 'code', label: 'Código' },
    { value: 'analysis', label: 'Análise de Texto' }
  ];
  return (
            <div className=" ">$2</div><Card />
        <Card.Header />
          <Card.Title>🤖 Geração de Conteúdo IA</Card.Title>
          <p className="text-sm text-gray-600 mt-1" />
            Gere conteúdo usando OpenAI, Claude ou Gemini
          </p>
        </Card.Header>
        <Card.Content className="space-y-4" />
          {/* Provider and Type Selection */}
          <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium mb-2">Provider</label>
              <AIProviderSelector value={provider} onChange={setProvider} / /></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Tipo de Conteúdo</label>
              <Select 
                value={ type }
                onChange={ (value: unknown) => setType(value) }
                options={ contentTypes } /></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Modelo</label>
              <Input 
                value={ model }
                onChange={ (e: unknown) => setModel(e.target.value) }
                placeholder="Modelo específico" />
            </div>
          {/* Main Prompt */}
          <div>
           
        </div><label className="block text-sm font-medium mb-2">Prompt Principal</label>
            <Textarea 
              value={ prompt }
              onChange={ (e: unknown) => setPrompt(e.target.value) }
              placeholder="Descreva o que deseja gerar..."
              rows={ 4 }
              className="min-h-[100px]" />
          </div>
          {/* Advanced Options */}
          <details className="border rounded-lg p-4" />
            <summary className="cursor-pointer font-medium">⚙️ Opções Avançadas</summary>
            <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium mb-2">System Prompt</label>
                <Textarea 
                  value={ systemPrompt }
                  onChange={ (e: unknown) => setSystemPrompt(e.target.value) }
                  placeholder="Instruções do sistema (opcional)"
                  rows={ 2 } /></div><div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium mb-2" />
                    Temperatura: {temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={ temperature }
                    onChange={ (e: unknown) => setTemperature(parseFloat(e.target.value)) }
                    className="w-full" />
                  <div className=" ">$2</div><span>Preciso</span>
                    <span>Criativo</span></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Max Tokens</label>
                  <Input 
                    type="number"
                    value={ maxTokens }
                    onChange={ (e: unknown) => setMaxTokens(parseInt(e.target.value)) }
                    min={ 100 }
                    max={ 8000 } /></div></div>
          </details>
          {/* Provider Status */}
          {providers && Object.keys(providers).length > 0 && (
            <div className=" ">$2</div><p className="text-sm text-green-700" />
                ✅ {Object.keys(providers).length} providers disponíveis
              </p>
      </div>
    </>
  )}
          {/* Error Display */}
          {error && (
            <div className=" ">$2</div><p className="text-sm text-red-700">❌ {error}</p>
      </div>
    </>
  )}
        </Card.Content>
        <Card.Footer />
          <Button 
            onClick={ handleGenerate }
            disabled={ loading || !prompt.trim() }
            className="w-full" />
            {loading ? 'Gerando...' : '✨ Gerar Conteúdo'}
          </Button>
        </Card.Footer>
      </Card>
      {/* Results Display */}
      {result && (
        <Card />
          <Card.Header />
            <Card.Title>📝 Resultado Gerado</Card.Title>
            <div className=" ">$2</div><span>🤖 {result.provider}</span>
              <span>🔧 {result.model}</span>
              {result.tokens_used > 0 && <span>🎯 {result.tokens_used} tokens</span>}
              {result.cost > 0 && <span>💰 ${result.cost.toFixed(4)}</span>}
              {result.response_time_ms && <span>⚡ {result.response_time_ms}ms</span>}
            </div>
          </Card.Header>
          <Card.Content />
            <div className="{result.text}">$2</div>
            </div>
          </Card.Content>
          <Card.Footer />
            <div className=" ">$2</div><Button 
                variant="outline" 
                onClick={ () => navigator.clipboard.writeText(result.text)  }>
                📋 Copiar
              </Button>
              <Button 
                variant="outline" 
                onClick={ () => setResult(null)  }>
                🗑️ Limpar
              </Button></div></Card.Footer>
      </Card>
    </>
  )}
      {loading && <LoadingSpinner text="Gerando conteúdo com IA..." />}
    </div>);

});

export default UnifiedGenerationInterface;
