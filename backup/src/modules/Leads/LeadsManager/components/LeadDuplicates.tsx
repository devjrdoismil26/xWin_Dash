import React, { useState } from 'react';
import { 
  Users, 
  Merge, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { LeadDuplicate } from '../../types';

interface LeadDuplicatesProps {
  onMergeComplete?: (result: any) => void;
}

const LeadDuplicates: React.FC<LeadDuplicatesProps> = ({ onMergeComplete }) => {
  const {
    duplicates,
    loading,
    error,
    getDuplicates,
    mergeLeads
  } = useLeadDuplicates();

  const [selectedDuplicates, setSelectedDuplicates] = useState<string[]>([]);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeStrategy, setMergeStrategy] = useState<'keep_newest' | 'keep_oldest' | 'manual'>('keep_newest');
  const [mergeLoading, setMergeLoading] = useState(false);

  const handleSelectDuplicate = (duplicateId: string) => {
    setSelectedDuplicates(prev => 
      prev.includes(duplicateId) 
        ? prev.filter(id => id !== duplicateId)
        : [...prev, duplicateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDuplicates.length === duplicates.length) {
      setSelectedDuplicates([]);
    } else {
      setSelectedDuplicates(duplicates.map(d => d.id));
    }
  };

  const handleMerge = async () => {
    if (selectedDuplicates.length < 2) return;

    setMergeLoading(true);
    try {
      const mergeData = {
        duplicate_ids: selectedDuplicates,
        strategy: mergeStrategy
      };

      const result = await mergeLeads(mergeData);
      if (result) {
        setSelectedDuplicates([]);
        setShowMergeModal(false);
        onMergeComplete?.(result);
      }
    } finally {
      setMergeLoading(false);
    }
  };

  const getDuplicateIcon = (confidence: number) => {
    if (confidence >= 90) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (confidence >= 70) {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
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

  if (loading && duplicates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando duplicatas...</span>
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
                Leads Duplicados
              </h3>
              <p className="text-sm text-gray-500">
                {duplicates.length} grupos de duplicatas encontrados
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={getDuplicates}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {selectedDuplicates.length >= 2 && (
              <button
                onClick={() => setShowMergeModal(true)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Merge className="w-4 h-4 mr-2" />
                Mesclar ({selectedDuplicates.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {duplicates.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma duplicata encontrada
            </h4>
            <p className="text-gray-500">
              Todos os leads são únicos no sistema
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center space-x-2 pb-4 border-b border-gray-200">
              <input
                type="checkbox"
                checked={selectedDuplicates.length === duplicates.length && duplicates.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Selecionar todos ({selectedDuplicates.length}/{duplicates.length})
              </span>
            </div>

            {/* Duplicates List */}
            {duplicates.map((duplicate) => (
              <div
                key={duplicate.id}
                className={`border rounded-lg p-4 transition-colors ${
                  selectedDuplicates.includes(duplicate.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedDuplicates.includes(duplicate.id)}
                    onChange={() => handleSelectDuplicate(duplicate.id)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getDuplicateIcon(duplicate.confidence)}
                        <span className="text-sm font-medium text-gray-900">
                          {duplicate.leads.length} leads similares
                        </span>
                        <span className={`text-xs font-medium ${getConfidenceColor(duplicate.confidence)}`}>
                          {duplicate.confidence}% de confiança
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lead Details */}
                    <div className="space-y-2">
                      {duplicate.leads.map((lead, index) => (
                        <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {lead.name?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {lead.name || 'Nome não informado'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {lead.email} • {lead.phone || 'Sem telefone'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              Criado em {formatDate(lead.created_at)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Score: {lead.score || 0}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Similarity Details */}
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <p className="text-xs text-blue-700">
                        <strong>Campos similares:</strong> {duplicate.similar_fields.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Merge Modal */}
      {showMergeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Mesclar Leads Duplicados
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estratégia de Mesclagem
                </label>
                <select
                  value={mergeStrategy}
                  onChange={(e) => setMergeStrategy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="keep_newest">Manter o mais recente</option>
                  <option value="keep_oldest">Manter o mais antigo</option>
                  <option value="manual">Seleção manual</option>
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Atenção:</strong> Esta ação não pode ser desfeita. 
                  Os leads selecionados serão mesclados em um único lead.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowMergeModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleMerge}
                disabled={mergeLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {mergeLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Merge className="w-4 h-4 mr-2" />
                )}
                Mesclar Leads
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDuplicates;
