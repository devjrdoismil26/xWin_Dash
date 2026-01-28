import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

interface DashboardProps {
  auth?: any;
}

const Dashboard: React.FC<DashboardProps> = ({ auth }) => {
  const [stats, setStats] = useState({
    totalProjects: 12,
    activeProjects: 8,
    totalBlocks: 156,
    totalConnections: 89,
    totalUsers: 24,
    totalTemplates: 45
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'project_created',
      message: 'Novo projeto "E-commerce Platform" criado',
      time: '2 minutos atrás',
      icon: '📁'
    },
    {
      id: 2,
      type: 'block_added',
      message: 'Bloco Analytics adicionado ao projeto',
      time: '15 minutos atrás',
      icon: '📊'
    },
    {
      id: 3,
      type: 'connection_made',
      message: 'Conexão estabelecida entre Dashboard e AI Lab',
      time: '1 hora atrás',
      icon: '🔗'
    },
    {
      id: 4,
      type: 'user_joined',
      message: 'Novo usuário "João Silva" adicionado',
      time: '2 horas atrás',
      icon: '👤'
    }
  ]);

  const [topProjects, setTopProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Platform',
      blocks: 24,
      connections: 18,
      status: 'active',
      lastActivity: '2 min atrás'
    },
    {
      id: 2,
      name: 'Marketing Automation',
      blocks: 18,
      connections: 12,
      status: 'active',
      lastActivity: '15 min atrás'
    },
    {
      id: 3,
      name: 'Data Analytics Hub',
      blocks: 32,
      connections: 25,
      status: 'active',
      lastActivity: '1 hora atrás'
    }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 67,
    diskUsage: 23,
    networkLatency: 12
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head title="Universe Dashboard - xWin Dash" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Universe Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visão geral completa do seu ecossistema Universe
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📁</div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Projetos</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProjects}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🟢</div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Ativos</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeProjects}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🧩</div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Blocos</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBlocks}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🔗</div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Conexões</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalConnections}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👥</div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Usuários</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📋</div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Templates</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTemplates}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                📈 Atividade Recente
              </h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Link
                  href="/projects/universe/interface"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  Ver todas as atividades →
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                ⚡ Ações Rápidas
              </h2>
              
              <div className="space-y-3">
                <Link
                  href="/projects/universe/create"
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
                >
                  📁 Criar Projeto
                </Link>
                
                <Link
                  href="/projects/universe/interface"
                  className="block w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
                >
                  🎨 Abrir Interface
                </Link>
                
                <Link
                  href="/projects/universe/marketplace"
                  className="block w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
                >
                  🛒 Marketplace
                </Link>
                
                <Link
                  href="/projects/universe/kanban"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg text-center font-medium transition-colors"
                >
                  📋 Kanban Board
                </Link>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                📊 Performance
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>CPU</span>
                    <span>{performanceMetrics.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${performanceMetrics.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Memória</span>
                    <span>{performanceMetrics.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${performanceMetrics.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Disco</span>
                    <span>{performanceMetrics.diskUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${performanceMetrics.diskUsage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Latência</span>
                    <span>{performanceMetrics.networkLatency}ms</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${performanceMetrics.networkLatency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Projects */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              🏆 Projetos em Destaque
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topProjects.map((project) => (
                <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Blocos:</span>
                      <span>{project.blocks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conexões:</span>
                      <span>{project.connections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Última atividade:</span>
                      <span>{project.lastActivity}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Link
                      href="/projects/universe/interface"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      Abrir projeto →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;