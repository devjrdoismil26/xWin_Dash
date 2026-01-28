import React, { useState, useEffect } from 'react';
import { useAnalyticsAdvanced } from '../hooks/useAnalyticsAdvanced';
import { AnalyticsCohort } from '../types/analyticsTypes';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Users,
  Plus,
  Pencil,
  Trash2,
  BarChart3,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

interface AnalyticsCohortAnalyzerProps {
  cohortId?: string;
  className?: string;
}

export const AnalyticsCohortAnalyzer: React.FC<AnalyticsCohortAnalyzerProps> = ({
  cohortId,
  className = ''
}) => {
  const {
    cohorts,
    cohortsLoading,
    cohortsError,
    fetchCohorts,
    createCohort,
    updateCohort,
    deleteCohort
  } = useAnalyticsAdvanced();

  const [selectedCohort, setSelectedCohort] = useState<AnalyticsCohort | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCohortData, setNewCohortData] = useState({
    name: '',
    description: '',
    cohort_type: 'retention',
    period: 'week',
    metric: 'active_users'
  });

  useEffect(() => {
    fetchCohorts();
  }, [fetchCohorts]);

  useEffect(() => {
    if (cohortId && cohorts.length > 0) {
      const cohort = cohorts.find(c => c.id === cohortId);
      if (cohort) {
        setSelectedCohort(cohort);
      }
    }
  }, [cohortId, cohorts]);

  const handleCreateCohort = async () => {
    if (!newCohortData.name.trim()) return;

    const success = await createCohort(newCohortData);
    if (success) {
      setNewCohortData({
        name: '',
        description: '',
        cohort_type: 'retention',
        period: 'week',
        metric: 'active_users'
      });
      setIsCreating(false);
    }
  };

  const handleSaveCohort = async () => {
    if (!selectedCohort) return;

    const success = await updateCohort(selectedCohort.id, selectedCohort);
    if (success) {
      await fetchCohorts();
    }
  };

  // Mock cohort data - in real implementation, this would come from analytics
  const generateCohortData = () => {
    const periods = 12; // 12 weeks
    const cohorts = 8; // 8 cohorts
    
    const data = [];
    for (let i = 0; i < cohorts; i++) {
      const cohort = {
        period: `Semana ${i + 1}`,
        size: Math.floor(Math.random() * 1000) + 100,
        retention: []
      };
      
      for (let j = 0; j < periods; j++) {
        if (j === 0) {
          cohort.retention.push(100); // Week 0 is always 100%
        } else {
          // Simulate retention decay
          const baseRetention = Math.max(20, 100 - (j * 8) - Math.random() * 20);
          cohort.retention.push(Math.round(baseRetention));
        }
      }
      
      data.push(cohort);
    }
    
    return data;
  };

  const cohortData = generateCohortData();

  const getRetentionColor = (retention: number) => {
    if (retention >= 80) return 'bg-green-500';
    if (retention >= 60) return 'bg-yellow-500';
    if (retention >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRetentionTextColor = (retention: number) => {
    if (retention >= 80) return 'text-green-900';
    if (retention >= 60) return 'text-yellow-900';
    if (retention >= 40) return 'text-orange-900';
    return 'text-red-900';
  };

  const getCohortTypeColor = (type: string) => {
    switch (type) {
      case 'acquisition': return 'blue';
      case 'behavioral': return 'green';
      case 'retention': return 'purple';
      default: return 'gray';
    }
  };

  const getPeriodColor = (period: string) => {
    switch (period) {
      case 'day': return 'blue';
      case 'week': return 'green';
      case 'month': return 'purple';
      default: return 'gray';
    }
  };

  if (cohortsLoading) {
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

  if (cohortsError) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-red-600">
          <p>Erro ao carregar cohorts: {cohortsError}</p>
          <Button 
            onClick={fetchCohorts}
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
              Analisador de Cohorts
            </h2>
            <p className="text-gray-600 mt-1">
              Analise a retenção e comportamento dos usuários ao longo do tempo
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
              Nova Cohort
            </Button>
          </div>
        </div>
      </Card>

      {/* Cohort Selector */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Selecionar Cohort
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cohorts.map((cohort) => (
            <div
              key={cohort.id}
              onClick={() => setSelectedCohort(cohort)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedCohort?.id === cohort.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  {cohort.name}
                </h4>
                <Badge variant={cohort.is_active ? 'success' : 'gray'} size="sm">
                  {cohort.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              
              {cohort.description && (
                <p className="text-sm text-gray-600 mb-2">
                  {cohort.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={getCohortTypeColor(cohort.cohort_type)} size="sm">
                  {cohort.cohort_type}
                </Badge>
                <Badge variant={getPeriodColor(cohort.period)} size="sm">
                  {cohort.period}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  {cohort.metric}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(cohort.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Cohort Form */}
      {isCreating && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Criar Nova Cohort
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Cohort
              </label>
              <input
                type="text"
                value={newCohortData.name}
                onChange={(e) => setNewCohortData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Ex: Usuários de Janeiro 2024"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Cohort
              </label>
              <select
                value={newCohortData.cohort_type}
                onChange={(e) => setNewCohortData(prev => ({ ...prev, cohort_type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="retention">Retenção</option>
                <option value="acquisition">Aquisição</option>
                <option value="behavioral">Comportamental</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Período
              </label>
              <select
                value={newCohortData.period}
                onChange={(e) => setNewCohortData(prev => ({ ...prev, period: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="day">Dia</option>
                <option value="week">Semana</option>
                <option value="month">Mês</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Métrica
              </label>
              <select
                value={newCohortData.metric}
                onChange={(e) => setNewCohortData(prev => ({ ...prev, metric: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="active_users">Usuários Ativos</option>
                <option value="sessions">Sessões</option>
                <option value="page_views">Visualizações</option>
                <option value="conversions">Conversões</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={newCohortData.description}
              onChange={(e) => setNewCohortData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows={3}
              placeholder="Descreva o propósito desta cohort"
            />
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleCreateCohort}
              variant="primary"
              size="sm"
              disabled={!newCohortData.name.trim()}
            >
              Criar Cohort
            </Button>
            <Button
              onClick={() => {
                setIsCreating(false);
                setNewCohortData({
                  name: '',
                  description: '',
                  cohort_type: 'retention',
                  period: 'week',
                  metric: 'active_users'
                });
              }}
              variant="outline"
              size="sm"
            >
              Cancelar
            </Button>
          </div>
        </Card>
      )}

      {/* Cohort Analysis */}
      {selectedCohort && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedCohort.name}
              </h3>
              {selectedCohort.description && (
                <p className="text-gray-600 mt-1">
                  {selectedCohort.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getCohortTypeColor(selectedCohort.cohort_type)} size="sm">
                  {selectedCohort.cohort_type}
                </Badge>
                <Badge variant={getPeriodColor(selectedCohort.period)} size="sm">
                  {selectedCohort.period}
                </Badge>
                <Badge variant="info" size="sm">
                  {selectedCohort.metric}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSaveCohort}
                variant="primary"
                size="sm"
              >
                Salvar Alterações
              </Button>
              <Button
                onClick={() => setSelectedCohort(null)}
                variant="outline"
                size="sm"
              >
                Fechar
              </Button>
            </div>
          </div>

          {/* Cohort Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cohort
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamanho
                  </th>
                  {Array.from({ length: 12 }, (_, i) => (
                    <th key={i} className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {i === 0 ? 'Semana 0' : `Semana ${i}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cohortData.map((cohort, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {cohort.period}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {cohort.size.toLocaleString()}
                    </td>
                    {cohort.retention.map((retention, weekIndex) => (
                      <td key={weekIndex} className="px-2 py-3 text-center">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRetentionColor(retention)} ${getRetentionTextColor(retention)}`}>
                          {retention}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cohort Statistics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Retenção Semana 1</h4>
              <div className="text-2xl font-bold text-blue-900">
                {cohortData.length > 0 ? cohortData[0].retention[1] : 0}%
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Retenção Semana 4</h4>
              <div className="text-2xl font-bold text-green-900">
                {cohortData.length > 0 ? cohortData[0].retention[4] : 0}%
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Retenção Semana 8</h4>
              <div className="text-2xl font-bold text-yellow-900">
                {cohortData.length > 0 ? cohortData[0].retention[8] : 0}%
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Retenção Semana 12</h4>
              <div className="text-2xl font-bold text-purple-900">
                {cohortData.length > 0 ? cohortData[0].retention[11] : 0}%
              </div>
            </div>
          </div>

          {/* Cohort Insights */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Insights da Cohort
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h5 className="font-medium text-green-900">Tendência Positiva</h5>
                </div>
                <p className="text-sm text-green-700">
                  A retenção na semana 4 está 15% acima da média histórica, indicando melhor engajamento dos usuários.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-yellow-600" />
                  <h5 className="font-medium text-yellow-900">Área de Melhoria</h5>
                </div>
                <p className="text-sm text-yellow-700">
                  A retenção na semana 8 está 8% abaixo da média. Considere implementar estratégias de re-engajamento.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!selectedCohort && !isCreating && cohorts.length === 0 && (
        <Card className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma cohort encontrada</p>
            <p className="text-sm">Crie sua primeira cohort para começar a analisar retenção</p>
            <Button
              onClick={() => setIsCreating(true)}
              variant="primary"
              size="sm"
              className="mt-4"
            >
              Criar Primeira Cohort
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsCohortAnalyzer;
