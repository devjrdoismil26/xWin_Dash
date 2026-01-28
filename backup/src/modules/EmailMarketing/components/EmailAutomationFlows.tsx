import React, { useState } from 'react';
import { 
  Workflow, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Plus,
  RefreshCw,
  TrendingUp,
  Users,
  Mail,
  Target,
  Clock,
  BarChart3,
  Eye,
  Settings,
  X
} from 'lucide-react';
import { useEmailAutomationFlows } from '../hooks/useEmailMarketingAdvanced';
import { EmailAutomationFlow } from '../types/emailTypes';

interface EmailAutomationFlowsProps {
  onFlowSelect?: (flow: EmailAutomationFlow) => void;
}

const EmailAutomationFlows: React.FC<EmailAutomationFlowsProps> = ({ onFlowSelect }) => {
  const {
    flows,
    loading,
    error,
    getFlows,
    getFlow,
    activateFlow,
    deactivateFlow
  } = useEmailAutomationFlows();

  const [selectedFlow, setSelectedFlow] = useState<EmailAutomationFlow | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleFlowSelect = async (flow: EmailAutomationFlow) => {
    const flowDetails = await getFlow(flow.id);
    if (flowDetails) {
      setSelectedFlow(flowDetails);
      setShowDetails(true);
      onFlowSelect?.(flowDetails);
    }
  };

  const handleToggleFlow = async (flow: EmailAutomationFlow) => {
    if (flow.status === 'active') {
      await deactivateFlow(flow.id);
    } else {
      await activateFlow(flow.id);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || colors.draft;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4 text-green-600" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-600" />;
      case 'completed':
        return <Target className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading && flows.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando fluxos de automação...</span>
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
            <Workflow className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Fluxos de Automação
              </h3>
              <p className="text-sm text-gray-500">
                {flows.length} fluxos configurados
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={getFlows}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Fluxo
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {flows.length === 0 ? (
          <div className="text-center py-8">
            <Workflow className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum fluxo de automação
            </h4>
            <p className="text-gray-500 mb-4">
              Crie fluxos para automatizar suas campanhas de email
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Plus className="w-4 h-4 inline mr-2" />
              Criar Primeiro Fluxo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows.map((flow) => (
              <div
                key={flow.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => handleFlowSelect(flow)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {flow.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {flow.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFlow(flow);
                      }}
                      className={`p-1 rounded-md ${
                        flow.status === 'active' 
                          ? 'text-yellow-600 hover:bg-yellow-100' 
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                      title={flow.status === 'active' ? 'Pausar' : 'Ativar'}
                    >
                      {flow.status === 'active' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle delete
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(flow.status)}`}>
                      {flow.status}
                    </span>
                    {getStatusIcon(flow.status)}
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Users className="w-3 h-3 text-blue-600" />
                        <span className="text-gray-500">Subscribers</span>
                      </div>
                      <p className="font-bold text-gray-900">
                        {formatNumber(flow.performance.total_subscribers)}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Mail className="w-3 h-3 text-green-600" />
                        <span className="text-gray-500">Emails</span>
                      </div>
                      <p className="font-bold text-gray-900">
                        {formatNumber(flow.performance.emails_sent)}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-purple-600" />
                        <span className="text-gray-500">Open Rate</span>
                      </div>
                      <p className="font-bold text-gray-900">
                        {((flow.performance.emails_opened / flow.performance.emails_sent) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Target className="w-3 h-3 text-orange-600" />
                        <span className="text-gray-500">Conversion</span>
                      </div>
                      <p className="font-bold text-gray-900">
                        {flow.performance.conversion_rate.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Steps Count */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{flow.steps.length} passos</span>
                    <span>Criado em {formatDate(flow.created_at)}</span>
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

      {/* Flow Details Modal */}
      {showDetails && selectedFlow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {selectedFlow.name}
              </h4>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Flow Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3">
                  {selectedFlow.description}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedFlow.status)}`}>
                    {selectedFlow.status}
                  </span>
                  <span className="text-gray-500">
                    Criado em {formatDate(selectedFlow.created_at)}
                  </span>
                  <span className="text-gray-500">
                    Atualizado em {formatDate(selectedFlow.updated_at)}
                  </span>
                </div>
              </div>

              {/* Performance Overview */}
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-3">
                  Performance Overview
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-blue-600">Total Subscribers</p>
                    <p className="text-lg font-bold text-blue-900">
                      {formatNumber(selectedFlow.performance.total_subscribers)}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <Mail className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-green-600">Emails Sent</p>
                    <p className="text-lg font-bold text-green-900">
                      {formatNumber(selectedFlow.performance.emails_sent)}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-purple-600">Open Rate</p>
                    <p className="text-lg font-bold text-purple-900">
                      {((selectedFlow.performance.emails_opened / selectedFlow.performance.emails_sent) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <Target className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-xs text-orange-600">Conversion Rate</p>
                    <p className="text-lg font-bold text-orange-900">
                      {selectedFlow.performance.conversion_rate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Flow Steps */}
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-3">
                  Fluxo de Passos
                </h5>
                <div className="space-y-2">
                  {selectedFlow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {step.type}
                        </p>
                        {step.delay && (
                          <p className="text-xs text-gray-500">
                            Delay: {step.delay} {step.delay_unit}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-yellow-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Fechar
                </button>
                <button
                  onClick={() => handleToggleFlow(selectedFlow)}
                  className={`px-4 py-2 rounded-md ${
                    selectedFlow.status === 'active'
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedFlow.status === 'active' ? 'Pausar' : 'Ativar'} Fluxo
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAutomationFlows;
