import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Info
} from 'lucide-react';
import { LeadHealthScore } from '../../types';

interface LeadHealthScoreProps {
  leadId?: string;
  onHealthUpdate?: (health: LeadHealthScore) => void;
}

const LeadHealthScore: React.FC<LeadHealthScoreProps> = ({ 
  leadId, 
  onHealthUpdate 
}) => {
  const {
    healthScore,
    loading,
    error,
    getHealthScore
  } = useLeadHealth(leadId);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Crítico';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <Activity className="w-5 h-5 text-yellow-600" />;
    if (score >= 40) return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    return <AlertTriangle className="w-5 h-5 text-red-600" />;
  };

  const getFactorIcon = (factor: string) => {
    switch (factor) {
      case 'engagement':
        return <Activity className="w-4 h-4" />;
      case 'response_time':
        return <TrendingUp className="w-4 h-4" />;
      case 'data_quality':
        return <CheckCircle className="w-4 h-4" />;
      case 'activity_frequency':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getFactorName = (factor: string) => {
    const factors: { [key: string]: string } = {
      engagement: 'Engajamento',
      response_time: 'Tempo de Resposta',
      data_quality: 'Qualidade dos Dados',
      activity_frequency: 'Frequência de Atividade',
      lead_score: 'Score do Lead',
      last_activity: 'Última Atividade',
      source_quality: 'Qualidade da Origem',
      conversion_probability: 'Probabilidade de Conversão'
    };
    return factors[factor] || factor;
  };

  if (loading && !healthScore) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando score de saúde...</span>
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
            <Heart className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Score de Saúde do Lead
              </h3>
              <p className="text-sm text-gray-500">
                Análise da qualidade e potencial do lead
              </p>
            </div>
          </div>
          <button
            onClick={() => leadId && getHealthScore()}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!healthScore ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum score de saúde disponível
            </h4>
            <p className="text-gray-500">
              O score de saúde será calculado com base nos dados do lead
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Health Score */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getHealthBgColor(healthScore.overall_score)} mb-4`}>
                <span className={`text-3xl font-bold ${getHealthColor(healthScore.overall_score)}`}>
                  {healthScore.overall_score}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2 mb-2">
                {getHealthIcon(healthScore.overall_score)}
                <h4 className="text-lg font-medium text-gray-900">
                  {getHealthStatus(healthScore.overall_score)}
                </h4>
              </div>
              <p className="text-sm text-gray-500">
                Score geral de saúde do lead
              </p>
            </div>

            {/* Health Factors */}
            {healthScore.factors && healthScore.factors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Fatores de Saúde
                </h4>
                <div className="space-y-3">
                  {healthScore.factors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getFactorIcon(factor.name)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {getFactorName(factor.name)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {factor.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${getHealthColor(factor.score)}`}>
                          {factor.score}
                        </p>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-2 rounded-full ${
                              factor.score >= 80 ? 'bg-green-500' :
                              factor.score >= 60 ? 'bg-yellow-500' :
                              factor.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${factor.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Health Trends */}
            {healthScore.trends && healthScore.trends.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Tendências de Saúde
                </h4>
                <div className="space-y-3">
                  {healthScore.trends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {trend.direction === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {trend.factor}
                          </p>
                          <p className="text-xs text-gray-500">
                            {trend.period}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${
                          trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trend.change > 0 ? '+' : ''}{trend.change}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {healthScore.recommendations && healthScore.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Recomendações
                </h4>
                <div className="space-y-3">
                  {healthScore.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-blue-900">
                            <strong>{recommendation.title}:</strong> {recommendation.description}
                          </p>
                          {recommendation.priority && (
                            <p className="text-xs text-blue-700 mt-1">
                              Prioridade: {recommendation.priority}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Health History */}
            {healthScore.history && healthScore.history.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Histórico de Saúde
                </h4>
                <div className="space-y-2">
                  {healthScore.history.slice(0, 5).map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          entry.score >= 80 ? 'bg-green-500' :
                          entry.score >= 60 ? 'bg-yellow-500' :
                          entry.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm text-gray-900">
                          {new Date(entry.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${getHealthColor(entry.score)}`}>
                        {entry.score}
                      </span>
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

export default LeadHealthScore;
