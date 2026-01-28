import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

interface UniverseProjectCreatorProps {
  auth?: any;
}

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  blocks: number;
  features: string[];
}

const UniverseProjectCreator: React.FC<UniverseProjectCreatorProps> = ({ auth }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [projectType, setProjectType] = useState<'template' | 'custom'>('template');

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    template: '',
    type: 'template',
    settings: {
      enableAI: true,
      enableAnalytics: true,
      enableCollaboration: true,
      enableVersioning: true
    }
  });

  const templates: ProjectTemplate[] = [
    {
      id: 'ecommerce',
      name: 'E-commerce Platform',
      description: 'Plataforma completa de e-commerce com integração de pagamentos',
      icon: '🛒',
      color: 'bg-blue-500',
      blocks: 24,
      features: ['Payment Gateway', 'Inventory Management', 'Order Tracking', 'Analytics']
    },
    {
      id: 'marketing',
      name: 'Marketing Automation',
      description: 'Automação de marketing com campanhas e segmentação',
      icon: '📧',
      color: 'bg-green-500',
      blocks: 18,
      features: ['Email Campaigns', 'Lead Scoring', 'A/B Testing', 'CRM Integration']
    },
    {
      id: 'analytics',
      name: 'Data Analytics Hub',
      description: 'Hub de análise de dados com dashboards interativos',
      icon: '📊',
      color: 'bg-purple-500',
      blocks: 32,
      features: ['Real-time Analytics', 'Data Visualization', 'Machine Learning', 'Reports']
    },
    {
      id: 'workflow',
      name: 'Workflow Management',
      description: 'Gerenciamento de fluxos de trabalho e processos',
      icon: '🔄',
      color: 'bg-orange-500',
      blocks: 20,
      features: ['Process Automation', 'Task Management', 'Approval Workflows', 'Notifications']
    },
    {
      id: 'ai-lab',
      name: 'AI Laboratory',
      description: 'Laboratório de inteligência artificial e machine learning',
      icon: '🤖',
      color: 'bg-red-500',
      blocks: 28,
      features: ['Model Training', 'Data Processing', 'AI Models', 'API Integration']
    },
    {
      id: 'custom',
      name: 'Projeto Personalizado',
      description: 'Crie seu projeto do zero com blocos personalizados',
      icon: '⚙️',
      color: 'bg-gray-500',
      blocks: 0,
      features: ['Custom Blocks', 'Flexible Architecture', 'Full Control']
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/projects/universe/create', {
      onSuccess: () => {
        // Redirect to interface after creation
        window.location.href = '/projects/universe/interface';
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head title="Criar Projeto Universe - xWin Dash" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Criar Projeto Universe
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Escolha um template ou crie seu projeto personalizado
          </p>
        </div>

        {/* Project Type Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            📋 Tipo de Projeto
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setProjectType('template')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                projectType === 'template'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Template</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use um template pré-configurado
                </p>
              </div>
            </button>
            
            <button
              onClick={() => setProjectType('custom')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                projectType === 'custom'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">⚙️</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Personalizado</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Crie seu projeto do zero
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        {projectType === 'template' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              🎨 Escolha um Template
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{template.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {template.description}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {template.blocks} blocos
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {template.features.map((feature, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                        • {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            📝 Detalhes do Projeto
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome do Projeto
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Digite o nome do projeto"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Template Selecionado
              </label>
              <input
                type="text"
                value={selectedTemplate || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                placeholder="Selecione um template"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Descreva o propósito do projeto"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              ⚙️ Configurações
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.settings.enableAI}
                  onChange={(e) => setData('settings', { ...data.settings, enableAI: e.target.checked })}
                  className="mr-3"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">🤖 Inteligência Artificial</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.settings.enableAnalytics}
                  onChange={(e) => setData('settings', { ...data.settings, enableAnalytics: e.target.checked })}
                  className="mr-3"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">📊 Analytics</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.settings.enableCollaboration}
                  onChange={(e) => setData('settings', { ...data.settings, enableCollaboration: e.target.checked })}
                  className="mr-3"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">👥 Colaboração</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={data.settings.enableVersioning}
                  onChange={(e) => setData('settings', { ...data.settings, enableVersioning: e.target.checked })}
                  className="mr-3"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">📝 Versionamento</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={processing || !selectedTemplate}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {processing ? 'Criando...' : '🚀 Criar Projeto'}
            </button>
            
            <Link
              href="/projects/universe"
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>

        {/* Preview */}
        {selectedTemplate && (
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">
              👀 Preview do Projeto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Informações Básicas</h4>
                <ul className="text-sm space-y-1">
                  <li>• Nome: {data.name || 'Nome do projeto'}</li>
                  <li>• Template: {templates.find(t => t.id === selectedTemplate)?.name}</li>
                  <li>• Blocos: {templates.find(t => t.id === selectedTemplate)?.blocks}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Configurações Ativas</h4>
                <ul className="text-sm space-y-1">
                  {data.settings.enableAI && <li>• 🤖 IA Habilitada</li>}
                  {data.settings.enableAnalytics && <li>• 📊 Analytics Ativo</li>}
                  {data.settings.enableCollaboration && <li>• 👥 Colaboração</li>}
                  {data.settings.enableVersioning && <li>• 📝 Versionamento</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniverseProjectCreator;