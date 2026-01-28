import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
// import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';
import { 
  Sparkles, 
  ArrowLeft,
  Home,
  LayoutGrid,
  BarChart3,
  Target,
  Camera,
  FileText,
  Layers,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Settings,
  Play,
  Pause,
  Save,
  Download,
  Upload,
  Share2,
  Eye,
  Edit,
  Trash2,
  Copy,
  Star,
  Search,
  Filter,
  RefreshCw,
  X,
  ChevronRight,
  ChevronDown,
  Globe,
  Cpu,
  Database,
  Network,
  Workflow,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Code,
  Terminal,
  File,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet,
  FilePresentation,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint,
  FileCheck,
  FileX,
  FilePlus,
  FileMinus,
  FileEdit,
  FileSearch,
  FileDownload,
  FileUpload,
  FileShare,
  FileLock,
  FileUnlock,
  FileHeart,
  FileStar,
  FileBookmark,
  FileBookmarkCheck,
  FileBookmarkX,
  FileBookmarkPlus,
  FileBookmarkMinus,
  FileBookmarkEdit,
  FileBookmarkSearch,
  FileBookmarkDownload,
  FileBookmarkUpload,
  FileBookmarkShare,
  FileBookmarkLock,
  FileBookmarkUnlock,
  FileBookmarkHeart,
  FileBookmarkStar
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from "@/components/ui/Card";
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { LoadingSpinner as LoadingSpinnerComponent, LoadingSkeleton, TableLoadingSkeleton } from '@/components/ui/LoadingStates';
// import { AnimatedCounter, Animated } from '@/components/ui/AdvancedAnimations';
// import { ResponsiveGrid, ResponsiveContainer, ShowOn } from '@/components/ui/ResponsiveSystem';
import { ProgressBar, CircularProgress, OperationProgress } from '@/components/ui/AdvancedProgress';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState as ErrorStateComponent } from '@/components/ui/ErrorState';
import Tooltip from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';

interface UniverseInterfaceProps {
  auth?: any;
  onNavigateToProject?: (project: any) => void;
  onNavigateToDashboard?: () => void;
}

const UniverseInterface: React.FC<UniverseInterfaceProps> = ({ 
  auth,
  onNavigateToProject,
  onNavigateToDashboard
}) => {
  const [useAdvancedInterface, setUseAdvancedInterface] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [activeTab, setActiveTab] = useState<'instances' | 'templates' | 'snapshots' | 'canvas' | 'kanban' | 'dgd'>('instances');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data - in real implementation this would come from hooks
  const [instances, setInstances] = useState([
    {
      id: '1',
      name: 'Marketing Universe',
      description: 'Advanced marketing automation universe',
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T15:30:00Z'
    },
    {
      id: '2',
      name: 'Sales Pipeline',
      description: 'Complete sales management universe',
      status: 'inactive',
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-18T12:00:00Z'
    }
  ]);

  const [snapshots, setSnapshots] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [stats, setStats] = useState({
    total_instances: 2,
    active_instances: 1,
    total_templates: 5,
    total_snapshots: 3,
    success_rate: 85.5
  });

  const [blocks, setBlocks] = useState([
    {
      id: 'block-1',
      name: 'Lead Capture',
      type: 'form',
      position: { x: 100, y: 100 },
      data: { label: 'Lead Capture Form', description: 'Captures new leads' },
      status: 'active',
      configuration: {},
      connections: [],
      metadata: {
        category: 'core',
        version: '1.0.0',
        dependencies: [],
        permissions: [],
        tags: ['marketing', 'leads']
      }
    },
    {
      id: 'block-2',
      name: 'Email Campaign',
      type: 'campaign',
      position: { x: 300, y: 100 },
      data: { label: 'Email Campaign', description: 'Automated email sequences' },
      status: 'active',
      configuration: {},
      connections: [],
      metadata: {
        category: 'marketing',
        version: '1.0.0',
        dependencies: [],
        permissions: [],
        tags: ['email', 'automation']
      }
    }
  ]);

  const [connections, setConnections] = useState([]);
  const [canvasState, setCanvasState] = useState({
    zoom: 1,
    panX: 0,
    panY: 0
  });
  const [settings, setSettings] = useState({
    snapToGrid: true,
    showGrid: true,
    autoSave: true,
    maxBlocks: 100,
    maxConnections: 50
  });

  const [newInstance, setNewInstance] = useState({
    name: '',
    description: '',
    template_id: '',
  });

  const handleCreateInstance = async () => {
    if (newInstance.name.trim()) {
      try {
        setLoading(true);
        // In real implementation, this would call the universe service
        const newInstanceData = {
          id: Date.now().toString(),
          name: newInstance.name,
          description: newInstance.description,
          status: 'inactive',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setInstances(prev => [newInstanceData, ...prev]);
        setNewInstance({ name: '', description: '', template_id: '' });
        setShowCreateModal(false);
      } catch (error) {
        setError('Failed to create instance');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStartStop = async (instance: any) => {
    try {
      setLoading(true);
      setInstances(prev => prev.map(inst => 
        inst.id === instance.id 
          ? { ...inst, status: inst.status === 'active' ? 'inactive' : 'active' }
          : inst
      ));
    } catch (error) {
      setError('Failed to update instance status');
    } finally {
      setLoading(false);
    }
  };

  const filteredInstances = instances.filter(instance => {
    const matchesSearch = instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instance.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || instance.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderStatsCards = () => {
    if (!stats) return null;
    const statCards = [
      {
        title: 'Total Instâncias',
        value: stats.total_instances,
        icon: Layers,
        color: 'purple',
        trend: stats.active_instances > 0 ? 'up' : 'stable',
      },
      {
        title: 'Instâncias Ativas',
        value: stats.active_instances,
        icon: Activity,
        color: 'green',
        trend: stats.active_instances > 0 ? 'up' : 'stable',
      },
      {
        title: 'Templates',
        value: stats.total_templates,
        icon: FileText,
        color: 'blue',
        trend: 'stable',
      },
      {
        title: 'Snapshots',
        value: stats.total_snapshots,
        icon: Camera,
        color: 'orange',
        trend: 'stable',
      },
      {
        title: 'Taxa de Sucesso',
        value: `${stats.success_rate.toFixed(1)}%`,
        icon: TrendingUp,
        color: 'green',
        trend: stats.success_rate > 80 ? 'up' : stats.success_rate > 60 ? 'stable' : 'down',
      },
    ];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <Card 
            key={index}
            className="window-frame"
          >
            <Card.Content className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />}
                    {stat.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400 rotate-180" />}
                    {stat.trend === 'stable' && <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                  <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <PageTransition type="fade" duration={500}>
      <AppLayout auth={auth}>
        <Head title="Universe Interface - xWin Dash" />
        <div className="relative min-h-screen overflow-hidden">
          {/* Universe Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-10"></div>
          
          {/* Main Content */}
          <div className="relative z-10 p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {onNavigateToDashboard && (
                    <Button 
                      variant="outline" 
                      onClick={onNavigateToDashboard}
                      className="mb-0"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  )}
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                      <Sparkles className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                      Universe Interface
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Advanced drag & drop interface with AI and automation
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Tooltip content="Access advanced interface with canvas and AI">
                    <Button
                      onClick={() => setUseAdvancedInterface(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Advanced Interface
                    </Button>
                  </Tooltip>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    variant="primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Instância
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowSettingsModal(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Button>
                </div>
              </div>
              {/* Stats Cards */}
              {renderStatsCards()}
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-[var(--bg-secondary)] rounded-lg p-1 border border-[var(--border-primary)]">
                {[
                  { id: 'instances', label: 'Instâncias', icon: Layers },
                  { id: 'templates', label: 'Templates', icon: FileText },
                  { id: 'snapshots', label: 'Snapshots', icon: Camera },
                  { id: 'canvas', label: 'Canvas', icon: LayoutGrid },
                  { id: 'kanban', label: 'Kanban', icon: BarChart3 },
                  { id: 'dgd', label: 'DGD Panel', icon: Target },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200",
                      activeTab === tab.id
                        ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
                  <Input
                    placeholder="Buscar instâncias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select
                  value={filterStatus}
                  onValueChange={(value: any) => setFilterStatus(value)}
                  className="bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-primary)]"
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="suspended">Suspenso</option>
                </Select>
                <Button
                  variant="secondary"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? <BarChart3 className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="window-frame p-6">
              {activeTab === 'instances' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Instâncias do Universo</h2>
                    <Badge variant="outline">
                      {filteredInstances.length} instâncias
                    </Badge>
                  </div>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <LoadingSpinnerComponent size="lg" />
                    </div>
                  ) : error ? (
                    <ErrorStateComponent
                      title="Error loading instances"
                      message={error}
                      onRetry={() => setError(null)}
                    />
                  ) : filteredInstances.length === 0 ? (
                    <EmptyState
                      icon={Layers}
                      title="No instances found"
                      description="Create your first universe instance to get started"
                      action={
                        <Button onClick={() => setShowCreateModal(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Instance
                        </Button>
                      }
                    />
                  ) : (
                    <div className={cn(
                      "gap-6",
                      viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                        : "space-y-4"
                    )}>
                      {filteredInstances.map((instance) => (
                        <Card
                          key={instance.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                        >
                          <Card.Header className="pb-3">
                            <div className="flex items-center justify-between">
                              <Card.Title className="text-[var(--text-primary)] text-lg">{instance.name}</Card.Title>
                              <Badge
                                variant={
                                  instance.status === 'active' ? 'success' :
                                  instance.status === 'inactive' ? 'default' :
                                  instance.status === 'suspended' ? 'error' : 'default'
                                }
                              >
                                {instance.status}
                              </Badge>
                            </div>
                            {instance.description && (
                              <Card.Description>
                                {instance.description}
                              </Card.Description>
                            )}
                          </Card.Header>
                          <Card.Content className="pt-0">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--text-tertiary)]">Criado em:</span>
                                <span className="text-[var(--text-primary)]">
                                  {new Date(instance.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-[var(--text-tertiary)]">Última atualização:</span>
                                <span className="text-[var(--text-primary)]">
                                  {new Date(instance.updated_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 pt-3">
                                <Button
                                  size="sm"
                                  variant={instance.status === 'active' ? 'secondary' : 'primary'}
                                  onClick={() => handleStartStop(instance)}
                                  className="flex-1"
                                >
                                  {instance.status === 'active' ? (
                                    <>
                                      <Pause className="h-3 w-3 mr-1" />
                                      Parar
                                    </>
                                  ) : (
                                    <>
                                      <Play className="h-3 w-3 mr-1" />
                                      Iniciar
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setUseAdvancedInterface(true)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setUseAdvancedInterface(true)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </Card.Content>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Other tabs content would go here */}
              {activeTab === 'templates' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Templates</h2>
                    <Button
                      variant="outline"
                      className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Template
                    </Button>
                  </div>
                  <EmptyState
                    icon={FileText}
                    title="Templates in development"
                    description="Advanced template system coming soon"
                  />
                </div>
              )}

              {activeTab === 'snapshots' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Snapshots</h2>
                    <Button
                      variant="outline"
                      className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Novo Snapshot
                    </Button>
                  </div>
                  <EmptyState
                    icon={Camera}
                    title="Snapshots in development"
                    description="Advanced snapshot system coming soon"
                  />
                </div>
              )}

              {activeTab === 'canvas' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Canvas Interativo</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="backdrop-blur-xl bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-white/20 overflow-hidden">
                    <div className="w-full h-full relative">
                      {/* Canvas Grid */}
                      <div 
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                          `,
                          backgroundSize: '20px 20px',
                        }}
                      />
                      {/* Blocks */}
                      {blocks.map((block) => (
                        <div
                          key={block.id}
                          className={cn(
                            "absolute w-32 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg backdrop-blur-sm cursor-move transition-all duration-200"
                          )}
                          style={{
                            left: block.position.x,
                            top: block.position.y,
                          }}
                        >
                          <div className="p-3 h-full flex flex-col justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                              <span className="text-white text-sm font-medium truncate">
                                {block.name}
                              </span>
                            </div>
                            <div className="text-xs text-gray-300 truncate">
                              {block.type}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Canvas Controls */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <Badge variant="outline" className="text-white border-white/20">
                        Zoom: {Math.round(canvasState.zoom * 100)}%
                      </Badge>
                      <Badge variant="outline" className="text-white border-white/20">
                        Blocos: {blocks.length}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'kanban' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Kanban Board</h2>
                    <Badge variant="outline" className="text-white border-white/20">
                      {blocks.length} blocos
                    </Badge>
                  </div>
                  <EmptyState
                    icon={BarChart3}
                    title="Kanban Board in development"
                    description="Advanced Kanban system coming soon"
                  />
                </div>
              )}

              {activeTab === 'dgd' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Dashboard Grid Designer (DGD)</h2>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-white border-white/20">
                        {blocks.length} blocos
                      </Badge>
                    </div>
                  </div>
                  <EmptyState
                    icon={Target}
                    title="DGD Panel in development"
                    description="Advanced dashboard designer coming soon"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Instance Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nova Instância do Universo"
          className="window-frame"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Nome da Instância
              </label>
              <Input
                value={newInstance.name}
                onChange={(e) => setNewInstance({ ...newInstance, name: e.target.value })}
                placeholder="Digite o nome da instância..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Descrição
              </label>
              <Input
                value={newInstance.description}
                onChange={(e) => setNewInstance({ ...newInstance, description: e.target.value })}
                placeholder="Digite uma descrição..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Template (Opcional)
              </label>
              <Select
                value={newInstance.template_id}
                onValueChange={(value) => setNewInstance({ ...newInstance, template_id: value })}
                className="bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-primary)]"
              >
                <option value="">Selecione um template...</option>
                {templates.map((template: any) => (
                  <option key={template.id} value={template.id.toString()}>
                    {template.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateInstance}
              disabled={loading}
            >
              {loading ? <LoadingSpinnerComponent size="sm" /> : 'Criar Instância'}
            </Button>
          </div>
        </Modal>

        {/* Settings Modal */}
        <Modal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          title="Configurações do Universo"
          className="window-frame"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Configurações do Canvas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-primary)]">Snap to Grid</span>
                  <input
                    type="checkbox"
                    checked={settings.snapToGrid}
                    onChange={(e) => setSettings({ ...settings, snapToGrid: e.target.checked })}
                    className="w-4 h-4 text-[var(--accent-primary)] bg-[var(--bg-secondary)] border-[var(--border-primary)] rounded focus:ring-[var(--accent-primary)]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-primary)]">Show Grid</span>
                  <input
                    type="checkbox"
                    checked={settings.showGrid}
                    onChange={(e) => setSettings({ ...settings, showGrid: e.target.checked })}
                    className="w-4 h-4 text-[var(--accent-primary)] bg-[var(--bg-secondary)] border-[var(--border-primary)] rounded focus:ring-[var(--accent-primary)]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-primary)]">Auto Save</span>
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                    className="w-4 h-4 text-[var(--accent-primary)] bg-[var(--bg-secondary)] border-[var(--border-primary)] rounded focus:ring-[var(--accent-primary)]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => setShowSettingsModal(false)}
            >
              Fechar
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowSettingsModal(false)}
            >
              Salvar Configurações
            </Button>
          </div>
        </Modal>
      </AppLayout>
    </PageTransition>
  );
};

export default UniverseInterface;
