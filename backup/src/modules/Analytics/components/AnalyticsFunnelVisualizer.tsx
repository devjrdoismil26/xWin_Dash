import React, { useState, useEffect } from 'react';
import { useAnalyticsAdvanced } from '../hooks/useAnalyticsAdvanced';
import { AnalyticsFunnel } from '../types/analyticsTypes';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Filter,
  Plus,
  Pencil,
  Trash2,
  Eye,
  BarChart3,
  ArrowRight,
  User,
  Clock
} from 'lucide-react';

interface AnalyticsFunnelVisualizerProps {
  funnelId?: string;
  className?: string;
}

export const AnalyticsFunnelVisualizer: React.FC<AnalyticsFunnelVisualizerProps> = ({
  funnelId,
  className = ''
}) => {
  const {
    funnels,
    funnelsLoading,
    funnelsError,
    fetchFunnels,
    createFunnel,
    updateFunnel,
    deleteFunnel
  } = useAnalyticsAdvanced();

  const [selectedFunnel, setSelectedFunnel] = useState<AnalyticsFunnel | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [newFunnelData, setNewFunnelData] = useState({
    name: '',
    description: '',
    steps: []
  });

  useEffect(() => {
    fetchFunnels();
  }, [fetchFunnels]);

  useEffect(() => {
    if (funnelId && funnels.length > 0) {
      const funnel = funnels.find(f => f.id === funnelId);
      if (funnel) {
        setSelectedFunnel(funnel);
      }
    }
  }, [funnelId, funnels]);

  const handleCreateFunnel = async () => {
    if (!newFunnelData.name.trim()) return;

    const success = await createFunnel(newFunnelData);
    if (success) {
      setNewFunnelData({ name: '', description: '', steps: [] });
      setIsCreating(false);
    }
  };

  const handleAddStep = () => {
    if (!selectedFunnel) return;

    const newStep = {
      name: `Etapa ${selectedFunnel.steps.length + 1}`,
      event: '',
      conditions: []
    };

    const updatedFunnel = {
      ...selectedFunnel,
      steps: [...selectedFunnel.steps, newStep]
    };

    setSelectedFunnel(updatedFunnel);
    setEditingStep(selectedFunnel.steps.length);
  };

  const handleUpdateStep = (stepIndex: number, stepData: any) => {
    if (!selectedFunnel) return;

    const updatedSteps = [...selectedFunnel.steps];
    updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], ...stepData };

    const updatedFunnel = {
      ...selectedFunnel,
      steps: updatedSteps
    };

    setSelectedFunnel(updatedFunnel);
    setEditingStep(null);
  };

  const handleRemoveStep = (stepIndex: number) => {
    if (!selectedFunnel) return;

    const updatedSteps = selectedFunnel.steps.filter((_, index) => index !== stepIndex);
    const updatedFunnel = {
      ...selectedFunnel,
      steps: updatedSteps
    };

    setSelectedFunnel(updatedFunnel);
  };

  const handleSaveFunnel = async () => {
    if (!selectedFunnel) return;

    const success = await updateFunnel(selectedFunnel.id, selectedFunnel);
    if (success) {
      await fetchFunnels();
    }
  };

  const calculateConversionRate = (stepIndex: number) => {
    if (!selectedFunnel || stepIndex === 0) return 100;
    
    const currentStep = selectedFunnel.steps[stepIndex];
    const previousStep = selectedFunnel.steps[stepIndex - 1];
    
    // Mock data - in real implementation, this would come from analytics
    const currentUsers = Math.floor(Math.random() * 1000) + 100;
    const previousUsers = Math.floor(Math.random() * 1000) + 200;
    
    return Math.round((currentUsers / previousUsers) * 100);
  };

  const getStepColor = (stepIndex: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-orange-500'
    ];
    return colors[stepIndex % colors.length];
  };

  const getStepWidth = (stepIndex: number) => {
    const conversionRate = calculateConversionRate(stepIndex);
    return Math.max(20, conversionRate);
  };

  if (funnelsLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (funnelsError) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-red-600">
          <p>Erro ao carregar funnels: {funnelsError}</p>
          <Button 
            onClick={fetchFunnels}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Tentar Novamente
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Visualizador de Funnels
            </h2>
            <p className="text-gray-600 mt-1">
              Analise e otimize seus funnels de conversão
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCreating(true)}
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Funnel
            </Button>
          </div>
        </div>
      </Card>

      {/* Funnel Selector */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Selecionar Funnel
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {funnels.map((funnel) => (
            <div
              key={funnel.id}
              onClick={() => setSelectedFunnel(funnel)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedFunnel?.id === funnel.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  {funnel.name}
                </h4>
                <Badge variant={funnel.is_active ? 'success' : 'gray'} size="sm">
                  {funnel.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              
              {funnel.description && (
                <p className="text-sm text-gray-600 mb-2">
                  {funnel.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  {funnel.steps.length} etapas
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(funnel.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Funnel Form */}
      {isCreating && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Criar Novo Funnel
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Funnel
              </label>
              <input
                type="text"
                value={newFunnelData.name}
                onChange={(e) => setNewFunnelData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Ex: Funnel de Vendas"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={newFunnelData.description}
                onChange={(e) => setNewFunnelData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                rows={3}
                placeholder="Descreva o propósito deste funnel"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleCreateFunnel}
                variant="primary"
                size="sm"
                disabled={!newFunnelData.name.trim()}
              >
                Criar Funnel
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false);
                  setNewFunnelData({ name: '', description: '', steps: [] });
                }}
                variant="outline"
                size="sm"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Funnel Visualization */}
      {selectedFunnel && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedFunnel.name}
              </h3>
              {selectedFunnel.description && (
                <p className="text-gray-600 mt-1">
                  {selectedFunnel.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSaveFunnel}
                variant="primary"
                size="sm"
              >
                Salvar Alterações
              </Button>
              <Button
                onClick={() => setSelectedFunnel(null)}
                variant="outline"
                size="sm"
              >
                Fechar
              </Button>
            </div>
          </div>

          {/* Funnel Steps */}
          <div className="space-y-4">
            {selectedFunnel.steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className={`p-4 rounded-lg border-2 ${getStepColor(index)} border-opacity-20 bg-opacity-10`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingStep === index ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={step.name}
                            onChange={(e) => handleUpdateStep(index, { name: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-medium"
                          />
                          <input
                            type="text"
                            value={step.event}
                            onChange={(e) => handleUpdateStep(index, { event: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Evento (ex: page_view, button_click)"
                          />
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {step.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Evento: {step.event || 'Não definido'}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {Math.floor(Math.random() * 1000) + 100} usuários
                        </div>
                        <div className="text-xs text-gray-500">
                          {calculateConversionRate(index)}% conversão
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => setEditingStep(editingStep === index ? null : index)}
                        variant="outline"
                        size="sm"
                        title="Editar etapa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        onClick={() => handleRemoveStep(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        title="Remover etapa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Arrow to next step */}
                {index < selectedFunnel.steps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}

            {/* Add Step Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleAddStep}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Etapa
              </Button>
            </div>
          </div>

          {/* Funnel Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Taxa de Conversão Geral</h4>
              <div className="text-2xl font-bold text-blue-900">
                {selectedFunnel.steps.length > 0 
                  ? calculateConversionRate(selectedFunnel.steps.length - 1)
                  : 0}%
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Usuários Iniciais</h4>
              <div className="text-2xl font-bold text-green-900">
                {Math.floor(Math.random() * 1000) + 500}
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Usuários Finais</h4>
              <div className="text-2xl font-bold text-purple-900">
                {Math.floor(Math.random() * 100) + 50}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!selectedFunnel && !isCreating && funnels.length === 0 && (
        <Card className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Filter className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum funnel encontrado</p>
            <p className="text-sm">Crie seu primeiro funnel para começar a analisar conversões</p>
            <Button
              onClick={() => setIsCreating(true)}
              variant="primary"
              size="sm"
              className="mt-4"
            >
              Criar Primeiro Funnel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsFunnelVisualizer;
