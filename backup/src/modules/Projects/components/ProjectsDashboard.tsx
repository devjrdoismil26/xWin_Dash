import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  LayoutGrid, 
  Sparkles, 
  BarChart3, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { ProjectCore } from '../types/projectsTypes';

interface ProjectsDashboardProps {
  projects: ProjectCore[];
  onNavigateToProject: (project: ProjectCore) => void;
  onNavigateToUniverse: () => void;
}

interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  universeProjects: number;
  normalProjects: number;
  totalLeads: number;
  totalRevenue: number;
  recentActivity: number;
}

const ProjectsDashboard: React.FC<ProjectsDashboardProps> = ({
  projects,
  onNavigateToProject,
  onNavigateToUniverse
}) => {
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    activeProjects: 0,
    universeProjects: 0,
    normalProjects: 0,
    totalLeads: 0,
    totalRevenue: 0,
    recentActivity: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'normal' | 'universe'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Calculate stats from projects
  useEffect(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const universeProjects = projects.filter(p => (p as any).mode === 'universe').length;
    const normalProjects = projects.filter(p => (p as any).mode === 'normal').length;
    
    // Mock data for leads and revenue - in real app this would come from project data
    const totalLeads = projects.reduce((sum, p) => sum + ((p as any).statistics?.leads || 0), 0);
    const totalRevenue = projects.reduce((sum, p) => sum + ((p as any).statistics?.revenue || 0), 0);
    const recentActivity = projects.filter(p => {
      const lastActivity = new Date(p.updatedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastActivity > weekAgo;
    }).length;

    setStats({
      totalProjects,
      activeProjects,
      universeProjects,
      normalProjects,
      totalLeads,
      totalRevenue,
      recentActivity
    });
  }, [projects]);

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const projectMode = (project as any).mode || 'normal';
    const matchesFilter = filterMode === 'all' || projectMode === filterMode;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'archived': return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getModeIcon = (mode: string) => {
    return mode === 'universe' ? 
      <Sparkles className="w-5 h-5 text-purple-500" /> : 
      <LayoutGrid className="w-5 h-5 text-blue-500" />;
  };

  const getModuleIcon = (module: string) => {
    const icons: Record<string, React.ReactNode> = {
      leads: <Users className="w-4 h-4" />,
      workflows: <BarChart3 className="w-4 h-4" />,
      email: <Users className="w-4 h-4" />,
      social: <Users className="w-4 h-4" />,
      analytics: <BarChart3 className="w-4 h-4" />,
      settings: <Users className="w-4 h-4" />
    };
    return icons[module] || <LayoutGrid className="w-4 h-4" />;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Projects Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage your projects and access the Universe
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
            
            <Button
              onClick={onNavigateToUniverse}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Universe
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total de Projetos
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stats.totalProjects}
                </p>
              </div>
              <LayoutGrid className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Projetos Ativos
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeProjects}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Universe Mode
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.universeProjects}
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Receita Total
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={filterMode === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterMode('all')}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={filterMode === 'normal' ? 'default' : 'outline'}
              onClick={() => setFilterMode('normal')}
              size="sm"
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              Normal
            </Button>
            <Button
              variant={filterMode === 'universe' ? 'default' : 'outline'}
              onClick={() => setFilterMode('universe')}
              size="sm"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Universe
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              size="sm"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              size="sm"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Projects Grid/List */}
        <div className={cn(
          "gap-6",
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
        )}>
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => onNavigateToProject(project)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getModeIcon((project as any).mode || 'normal')}
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {project.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(project.status)}
                  <Badge 
                    variant="outline"
                    className={cn(
                      (project as any).mode === 'universe' 
                        ? 'border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-300'
                        : 'border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300'
                    )}
                  >
                    {(project as any).mode === 'universe' ? 'Universe' : 'Normal'}
                  </Badge>
                </div>
              </div>

              {/* Modules */}
              {(project as any).modules && (project as any).modules.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project as any).modules.map((module: string) => (
                    <div 
                      key={module}
                      className="flex items-center space-x-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs"
                    >
                      {getModuleIcon(module)}
                      <span className="capitalize">{module}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Statistics */}
              {(project as any).statistics && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {((project as any).statistics.leads || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency((project as any).statistics.revenue || 0)}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Receita</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Atualizado em {formatDate(project.updatedAt)}
                </div>
                
                <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span className="text-sm font-medium mr-1">Abrir</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <LayoutGrid className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchTerm || filterMode !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Crie seu primeiro projeto para começar'
              }
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Projeto
            </Button>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            // Refresh projects would be handled by parent component
          }}
        />
      )}
    </div>
  );
};

// Create Project Modal Component
interface CreateProjectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mode: 'normal' as 'normal' | 'universe'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In real implementation, this would call the create project service
      console.log('Creating project:', formData);
      
      onSuccess();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Criar Novo Projeto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Nome do Projeto
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Digite o nome do projeto"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva o projeto"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Modo de Operação
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
              <input
                type="radio"
                name="mode"
                value="normal"
                checked={formData.mode === 'normal'}
                onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value as 'normal' | 'universe' }))}
                className="text-blue-500 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <LayoutGrid className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-slate-900 dark:text-white">Modo Normal</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Interface tradicional com módulos separados
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
              <input
                type="radio"
                name="mode"
                value="universe"
                checked={formData.mode === 'universe'}
                onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value as 'normal' | 'universe' }))}
                className="text-purple-500 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-slate-900 dark:text-white">Universe Mode</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Drag & drop com IA e automação completa
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Criar Projeto
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectsDashboard;
