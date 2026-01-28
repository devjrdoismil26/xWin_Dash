import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Equal
} from 'lucide-react';
import { LeadScoreRule } from '../../types';

interface LeadScoringRulesProps {
  onRuleChange?: (rules: LeadScoreRule[]) => void;
}

const LeadScoringRules: React.FC<LeadScoringRulesProps> = ({ onRuleChange }) => {
  const {
    scoreRules,
    loading,
    error,
    getScoreRules,
    createScoreRule,
    updateScoreRule,
    deleteScoreRule
  } = useLeadScoring();

  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<LeadScoreRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    field: '',
    operator: 'equals',
    value: '',
    score: 0,
    is_active: true
  });

  const handleCreateRule = async () => {
    const result = await createScoreRule(formData);
    if (result) {
      setShowForm(false);
      resetForm();
      onRuleChange?.(scoreRules);
    }
  };

  const handleUpdateRule = async () => {
    if (!editingRule) return;
    
    const result = await updateScoreRule(editingRule.id, formData);
    if (result) {
      setEditingRule(null);
      resetForm();
      onRuleChange?.(scoreRules);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta regra?')) {
      const success = await deleteScoreRule(ruleId);
      if (success) {
        onRuleChange?.(scoreRules);
      }
    }
  };

  const handleEditRule = (rule: LeadScoreRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description,
      field: rule.field,
      operator: rule.operator,
      value: rule.value,
      score: rule.score,
      is_active: rule.is_active
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      field: '',
      operator: 'equals',
      value: '',
      score: 0,
      is_active: true
    });
  };

  const getOperatorIcon = (operator: string) => {
    switch (operator) {
      case 'greater_than':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'less_than':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'equals':
        return <Equal className="w-4 h-4 text-blue-600" />;
      default:
        return <Equal className="w-4 h-4 text-gray-600" />;
    }
  };

  const getOperatorText = (operator: string) => {
    const operators: { [key: string]: string } = {
      equals: 'igual a',
      greater_than: 'maior que',
      less_than: 'menor que',
      contains: 'contém',
      starts_with: 'começa com',
      ends_with: 'termina com'
    };
    return operators[operator] || operator;
  };

  const getFieldText = (field: string) => {
    const fields: { [key: string]: string } = {
      email: 'Email',
      phone: 'Telefone',
      company: 'Empresa',
      source: 'Origem',
      status: 'Status',
      score: 'Score Atual',
      created_at: 'Data de Criação',
      last_activity_at: 'Última Atividade'
    };
    return fields[field] || field;
  };

  const getScoreColor = (score: number) => {
    if (score > 0) return 'text-green-600';
    if (score < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading && scoreRules.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando regras de pontuação...</span>
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
            <Target className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Regras de Pontuação
              </h3>
              <p className="text-sm text-gray-500">
                {scoreRules.length} regras configuradas
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingRule(null);
              resetForm();
            }}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Regra
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {scoreRules.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma regra de pontuação
            </h4>
            <p className="text-gray-500 mb-4">
              Crie regras para pontuar automaticamente seus leads
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Criar Primeira Regra
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {scoreRules.map((rule) => (
              <div
                key={rule.id}
                className={`border rounded-lg p-4 transition-colors ${
                  rule.is_active 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {rule.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        rule.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {rule.description}
                    </p>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500">Se</span>
                        <span className="font-medium text-gray-900">
                          {getFieldText(rule.field)}
                        </span>
                        {getOperatorIcon(rule.operator)}
                        <span className="text-gray-500">
                          {getOperatorText(rule.operator)}
                        </span>
                        <span className="font-medium text-gray-900">
                          &quot;{rule.value}&quot;
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500">então adicionar</span>
                        <span className={`font-bold ${getScoreColor(rule.score)}`}>
                          {rule.score > 0 ? '+' : ''}{rule.score} pontos
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditRule(rule)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingRule ? 'Editar Regra' : 'Nova Regra de Pontuação'}
              </h4>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingRule(null);
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
                  Nome da Regra
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Lead com email corporativo"
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
                  rows={2}
                  placeholder="Descrição da regra..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campo
                  </label>
                  <select
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um campo</option>
                    <option value="email">Email</option>
                    <option value="phone">Telefone</option>
                    <option value="company">Empresa</option>
                    <option value="source">Origem</option>
                    <option value="status">Status</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Operador
                  </label>
                  <select
                    value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="equals">Igual a</option>
                    <option value="contains">Contém</option>
                    <option value="starts_with">Começa com</option>
                    <option value="ends_with">Termina com</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor
                </label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Valor para comparação"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pontos
                </label>
                <input
                  type="number"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Regra ativa
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingRule(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={editingRule ? handleUpdateRule : handleCreateRule}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingRule ? 'Atualizar' : 'Criar'} Regra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadScoringRules;
