import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  Plus,
  Eye,
  Clock
} from 'lucide-react';
import { LeadEngagement } from '../../types';

interface LeadEngagementProps {
  leadId?: string;
  onEngagementUpdate?: (engagement: LeadEngagement) => void;
}

const LeadEngagement: React.FC<LeadEngagementProps> = ({ 
  leadId, 
  onEngagementUpdate 
}) => {
  const {
    engagement,
    loading,
    error,
    getEngagement,
    updateEngagement
  } = useLeadEngagement(leadId);

  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'email',
    description: '',
    scheduled_at: ''
  });

  const handleAddActivity = async () => {
    if (!leadId || !newActivity.description) return;

    const result = await updateEngagement(leadId, {
      activities: [...(engagement?.activities || []), newActivity]
    });

    if (result) {
      setNewActivity({ type: 'email', description: '', scheduled_at: '' });
      setShowAddActivity(false);
      onEngagementUpdate?.(result);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'call':
        return <Phone className="w-4 h-4 text-green-600" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      email: 'Email',
      call: 'Ligação',
      meeting: 'Reunião',
      message: 'Mensagem',
      note: 'Nota',
      task: 'Tarefa'
    };
    return types[type] || type;
  };

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { level: 'Alto', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { level: 'Médio', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 40) return { level: 'Baixo', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'Muito Baixo', color: 'text-red-600', bg: 'bg-red-100' };
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

  if (loading && !engagement) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando engajamento...</span>
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
            <Activity className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Engajamento do Lead
              </h3>
              <p className="text-sm text-gray-500">
                Histórico de interações e atividades
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddActivity(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Atividade
            </button>
            <button
              onClick={() => leadId && getEngagement()}
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
        {!engagement ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum dado de engajamento
            </h4>
            <p className="text-gray-500">
              Dados de engajamento serão exibidos quando disponíveis
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Engagement Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Score de Engajamento
                  </span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {engagement.engagement_score || 0}
                </p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-1 ${
                  getEngagementLevel(engagement.engagement_score || 0).bg
                }`}>
                  <span className={getEngagementLevel(engagement.engagement_score || 0).color}>
                    {getEngagementLevel(engagement.engagement_score || 0).level}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Total de Atividades
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {engagement.total_activities || 0}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    Última Atividade
                  </span>
                </div>
                <p className="text-sm font-bold text-purple-900">
                  {engagement.last_activity_at ? formatDate(engagement.last_activity_at) : 'Nunca'}
                </p>
              </div>
            </div>

            {/* Activity Types */}
            {engagement.activity_types && engagement.activity_types.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Tipos de Atividade
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {engagement.activity_types.map((type, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="flex justify-center mb-2">
                        {getActivityIcon(type.type)}
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {getActivityTypeName(type.type)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {type.count} atividades
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activities */}
            {engagement.activities && engagement.activities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Atividades Recentes
                </h4>
                <div className="space-y-3">
                  {engagement.activities.slice(0, 10).map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {getActivityTypeName(activity.type)}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatDate(activity.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        {activity.user_name && (
                          <p className="text-xs text-gray-500 mt-1">
                            por {activity.user_name}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Engagement Trends */}
            {engagement.trends && engagement.trends.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Tendências de Engajamento
                </h4>
                <div className="space-y-3">
                  {engagement.trends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {trend.direction === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {trend.metric}
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
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      {showAddActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Nova Atividade
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Atividade
                </label>
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="call">Ligação</option>
                  <option value="meeting">Reunião</option>
                  <option value="message">Mensagem</option>
                  <option value="note">Nota</option>
                  <option value="task">Tarefa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descreva a atividade..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agendar para (opcional)
                </label>
                <input
                  type="datetime-local"
                  value={newActivity.scheduled_at}
                  onChange={(e) => setNewActivity({ ...newActivity, scheduled_at: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddActivity(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddActivity}
                disabled={!newActivity.description}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Adicionar Atividade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadEngagement;
