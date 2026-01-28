/**
 * Página de criação do módulo AI
 * Formulário para criar novas gerações ou configurar provedores
 */
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, Brain, Settings } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { useAI } from '../hooks';
import { AIProvider, AIGenerationType } from '../types';

interface AICreatePageProps {
  auth?: { user?: { id: string; name: string; email: string; }; };
  type: 'generation' | 'provider' | 'template';
}

const AICreatePage: React.FC<AICreatePageProps> = ({ 
  auth, 
  type 
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    prompt: '',
    provider: '',
    model: '',
    temperature: 0.7,
    max_tokens: 1000,
    description: ''
  });

  const { generation, providers } = useAI();
  const availableProviders = providers.getAvailableProviders();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (type === 'generation') {
        await generation.generateText({
          prompt: formData.prompt,
          provider: formData.provider as AIProvider,
          model: formData.model,
          temperature: formData.temperature,
          max_tokens: formData.max_tokens
        });
      }
      
      // Redirecionar após sucesso
      window.location.href = '/ai';
    } catch (error) {
      console.error('Erro ao criar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'temperature' || name === 'max_tokens' ? parseFloat(value) : value
    }));
  };

  const getTitle = () => {
    switch (type) {
      case 'generation': return 'Nova Geração';
      case 'provider': return 'Configurar Provedor';
      case 'template': return 'Novo Template';
      default: return 'Novo Item';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'generation': return 'Crie uma nova geração de conteúdo com IA';
      case 'provider': return 'Configure um novo provedor de IA';
      case 'template': return 'Crie um template para gerações';
      default: return 'Crie um novo item';
    }
  };

  return (
    <PageTransition type="fade" duration={500}>
      <AuthenticatedLayout user={auth?.user}>
        <Head title={`${getTitle()} - AI - xWin Dash`} />
        <PageLayout>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Link href="/ai">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {getTitle()}
                </h1>
                <p className="text-gray-600 mt-1">
                  {getDescription()}
                </p>
              </div>
            </div>

            {/* Form */}
            <Card>
              <Card.Content className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {type === 'generation' && (
                    <>
                      <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                          Prompt *
                        </label>
                        <textarea
                          id="prompt"
                          name="prompt"
                          value={formData.prompt}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Digite seu prompt aqui..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
                            Provedor *
                          </label>
                          <select
                            id="provider"
                            name="provider"
                            value={formData.provider}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Selecione um provedor</option>
                            {availableProviders.map(provider => (
                              <option key={provider} value={provider}>
                                {provider}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                            Modelo
                          </label>
                          <select
                            id="model"
                            name="model"
                            value={formData.model}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Modelo padrão</option>
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                            <option value="claude-3-opus">Claude 3 Opus</option>
                            <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                            <option value="gemini-pro">Gemini Pro</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                            Temperature: {formData.temperature}
                          </label>
                          <input
                            type="range"
                            id="temperature"
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleInputChange}
                            min="0"
                            max="2"
                            step="0.1"
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Conservador (0)</span>
                            <span>Criativo (2)</span>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="max_tokens" className="block text-sm font-medium text-gray-700 mb-2">
                            Max Tokens
                          </label>
                          <input
                            type="number"
                            id="max_tokens"
                            name="max_tokens"
                            value={formData.max_tokens}
                            onChange={handleInputChange}
                            min="1"
                            max="4000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {type === 'provider' && (
                    <>
                      <div>
                        <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
                          Provedor *
                        </label>
                        <select
                          id="provider"
                          name="provider"
                          value={formData.provider}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione um provedor</option>
                          <option value="openai">OpenAI</option>
                          <option value="claude">Claude (Anthropic)</option>
                          <option value="gemini">Google Gemini</option>
                          <option value="cohere">Cohere</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="api_key" className="block text-sm font-medium text-gray-700 mb-2">
                          API Key *
                        </label>
                        <input
                          type="password"
                          id="api_key"
                          name="api_key"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Digite sua API key"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descrição opcional..."
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Link href="/ai">
                      <Button variant="outline" type="button">
                        Cancelar
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner />
                          <span className="ml-2">Criando...</span>
                        </>
                      ) : (
                        <>
                          {type === 'generation' ? (
                            <Brain className="w-4 h-4 mr-2" />
                          ) : (
                            <Settings className="w-4 h-4 mr-2" />
                          )}
                          Criar {type}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>

            {/* Quick Tips */}
            <Card>
              <Card.Header>
                <Card.Title>Dicas Rápidas</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {type === 'generation' && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-blue-100 rounded-full mt-1">
                          <Plus className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Seja específico no prompt</p>
                          <p className="text-sm text-gray-600">
                            Prompts mais específicos geram resultados melhores.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-green-100 rounded-full mt-1">
                          <Plus className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Ajuste a temperature</p>
                          <p className="text-sm text-gray-600">
                            Use valores baixos para respostas precisas e altos para criatividade.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {type === 'provider' && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-blue-100 rounded-full mt-1">
                          <Plus className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Mantenha sua API key segura</p>
                          <p className="text-sm text-gray-600">
                            Nunca compartilhe sua API key com terceiros.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card.Content>
            </Card>
          </div>
        </PageLayout>
      </AuthenticatedLayout>
    </PageTransition>
  );
};

export default AICreatePage;
