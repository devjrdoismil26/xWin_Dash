import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface UniverseIndexProps {
  auth?: any;
}

const UniverseIndex: React.FC<UniverseIndexProps> = ({ auth }) => {
  const features = [
    {
      icon: '🎨',
      title: 'Canvas Interativo',
      description: 'Interface drag and drop para criar fluxos visuais',
      link: '/projects/universe/canvas'
    },
    {
      icon: '📊',
      title: 'Dashboard Avançado',
      description: 'Métricas e analytics em tempo real',
      link: '/projects/universe/dashboard'
    },
    {
      icon: '📋',
      title: 'Kanban Board',
      description: 'Gerenciamento de tarefas e projetos',
      link: '/projects/universe/kanban'
    },
    {
      icon: '🤖',
      title: 'DGD Panel',
      description: 'Painel de desenvolvimento guiado por dados',
      link: '/projects/universe/dgd'
    },
    {
      icon: '🛒',
      title: 'Marketplace',
      description: 'Blocos e componentes reutilizáveis',
      link: '/projects/universe/marketplace'
    },
    {
      icon: '⚙️',
      title: 'Workspace',
      description: 'Ambiente de trabalho integrado',
      link: '/projects/universe/workspace'
    }
  ];

  const quickActions = [
    {
      title: 'Criar Novo Projeto',
      description: 'Inicie um novo projeto Universe',
      link: '/projects/universe/create',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Abrir Interface',
      description: 'Acesse a interface principal',
      link: '/projects/universe/interface',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Ver Dashboard',
      description: 'Visualize métricas e estatísticas',
      link: '/projects/universe/dashboard',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head title="Universe - xWin Dash" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🌌 Universe
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Plataforma completa de desenvolvimento visual e automação
          </p>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.link}
                className={`${action.color} text-white px-6 py-3 rounded-lg font-medium transition-colors`}
              >
                {action.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Getting Started */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🚀 Começando com Universe
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Primeiros Passos
              </h3>
              <ol className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
                  Crie um novo projeto Universe
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
                  Configure seus blocos e componentes
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
                  Use o canvas para criar fluxos visuais
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">4</span>
                  Monitore progresso no dashboard
                </li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recursos Principais
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Drag & Drop Intuitivo
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Blocos Reutilizáveis
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Integração com APIs
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Analytics em Tempo Real
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Colaboração em Equipe
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Templates Pré-configurados
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              📚 Documentação Completa
            </h2>
            <p className="text-blue-100 mb-6">
              Aprenda a usar todas as funcionalidades do Universe com nossa documentação detalhada
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                📖 Guia de Início
              </button>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                🎥 Tutoriais em Vídeo
              </button>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                💬 Suporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniverseIndex;