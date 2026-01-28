import React, { useState } from 'react';
import { 
  Flag, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  RefreshCw,
  CheckCircle,
  Clock,
  Calendar,
  User,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useProjectMilestones } from '../ProjectsAdvanced/hooks/milestones/useProjectMilestones';
import { ProjectMilestoneAdvanced } from '../types/projectsTypes';

interface ProjectMilestonesProps {
  projectId: string;
  onMilestoneChange?: (milestones: ProjectMilestoneAdvanced[]) => void;
}

const ProjectMilestones: React.FC<ProjectMilestonesProps> = ({ 
  projectId, 
  onMilestoneChange 
}) => {
  const {
    milestones,
    loading,
    error,
    getMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone
  } = useProjectMilestones();

  const [showForm, setShowForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<ProjectMilestoneAdvanced | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    due_date: '',
    assigned_to: '',
    color: '#3B82F6'
  });

  useEffect(() => {
    if (projectId) {
      getMilestones(projectId);
    }
  }, [projectId, getMilestones]);

  const handleCreateMilestone = async () => {
    const result = await createMilestone(projectId, formData);
    if (result) {
      setShowForm(false);
      resetForm();
      onMilestoneChange?.(milestones);
    }
  };

  const handleUpdateMilestone = async () => {
    if (!editingMilestone) return;
    
    const result = await updateMilestone(projectId, editingMilestone.id, formData);
    if (result) {
      setEditingMilestone(null);
      setShowForm(false);
      resetForm();
      onMilestoneChange?.(milestones);
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este marco?')) {
      const success = await deleteMilestone(projectId, milestoneId);
      if (success) {
        onMilestoneChange?.(milestones);
      }
    }
  };

  const handleEditMilestone = (milestone: ProjectMilestoneAdvanced) => {
    setEditingMilestone(milestone);
    setFormData({
      name: milestone.name,
      description: milestone.description,
      due_date: milestone.due_date.split('T')[0],
      assigned_to: milestone.assigned_to || '',
      color: milestone.color
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      due_date: '',
      assigned_to: '',
      color: '#3B82F6'
    });
  };

  const getStatusColor = (completed: boolean, dueDate: string) => {
    if (completed) return 'text-green-600';
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600';
    if (diffDays <= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getStatusText = (completed: boolean, dueDate: string) => {
    if (completed) return 'Concluído';
    
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} dias atrasado`;
    if (diffDays === 0) return 'Vence hoje';
    if (diffDays === 1) return 'Vence amanhã';
    return `Vence em ${diffDays} dias`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDeliverableIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'code':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'design':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'report':
        return <FileText className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDeliverableStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      review: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || colors.pending;
  };

  if (loading && milestones.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando marcos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Flag className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Marcos do Projeto
              </h3>
              <p className="text-sm text-gray-500">
                {milestones.length} marcos configurados
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => projectId && getMilestones(projectId)}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingMilestone(null);
                resetForm();
              }}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Marco
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {milestones.length === 0 ? (
          <div className="text-center py-8">
            <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum marco configurado
            </h4>
            <p className="text-gray-500 mb-4">
              Crie marcos para acompanhar o progresso do projeto
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Criar Primeiro Marco
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`border rounded-lg p-4 transition-colors ${
                  milestone.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full mt-1"
                      style={{ backgroundColor: milestone.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {milestone.name}
                        </h4>
                        {milestone.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {milestone.description}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Vence em {formatDate(milestone.due_date)}</span>
                        </div>
                        {milestone.assigned_to_name && (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{milestone.assigned_to_name}</span>
                          </div>
                        )}
                        <span className={getStatusColor(milestone.completed, milestone.due_date)}>
                          {getStatusText(milestone.completed, milestone.due_date)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progresso</span>
                          <span>{milestone.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              backgroundColor: milestone.color,
                              width: `${milestone.progress}%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Deliverables */}
                      {milestone.deliverables && milestone.deliverables.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-xs font-medium text-gray-700 mb-2">
                            Entregáveis:
                          </h5>
                          <div className="space-y-1">
                            {milestone.deliverables.map((deliverable, index) => (
                              <div key={index} className="flex items-center space-x-2 text-xs">
                                {getDeliverableIcon(deliverable.type)}
                                <span className="text-gray-600">{deliverable.name}</span>
                                <span className={`px-2 py-1 rounded-full ${getDeliverableStatusColor(deliverable.status)}`}>
                                  {deliverable.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditMilestone(milestone)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMilestone(milestone.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingMilestone ? 'Editar Marco' : 'Novo Marco'}
              </h4>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingMilestone(null);
                  resetForm();
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Marco
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Lançamento da Versão 1.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descreva o marco..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável
                </label>
                <input
                  type="text"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do responsável"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">
                    {formData.color}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingMilestone(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={editingMilestone ? handleUpdateMilestone : handleCreateMilestone}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingMilestone ? 'Atualizar' : 'Criar'} Marco
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMilestones;
