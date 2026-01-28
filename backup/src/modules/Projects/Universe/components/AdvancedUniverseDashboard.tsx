import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useFormValidation } from '../../../../hooks/useFormValidation';
import { useAdvancedNotifications } from '../../../../hooks/useAdvancedNotifications';
import { useLoadingStates } from '../../../../hooks/useLoadingStates';
import {
  Rocket, Globe, Zap, Star, Users, Calendar, Clock, Target,
  BarChart3, TrendingUp, TrendingDown, Activity, CheckCircle2,
  AlertCircle, XCircle, Plus, Search, Filter, Grid, List,
  Eye, Edit2, Trash2, Share2, Download, Upload, Copy,
  Layers, Package, Settings, Bell, MessageSquare, Files,
  Workflow, GitBranch, Shield, Lock, Unlock, Key,
  Database, Server, Cloud, Monitor, Mobile, Tablet,
  Code, Palette, Brush, Camera, Video, Mic, Image,
  Map, Navigation, Compass, Flag, Award, Trophy,
  Lightning, Fire, Sparkles, Wand2, Brain, Robot, X
} from 'lucide-react';
// Interfaces
interface UniverseProject {
  id: string;
  name: string;
  description: string;
  category: 'web' | 'mobile' | 'desktop' | 'ai' | 'blockchain' | 'iot';
  status: 'planning' | 'development' | 'testing' | 'deployed' | 'maintenance' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  team: TeamMember[];
  technologies: Technology[];
  timeline: {
    startDate: string;
    endDate: string;
    phases: ProjectPhase[];
  };
  metrics: {
    codeQuality: number;
    performance: number;
    security: number;
    userSatisfaction: number;
  };
  resources: {
    budget: number;
    spent: number;
    timeAllocated: number;
    timeSpent: number;
  };
  deployments: Deployment[];
  issues: Issue[];
  features: Feature[];
  integrations: Integration[];
  createdAt: string;
  updatedAt: string;
}
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
  availability: number;
  contribution: number;
}
interface Technology {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'ai' | 'mobile';
  version: string;
  icon: string;
  expertise: number;
}
interface ProjectPhase {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'delayed';
  progress: number;
  startDate: string;
  endDate: string;
  deliverables: string[];
  dependencies: string[];
}
interface Deployment {
  id: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  status: 'success' | 'failed' | 'in-progress';
  timestamp: string;
  url?: string;
  metrics: {
    buildTime: number;
    deployTime: number;
    size: number;
    performance: number;
  };
}
interface Issue {
  id: string;
  title: string;
  type: 'bug' | 'feature' | 'enhancement' | 'security';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignee?: string;
  createdAt: string;
  estimatedHours: number;
}
interface Feature {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'development' | 'testing' | 'completed';
  complexity: 'simple' | 'medium' | 'complex';
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
}
interface Integration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'database' | 'service';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  dataFlow: 'inbound' | 'outbound' | 'bidirectional';
}
interface UniverseAnalytics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overbudgetProjects: number;
  averageCompletion: number;
  totalBudget: number;
  spentBudget: number;
  teamUtilization: number;
  codeQualityScore: number;
  recentActivity: ActivityEvent[];
}
interface ActivityEvent {
  id: string;
  type: 'project_created' | 'deployment' | 'issue_resolved' | 'milestone_reached' | 'team_update';
  projectId: string;
  projectName: string;
  message: string;
  timestamp: string;
  user: string;
  metadata: Record<string, any>;
}
const AdvancedUniverseDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { showNotification, showError, showSuccess } = useAdvancedNotifications();
  const { isLoading, setLoading } = useLoadingStates();
  // Estados principais
  const [projects, setProjects] = useState<UniverseProject[]>([]);
  const [analytics, setAnalytics] = useState<UniverseAnalytics | null>(null);
  const [selectedProject, setSelectedProject] = useState<UniverseProject | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'kanban' | 'timeline'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'priority' | 'date'>('date');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  // Templates de projeto
  const projectTemplates = [
    {
      id: 'web-app',
      name: 'Web Application',
      category: 'web',
      description: 'Modern web application with React/Next.js',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      estimatedDays: 60,
      complexity: 'medium'
    },
    {
      id: 'mobile-app',
      name: 'Mobile Application',
      category: 'mobile',
      description: 'Cross-platform mobile app with React Native',
      technologies: ['React Native', 'TypeScript', 'Firebase'],
      estimatedDays: 90,
      complexity: 'complex'
    },
    {
      id: 'ai-platform',
      name: 'AI Platform',
      category: 'ai',
      description: 'Intelligent platform with ML capabilities',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'React'],
      estimatedDays: 120,
      complexity: 'complex'
    },
    {
      id: 'blockchain-app',
      name: 'Blockchain Application',
      category: 'blockchain',
      description: 'Decentralized application with smart contracts',
      technologies: ['Solidity', 'Web3.js', 'React', 'Node.js'],
      estimatedDays: 100,
      complexity: 'complex'
    }
  ];
  // Dados simulados
  useEffect(() => {
    const loadData = async () => {
      setLoading('projects', true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockProjects: UniverseProject[] = [
        {
          id: '1',
          name: 'E-commerce Platform Revolution',
          description: 'Plataforma de e-commerce com IA integrada para personalização de experiência',
          category: 'web',
          status: 'development',
          priority: 'high',
          progress: 67,
          team: [
            {
              id: '1',
              name: 'Ana Silva',
              role: 'Frontend Lead',
              avatar: '/avatars/ana.jpg',
              skills: ['React', 'TypeScript', 'UI/UX'],
              availability: 90,
              contribution: 85
            },
            {
              id: '2',
              name: 'Carlos Mendes',
              role: 'Backend Developer',
              avatar: '/avatars/carlos.jpg',
              skills: ['Node.js', 'Python', 'PostgreSQL'],
              availability: 80,
              contribution: 92
            }
          ],
          technologies: [
            {
              id: '1',
              name: 'React',
              category: 'frontend',
              version: '18.2.0',
              icon: '/tech/react.svg',
              expertise: 95
            },
            {
              id: '2',
              name: 'Node.js',
              category: 'backend',
              version: '18.17.0',
              icon: '/tech/nodejs.svg',
              expertise: 88
            }
          ],
          timeline: {
            startDate: '2024-01-15',
            endDate: '2024-04-15',
            phases: [
              {
                id: '1',
                name: 'Planning & Design',
                status: 'completed',
                progress: 100,
                startDate: '2024-01-15',
                endDate: '2024-02-01',
                deliverables: ['Wireframes', 'Design System', 'Architecture'],
                dependencies: []
              },
              {
                id: '2',
                name: 'Core Development',
                status: 'active',
                progress: 75,
                startDate: '2024-02-01',
                endDate: '2024-03-15',
                deliverables: ['User Auth', 'Product Catalog', 'Shopping Cart'],
                dependencies: ['1']
              }
            ]
          },
          metrics: {
            codeQuality: 92,
            performance: 88,
            security: 95,
            userSatisfaction: 0
          },
          resources: {
            budget: 150000,
            spent: 98750,
            timeAllocated: 480,
            timeSpent: 312
          },
          deployments: [
            {
              id: '1',
              environment: 'development',
              version: '1.2.3',
              status: 'success',
              timestamp: '2024-01-20T14:30:00Z',
              url: 'https://dev-ecommerce.exemplo.com',
              metrics: {
                buildTime: 180,
                deployTime: 45,
                size: 2.4,
                performance: 88
              }
            }
          ],
          issues: [
            {
              id: '1',
              title: 'Performance otimization needed',
              type: 'enhancement',
              priority: 'medium',
              status: 'in-progress',
              assignee: 'ana-silva',
              createdAt: '2024-01-18',
              estimatedHours: 8
            }
          ],
          features: [
            {
              id: '1',
              name: 'AI Product Recommendations',
              description: 'Machine learning based product recommendation engine',
              status: 'development',
              complexity: 'complex',
              estimatedHours: 40,
              actualHours: 28,
              dependencies: ['product-catalog']
            }
          ],
          integrations: [
            {
              id: '1',
              name: 'Payment Gateway',
              type: 'api',
              status: 'connected',
              lastSync: '2024-01-20T10:15:00Z',
              dataFlow: 'bidirectional'
            }
          ],
          createdAt: '2024-01-15',
          updatedAt: '2024-01-20'
        },
        {
          id: '2',
          name: 'Mobile CRM Assistant',
          description: 'Aplicativo móvel para gestão de relacionamento com clientes',
          category: 'mobile',
          status: 'testing',
          priority: 'medium',
          progress: 89,
          team: [
            {
              id: '3',
              name: 'Bruno Costa',
              role: 'Mobile Developer',
              avatar: '/avatars/bruno.jpg',
              skills: ['React Native', 'JavaScript', 'iOS', 'Android'],
              availability: 100,
              contribution: 94
            }
          ],
          technologies: [
            {
              id: '3',
              name: 'React Native',
              category: 'mobile',
              version: '0.72.6',
              icon: '/tech/react-native.svg',
              expertise: 92
            }
          ],
          timeline: {
            startDate: '2023-11-01',
            endDate: '2024-02-01',
            phases: [
              {
                id: '1',
                name: 'Development',
                status: 'completed',
                progress: 100,
                startDate: '2023-11-01',
                endDate: '2023-12-15',
                deliverables: ['Core Features', 'UI Implementation'],
                dependencies: []
              },
              {
                id: '2',
                name: 'Testing & QA',
                status: 'active',
                progress: 75,
                startDate: '2023-12-15',
                endDate: '2024-02-01',
                deliverables: ['Test Coverage', 'Bug Fixes', 'Performance'],
                dependencies: ['1']
              }
            ]
          },
          metrics: {
            codeQuality: 88,
            performance: 94,
            security: 91,
            userSatisfaction: 4.6
          },
          resources: {
            budget: 80000,
            spent: 71200,
            timeAllocated: 280,
            timeSpent: 245
          },
          deployments: [],
          issues: [],
          features: [],
          integrations: [],
          createdAt: '2023-11-01',
          updatedAt: '2024-01-19'
        }
      ];
      setProjects(mockProjects);
      setAnalytics({
        totalProjects: 12,
        activeProjects: 8,
        completedProjects: 3,
        overbudgetProjects: 1,
        averageCompletion: 76.3,
        totalBudget: 850000,
        spentBudget: 542300,
        teamUtilization: 87.5,
        codeQualityScore: 91.2,
        recentActivity: [
          {
            id: '1',
            type: 'deployment',
            projectId: '1',
            projectName: 'E-commerce Platform Revolution',
            message: 'Deployed version 1.2.3 to development environment',
            timestamp: '2024-01-20T14:30:00Z',
            user: 'Carlos Mendes',
            metadata: { version: '1.2.3', environment: 'development' }
          },
          {
            id: '2',
            type: 'milestone_reached',
            projectId: '2',
            projectName: 'Mobile CRM Assistant',
            message: 'Reached 89% completion milestone',
            timestamp: '2024-01-19T16:20:00Z',
            user: 'Bruno Costa',
            metadata: { milestone: '89%' }
          }
        ]
      });
      setLoading('projects', false);
    };
    loadData();
  }, [setLoading]);
  // Filtros e ordenação
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(project => {
      const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    });
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return b.progress - a.progress;
        case 'priority': {
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'date':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
  }, [projects, filterCategory, filterStatus, searchQuery, sortBy]);
  // Handlers
  const handleCreateProject = useCallback((template?: any) => {
    setShowCreateModal(true);
  }, []);
  const handleProjectAction = useCallback(async (action: string, projectId: string) => {
    setLoading(action, true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      switch (action) {
        case 'deploy':
          showSuccess('Projeto implantado com sucesso!');
          break;
        case 'archive':
          showSuccess('Projeto arquivado');
          break;
        case 'duplicate':
          showSuccess('Projeto duplicado');
          break;
        default:
          showSuccess('Ação executada com sucesso');
      }
    } catch (error) {
      showError('Erro ao executar ação');
    } finally {
      setLoading(action, false);
    }
  }, [setLoading, showSuccess, showError]);
  const getStatusColor = (status: string) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      development: 'bg-yellow-100 text-yellow-800',
      testing: 'bg-purple-100 text-purple-800',
      deployed: 'bg-green-100 text-green-800',
      maintenance: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };
  if (isLoading.projects) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="text-gray-600">Carregando projetos do universo...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-6">
      {/* Header Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center">
            <Rocket className="h-8 w-8 mb-2" />
            <div className="ml-4">
              <p className="text-purple-100">Projetos Ativos</p>
              <p className="text-3xl font-bold">{analytics?.activeProjects}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.completedProjects}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Progresso Médio</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.averageCompletion}%</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Utilização Equipe</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.teamUtilization}%</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Qualidade Código</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.codeQualityScore}</p>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Controles */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todas Categorias</option>
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
              <option value="ai">IA</option>
              <option value="blockchain">Blockchain</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos Status</option>
              <option value="planning">Planejamento</option>
              <option value="development">Desenvolvimento</option>
              <option value="testing">Testes</option>
              <option value="deployed">Implantado</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-purple-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded ${viewMode === 'kanban' 
                  ? 'bg-white shadow-sm text-purple-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Layers className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded ${viewMode === 'timeline' 
                  ? 'bg-white shadow-sm text-purple-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Calendar className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setShowAIAssistant(!showAIAssistant)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <Brain className="h-4 w-4" />
              <span>IA Assistant</span>
            </button>
            <button
              onClick={() => handleCreateProject()}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Projeto</span>
            </button>
          </div>
        </div>
      </div>
      {/* Projetos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Project Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                        {project.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {project.description}
                    </p>
                  </div>
                  <div className={`p-1 rounded ${getPriorityColor(project.priority)}`}>
                    <Flag className="h-4 w-4" />
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progresso</span>
                    <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                    />
                  </div>
                </div>
                {/* Team Avatars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member) => (
                      <div
                        key={member.id}
                        className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{Math.round((project.resources.timeSpent / project.resources.timeAllocated) * 100)}%</span>
                  </div>
                </div>
                {/* Technologies */}
                <div className="flex items-center space-x-2 mb-4">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <div
                      key={tech.id}
                      className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                    >
                      {tech.name}
                    </div>
                  ))}
                  {project.technologies.length > 4 && (
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      +{project.technologies.length - 4}
                    </div>
                  )}
                </div>
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Qualidade</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {project.metrics.codeQuality}/100
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="text-xs text-gray-600">Performance</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {project.metrics.performance}/100
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleProjectAction('edit', project.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleProjectAction('duplicate', project.id)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {project.deployments.length > 0 && (
                      <button
                        onClick={() => handleProjectAction('deploy', project.id)}
                        className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700"
                      >
                        <Rocket className="h-4 w-4" />
                        <span>Deploy</span>
                      </button>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* AI Assistant Sidebar */}
      <AnimatePresence>
        {showAIAssistant && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-purple-50 to-blue-50 border-l border-gray-200 p-6 z-40 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>Universe AI Assistant</span>
              </h3>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span>Recomendações Inteligentes</span>
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Otimizar performance do projeto E-commerce</li>
                  <li>• Revisar timeline do Mobile CRM</li>
                  <li>• Adicionar testes automatizados</li>
                </ul>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Templates Sugeridos</h4>
                <div className="space-y-2">
                  {projectTemplates.slice(0, 2).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleCreateProject(template)}
                      className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-sm text-gray-900">{template.name}</div>
                      <div className="text-xs text-gray-600">{template.estimatedDays} dias estimados</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">Métricas Previstas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entregas esta semana:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projetos em risco:</span>
                    <span className="font-medium text-yellow-600">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Economia projetada:</span>
                    <span className="font-medium text-green-600">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Loading States */}
      {Object.entries(isLoading).some(([key, loading]) => loading && key !== 'projects') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-700">Processando...</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdvancedUniverseDashboard;
