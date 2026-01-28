import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useProjectRisks } from '../ProjectsAdvanced/hooks/risks/useProjectRisks';
import { ProjectRisk } from '../types/projectsTypes';

interface ProjectRisksProps {
  projectId: string;
  onRiskChange?: (risks: ProjectRisk[]) => void;
}

const ProjectRisks: React.FC<ProjectRisksProps> = ({ 
  projectId, 
  onRiskChange 
}) => {
  const {
    risks,
    loading,
    error,
    getRisks,
    createRisk,
    updateRisk,
    deleteRisk
  } = useProjectRisks();

  const [showForm, setShowForm] = useState(false);
  const [editingRisk, setEditingRisk] = useState<ProjectRisk | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    probability: 'medium',
    impact: 'medium',
    mitigation_strategy: '',
    contingency_plan: '',
    owner: '',
    due_date: ''
  });

  useEffect(() => {
    if (projectId) {
      getRisks(projectId);
    }
  }, [projectId, getRisks]);

  const handleCreateRisk = async () => {
    const result = await createRisk(projectId, formData);
    if (result) {
      setShowForm(false);
      resetForm();
      onRiskChange?.(risks);
    }
  };

  const handleUpdateRisk = async () => {
    if (!editingRisk) return;
    
    const result = await updateRisk(projectId, editingRisk.id, formData);
    if (result) {
      setEditingRisk(null);
      setShowForm(false);
      resetForm();
      onRiskChange?.(risks);
    }
  };

  const handleDeleteRisk = async (riskId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este risco?')) {
      const success = await deleteRisk(projectId, riskId);
      if (success) {
        onRiskChange?.(risks);
      }
    }
  };

  const handleEditRisk = (risk: ProjectRisk) => {
    setEditingRisk(risk);
    setFormData({
      title: risk.title,
      description: risk.description,
      category: risk.category,
      probability: risk.probability,
      impact: risk.impact,
      mitigation_strategy: risk.mitigation_strategy,
      contingency_plan: risk.contingency_plan,
      owner: risk.owner,
      due_date: risk.due_date ? risk.due_date.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'technical',
      probability: 'medium',
      impact: 'medium',
      mitigation_strategy: '',
      contingency_plan: '',
      owner: '',
      due_date: ''
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      technical: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800',
      resource: 'bg-yellow-100 text-yellow-800',
      schedule: 'bg-orange-100 text-orange-800',
      quality: 'bg-purple-100 text-purple-800',
      external: 'bg-red-100 text-red-800'
    };
    return colors[category] || colors.technical;
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      technical: 'Técnico',
      business: 'Negócio',
      resource: 'Recurso',
      schedule: 'Cronograma',
      quality: 'Qualidade',
      external: 'Externo'
    };
    return names[category] || category;
  };

  const getProbabilityColor = (probability: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      very_high: 'bg-red-100 text-red-800'
    };
    return colors[probability] || colors.medium;
  };

  const getImpactColor = (impact: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      very_high: 'bg-red-100 text-red-800'
    };
    return colors[impact] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      identified: 'bg-gray-100 text-gray-800',
      assessed: 'bg-blue-100 text-blue-800',
      mitigated: 'bg-green-100 text-green-800',
      monitored: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || colors.identified;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'identified':
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      case 'assessed':
        return <Target className="w-4 h-4 text-blue-600" />;
      case 'mitigated':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'monitored':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 16) return 'text-red-600';
    if (score >= 9) return 'text-orange-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading && risks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando riscos...</span>
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
            <AlertTriangle className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Riscos do Projeto
              </h3>
              <p className="text-sm text-gray-500">
                {risks.length} riscos identificados
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => projectId && getRisks(projectId)}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingRisk(null);
                resetForm();
              }}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Risco
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {risks.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum risco identificado
            </h4>
            <p className="text-gray-500 mb-4">
              Identifique e gerencie os riscos do projeto
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Identificar Primeiro Risco
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {risks.map((risk) => (
              <div
                key={risk.id}
                className={`border rounded-lg p-4 transition-colors ${
                  risk.status === 'closed' 
                    ? 'border-green-200 bg-green-50' 
                    : risk.risk_score >= 16
                    ? 'border-red-200 bg-red-50'
                    : risk.risk_score >= 9
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(risk.status)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {risk.title}
                        </h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(risk.category)}`}>
                          {getCategoryName(risk.category)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(risk.status)}`}>
                          {risk.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {risk.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-3">
                        <div>
                          <span className="text-gray-500">Probabilidade:</span>
                          <p className={`font-medium ${getProbabilityColor(risk.probability)}`}>
                            {risk.probability}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Impacto:</span>
                          <p className={`font-medium ${getImpactColor(risk.impact)}`}>
                            {risk.impact}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Score:</span>
                          <p className={`font-bold ${getRiskScoreColor(risk.risk_score)}`}>
                            {risk.risk_score}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Responsável:</span>
                          <p className="font-medium text-gray-900">
                            {risk.owner_name}
                          </p>
                        </div>
                      </div>

                      {/* Mitigation Strategy */}
                      {risk.mitigation_strategy && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                          <h5 className="text-xs font-medium text-blue-900 mb-1">
                            Estratégia de Mitigação:
                          </h5>
                          <p className="text-xs text-blue-800">
                            {risk.mitigation_strategy}
                          </p>
                        </div>
                      )}

                      {/* Contingency Plan */}
                      {risk.contingency_plan && (
                        <div className="mb-3 p-3 bg-yellow-50 rounded-lg">
                          <h5 className="text-xs font-medium text-yellow-900 mb-1">
                            Plano de Contingência:
                          </h5>
                          <p className="text-xs text-yellow-800">
                            {risk.contingency_plan}
                          </p>
                        </div>
                      )}

                      {/* Due Date */}
                      {risk.due_date && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>Prazo: {formatDate(risk.due_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditRisk(risk)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRisk(risk.id)}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingRisk ? 'Editar Risco' : 'Novo Risco'}
              </h4>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingRisk(null);
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
                  Título do Risco
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Atraso na entrega do fornecedor"
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
                  placeholder="Descreva o risco em detalhes..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="technical">Técnico</option>
                    <option value="business">Negócio</option>
                    <option value="resource">Recurso</option>
                    <option value="schedule">Cronograma</option>
                    <option value="quality">Qualidade</option>
                    <option value="external">Externo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Probabilidade
                  </label>
                  <select
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="very_high">Muito Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impacto
                  </label>
                  <select
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Baixo</option>
                    <option value="medium">Médio</option>
                    <option value="high">Alto</option>
                    <option value="very_high">Muito Alto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estratégia de Mitigação
                </label>
                <textarea
                  value={formData.mitigation_strategy}
                  onChange={(e) => setFormData({ ...formData, mitigation_strategy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descreva como mitigar este risco..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plano de Contingência
                </label>
                <textarea
                  value={formData.contingency_plan}
                  onChange={(e) => setFormData({ ...formData, contingency_plan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descreva o plano de contingência..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo (opcional)
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingRisk(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={editingRisk ? handleUpdateRisk : handleCreateRisk}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingRisk ? 'Atualizar' : 'Criar'} Risco
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectRisks;
