import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  PieChart,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';
import { useProjectBudgets } from '../ProjectsAdvanced/hooks/budgets/useProjectBudgets';
import { ProjectBudgetAdvanced } from '../types/projectsTypes';

interface ProjectBudgetProps {
  projectId: string;
  onBudgetUpdate?: (budget: ProjectBudgetAdvanced) => void;
}

const ProjectBudget: React.FC<ProjectBudgetProps> = ({ 
  projectId, 
  onBudgetUpdate 
}) => {
  const {
    budget,
    loading,
    error,
    getBudget,
    updateBudget
  } = useProjectBudget();

  const [selectedView, setSelectedView] = useState<'overview' | 'categories' | 'phases'>('overview');

  useEffect(() => {
    if (projectId) {
      getBudget(projectId);
    }
  }, [projectId, getBudget]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600';
    if (variance < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="w-4 h-4 text-red-600" />;
    if (variance < 0) return <TrendingDown className="w-4 h-4 text-green-600" />;
    return <Target className="w-4 h-4 text-gray-600" />;
  };

  const getBurnRateColor = (rate: number) => {
    if (rate > 100) return 'text-red-600';
    if (rate > 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading && !budget) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando orçamento...</span>
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
            <DollarSign className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Orçamento do Projeto
              </h3>
              <p className="text-sm text-gray-500">
                Controle financeiro e previsões
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="overview">Visão Geral</option>
              <option value="categories">Por Categoria</option>
              <option value="phases">Por Fase</option>
            </select>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => projectId && getBudget(projectId)}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!budget ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum orçamento configurado
            </h4>
            <p className="text-gray-500">
              O orçamento será criado automaticamente quando o projeto for configurado
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Orçamento Total
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(budget.total_budget, budget.currency)}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Gasto
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(budget.spent_amount, budget.currency)}
                </p>
                <p className="text-xs text-green-700">
                  {((budget.spent_amount / budget.total_budget) * 100).toFixed(1)}% do total
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    Comprometido
                  </span>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(budget.committed_amount, budget.currency)}
                </p>
                <p className="text-xs text-purple-700">
                  {((budget.committed_amount / budget.total_budget) * 100).toFixed(1)}% do total
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">
                    Restante
                  </span>
                </div>
                <p className="text-2xl font-bold text-orange-900">
                  {formatCurrency(budget.remaining_amount, budget.currency)}
                </p>
                <p className="text-xs text-orange-700">
                  {((budget.remaining_amount / budget.total_budget) * 100).toFixed(1)}% do total
                </p>
              </div>
            </div>

            {/* Variance Analysis */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Análise de Variância
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Planejado</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(budget.actual_vs_planned.planned, budget.currency)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Real</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(budget.actual_vs_planned.actual, budget.currency)}
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {getVarianceIcon(budget.actual_vs_planned.variance)}
                    <span className={`text-lg font-bold ${getVarianceColor(budget.actual_vs_planned.variance)}`}>
                      {formatCurrency(budget.actual_vs_planned.variance, budget.currency)}
                    </span>
                  </div>
                  <p className={`text-sm ${getVarianceColor(budget.actual_vs_planned.variance)}`}>
                    {budget.actual_vs_planned.variance_percentage > 0 ? '+' : ''}{budget.actual_vs_planned.variance_percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Burn Rate */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Taxa de Consumo
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Diário</p>
                  <p className={`text-lg font-bold ${getBurnRateColor(budget.burn_rate.daily)}`}>
                    {formatCurrency(budget.burn_rate.daily, budget.currency)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Semanal</p>
                  <p className={`text-lg font-bold ${getBurnRateColor(budget.burn_rate.weekly)}`}>
                    {formatCurrency(budget.burn_rate.weekly, budget.currency)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Mensal</p>
                  <p className={`text-lg font-bold ${getBurnRateColor(budget.burn_rate.monthly)}`}>
                    {formatCurrency(budget.burn_rate.monthly, budget.currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Forecast */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Previsão de Conclusão
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Data de Conclusão</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatDate(budget.forecast.completion_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Custo Final Estimado</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(budget.forecast.final_cost, budget.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center space-x-1">
                    {budget.forecast.over_budget ? (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      budget.forecast.over_budget ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {budget.forecast.over_budget ? 'Acima do Orçamento' : 'Dentro do Orçamento'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories View */}
            {selectedView === 'categories' && budget.categories && budget.categories.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Orçamento por Categoria
                </h4>
                <div className="space-y-3">
                  {budget.categories.map((category, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <h5 className="text-sm font-medium text-gray-900">
                            {category.name}
                          </h5>
                        </div>
                        <span className="text-sm text-gray-500">
                          {category.percentage_of_total.toFixed(1)}% do total
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3">
                        {category.description}
                      </p>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Orçado</p>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(category.budgeted_amount, budget.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Gasto</p>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(category.spent_amount, budget.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Restante</p>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(category.remaining_amount, budget.currency)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              backgroundColor: category.color,
                              width: `${(category.spent_amount / category.budgeted_amount) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Phases View */}
            {selectedView === 'phases' && budget.phases && budget.phases.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Orçamento por Fase
                </h4>
                <div className="space-y-3">
                  {budget.phases.map((phase, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-900">
                          {phase.name}
                        </h5>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{formatDate(phase.start_date)} - {formatDate(phase.end_date)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Orçado</p>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(phase.budgeted_amount, budget.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Gasto</p>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(phase.spent_amount, budget.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Restante</p>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(phase.remaining_amount, budget.currency)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                            style={{ 
                              width: `${(phase.spent_amount / phase.budgeted_amount) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectBudget;
