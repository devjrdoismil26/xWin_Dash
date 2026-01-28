import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  RefreshCw,
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  User,
  Wrench,
  Package,
  ExternalLink
} from 'lucide-react';
import { useProjectResources } from '../ProjectsAdvanced/hooks/resources/useProjectResources';
import { ProjectResource } from '../types/projectsTypes';

interface ProjectResourcesProps {
  projectId: string;
  onResourceChange?: (resources: ProjectResource[]) => void;
}

const ProjectResources: React.FC<ProjectResourcesProps> = ({ 
  projectId, 
  onResourceChange 
}) => {
  const {
    resources,
    loading,
    error,
    getResources,
    createResource,
    updateResource,
    deleteResource
  } = useProjectResources();

  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<ProjectResource | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'human',
    category: '',
    description: '',
    start_date: '',
    end_date: '',
    hours_per_day: 8,
    days_per_week: 5,
    hourly_rate: 0,
    daily_rate: 0,
    total_budget: 0,
    currency: 'BRL',
    skills: [] as string[]
  });

  useEffect(() => {
    if (projectId) {
      getResources(projectId);
    }
  }, [projectId, getResources]);

  const handleCreateResource = async () => {
    const result = await createResource(projectId, formData);
    if (result) {
      setShowForm(false);
      resetForm();
      onResourceChange?.(resources);
    }
  };

  const handleUpdateResource = async () => {
    if (!editingResource) return;
    
    const result = await updateResource(projectId, editingResource.id, formData);
    if (result) {
      setEditingResource(null);
      setShowForm(false);
      resetForm();
      onResourceChange?.(resources);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este recurso?')) {
      const success = await deleteResource(projectId, resourceId);
      if (success) {
        onResourceChange?.(resources);
      }
    }
  };

  const handleEditResource = (resource: ProjectResource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      category: resource.category,
      description: resource.description,
      start_date: resource.availability.start_date.split('T')[0],
      end_date: resource.availability.end_date.split('T')[0],
      hours_per_day: resource.availability.hours_per_day,
      days_per_week: resource.availability.days_per_week,
      hourly_rate: resource.cost.hourly_rate || 0,
      daily_rate: resource.cost.daily_rate || 0,
      total_budget: resource.cost.total_budget || 0,
      currency: resource.cost.currency,
      skills: resource.skills || []
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'human',
      category: '',
      description: '',
      start_date: '',
      end_date: '',
      hours_per_day: 8,
      days_per_week: 5,
      hourly_rate: 0,
      daily_rate: 0,
      total_budget: 0,
      currency: 'BRL',
      skills: []
    });
  };

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'human':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'equipment':
        return <Wrench className="w-4 h-4 text-green-600" />;
      case 'material':
        return <Package className="w-4 h-4 text-orange-600" />;
      case 'external':
        return <ExternalLink className="w-4 h-4 text-purple-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getResourceTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      human: 'Humano',
      equipment: 'Equipamento',
      material: 'Material',
      external: 'Externo'
    };
    return types[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      available: 'bg-green-100 text-green-800',
      allocated: 'bg-blue-100 text-blue-800',
      overallocated: 'bg-yellow-100 text-yellow-800',
      unavailable: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.available;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'allocated':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'overallocated':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'unavailable':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading && resources.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando recursos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Recursos do Projeto
              </h3>
              <p className="text-sm text-gray-500">
                {resources.length} recursos alocados
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => projectId && getResources(projectId)}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingResource(null);
                resetForm();
              }}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Recurso
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {resources.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum recurso alocado
            </h4>
            <p className="text-gray-500 mb-4">
              Adicione recursos para gerenciar a alocação do projeto
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Adicionar Primeiro Recurso
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getResourceTypeIcon(resource.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {resource.name}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(resource.status)}`}>
                          {resource.status}
                        </span>
                        {getStatusIcon(resource.status)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {resource.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500">Tipo:</span>
                          <p className="font-medium text-gray-900">
                            {getResourceTypeName(resource.type)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Categoria:</span>
                          <p className="font-medium text-gray-900">
                            {resource.category}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Disponibilidade:</span>
                          <p className="font-medium text-gray-900">
                            {formatDate(resource.availability.start_date)} - {formatDate(resource.availability.end_date)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Utilização:</span>
                          <p className="font-medium text-gray-900">
                            {resource.utilization}%
                          </p>
                        </div>
                      </div>

                      {/* Cost Information */}
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            {resource.cost.hourly_rate && (
                              <div>
                                <span className="text-gray-500">Taxa/hora:</span>
                                <span className="font-medium text-gray-900 ml-1">
                                  {formatCurrency(resource.cost.hourly_rate, resource.cost.currency)}
                                </span>
                              </div>
                            )}
                            {resource.cost.daily_rate && (
                              <div>
                                <span className="text-gray-500">Taxa/dia:</span>
                                <span className="font-medium text-gray-900 ml-1">
                                  {formatCurrency(resource.cost.daily_rate, resource.cost.currency)}
                                </span>
                              </div>
                            )}
                            {resource.cost.total_budget && (
                              <div>
                                <span className="text-gray-500">Orçamento:</span>
                                <span className="font-medium text-gray-900 ml-1">
                                  {formatCurrency(resource.cost.total_budget, resource.cost.currency)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {resource.assigned_tasks.length} tarefas
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      {resource.skills && resource.skills.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {resource.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditResource(resource)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingResource ? 'Editar Recurso' : 'Novo Recurso'}
              </h4>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingResource(null);
                  resetForm();
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Recurso
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Desenvolvedor Frontend"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="human">Humano</option>
                    <option value="equipment">Equipamento</option>
                    <option value="material">Material</option>
                    <option value="external">Externo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Desenvolvimento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moeda
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BRL">BRL (R$)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
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
                  placeholder="Descreva o recurso..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Fim
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horas por Dia
                  </label>
                  <input
                    type="number"
                    value={formData.hours_per_day}
                    onChange={(e) => setFormData({ ...formData, hours_per_day: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dias por Semana
                  </label>
                  <input
                    type="number"
                    value={formData.days_per_week}
                    onChange={(e) => setFormData({ ...formData, days_per_week: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="7"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taxa por Hora
                  </label>
                  <input
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taxa por Dia
                  </label>
                  <input
                    type="number"
                    value={formData.daily_rate}
                    onChange={(e) => setFormData({ ...formData, daily_rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orçamento Total
                  </label>
                  <input
                    type="number"
                    value={formData.total_budget}
                    onChange={(e) => setFormData({ ...formData, total_budget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Habilidades (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.skills.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    skills: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: React, TypeScript, Node.js"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingResource(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={editingResource ? handleUpdateResource : handleCreateResource}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingResource ? 'Atualizar' : 'Criar'} Recurso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectResources;
