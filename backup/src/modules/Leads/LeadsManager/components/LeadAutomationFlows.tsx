import React, { useState } from 'react';
import { 
  Workflow, 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Save, 
  X,
  RefreshCw,
  Clock,
  Users,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { LeadAutomationFlow } from '../../types';

interface LeadAutomationFlowsProps {
  onFlowChange?: (flows: LeadAutomationFlow[]) => void;
}

const LeadAutomationFlows: React.FC<LeadAutomationFlowsProps> = ({ onFlowChange }) => {
  const {
    automations,
    loading,
    error,
    getAutomations,
    createAutomation
  } = useLeadAutomation();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger_type: 'lead_created',
    trigger_conditions: {},
    actions: [],
    is_active: true
  });

  const handleCreateFlow = async () => {
    const result = await createAutomation(formData);
    if (result) {
      setShowForm(false);
      resetForm();
      onFlowChange?.(automations);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      trigger_type: 'lead_created',
      trigger_conditions: {},
      actions: [],
      is_active: true
    });
  };

  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'lead_created':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'lead_status_changed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'lead_score_changed':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'time_based':
        return <Clock className="w-4 h-4 text-purple-600" />;
      default:
        return <Workflow className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTriggerText = (triggerType: string) => {
    const triggers: { [key: string]: string } = {
      lead_created: 'Lead criado',
      lead_status_changed: 'Status alterado',
      lead_score_changed: 'Score alterado',
      time_based: 'Baseado em tempo',
      lead_updated: 'Lead atualizado',
      lead_assigned: 'Lead atribuído'
    };
    return triggers[triggerType] || triggerType;
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'send_email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'make_call':
        return <Phone className="w-4 h-4 text-green-600" />;
      case 'send_sms':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'create_task':
        return <Calendar className="w-4 h-4 text-orange-600" />;
      case 'assign_user':
        return <Users className="w-4 h-4 text-indigo-600" />;
      default:
        return <Workflow className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionText = (actionType: string) => {
    const actions: { [key: string]: string } = {
      send_email: 'Enviar Email',
      make_call: 'Fazer Ligação',
      send_sms: 'Enviar SMS',
      create_task: 'Criar Tarefa',
      assign_user: 'Atribuir Usuário',
      update_status: 'Atualizar Status',
      add_tag: 'Adicionar Tag',
      send_notification: 'Enviar Notificação'
    };
    return actions[actionType] || actionType;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600' : 'text-gray-400';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Ativo' : 'Inativo';
  };

  if (loading && automations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando automações...</span>
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
                {automations.length} fluxos configurados
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Fluxo
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {automations.length === 0 ? (
          <div className="text-center py-8">
            <Workflow className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum fluxo de automação
            </h4>
            <p className="text-gray-500 mb-4">
              Crie fluxos para automatizar ações com seus leads
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Criar Primeiro Fluxo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {automations.map((flow) => (
              <div
                key={flow.id}
                className={`border rounded-lg p-4 transition-colors ${
                  flow.is_active 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {flow.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        flow.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusText(flow.is_active)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {flow.description}
                    </p>

                    {/* Trigger */}
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-500">Quando:</span>
                        {getTriggerIcon(flow.trigger_type)}
                        <span className="font-medium text-gray-900">
                          {getTriggerText(flow.trigger_type)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <span className="text-sm text-gray-500">Então:</span>
                      {flow.actions.map((action, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm ml-4">
                          {getActionIcon(action.type)}
                          <span className="text-gray-900">
                            {getActionText(action.type)}
                          </span>
                          {action.delay && (
                            <span className="text-gray-500">
                              (após {action.delay} minutos)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <span>Execuções: {flow.execution_count || 0}</span>
                      <span>Última execução: {flow.last_executed_at ? new Date(flow.last_executed_at).toLocaleDateString('pt-BR') : 'Nunca'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      className={`p-2 rounded-md ${
                        flow.is_active 
                          ? 'text-yellow-600 hover:bg-yellow-100' 
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                      title={flow.is_active ? 'Pausar' : 'Ativar'}
                    >
                      {flow.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
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
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Novo Fluxo de Automação
              </h4>
              <button
                onClick={() => {
                  setShowForm(false);
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
                  Nome do Fluxo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Follow-up automático"
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
                  placeholder="Descrição do fluxo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gatilho
                </label>
                <select
                  value={formData.trigger_type}
                  onChange={(e) => setFormData({ ...formData, trigger_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="lead_created">Lead criado</option>
                  <option value="lead_status_changed">Status alterado</option>
                  <option value="lead_score_changed">Score alterado</option>
                  <option value="time_based">Baseado em tempo</option>
                  <option value="lead_updated">Lead atualizado</option>
                  <option value="lead_assigned">Lead atribuído</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <strong>Próximos passos:</strong> Após criar o fluxo, você poderá configurar as ações e condições específicas.
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Fluxo ativo
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateFlow}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Criar Fluxo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadAutomationFlows;
