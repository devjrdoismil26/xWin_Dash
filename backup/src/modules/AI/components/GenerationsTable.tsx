import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
const GenerationsTable = React.memo(function GenerationsTable({ generations = [], onView, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getProviderIcon = (provider) => {
    switch (provider) {
      case 'openai': return '🤖';
      case 'claude': return '🧠';
      case 'gemini': return '💎';
      default: return '🔮';
    }
  };
  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  if (!generations || generations.length === 0) {
    return (
      <Card>
        <Card.Content className="text-center py-8">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-lg font-medium">Nenhuma geração encontrada</p>
            <p className="text-sm">Suas gerações de IA aparecerão aqui</p>
          </div>
        </Card.Content>
      </Card>
    );
  }
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        {generations.length} gerações encontradas
      </div>
      {generations.map((generation) => (
        <Card key={generation.id} className="hover:shadow-md transition-shadow">
          <Card.Content className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">
                    {getProviderIcon(generation.provider)}
                  </span>
                  <span className="font-medium text-gray-900">
                    {generation.provider || 'Desconhecido'}
                  </span>
                  <Badge className={getStatusColor(generation.status)}>
                    {generation.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatDate(generation.created_at)}
                  </span>
                </div>
                {/* Prompt Preview */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-medium">Prompt:</span> {generation.prompt || generation.input_text || 'N/A'}
                  </p>
                </div>
                {/* Metrics */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>🎯 {generation.tokens_used || 0} tokens</span>
                  {generation.cost && (
                    <span>💰 ${generation.cost.toFixed(4)}</span>
                  )}
                  <span>🔧 {generation.model || 'N/A'}</span>
                  {generation.processing_time_ms && (
                    <span>⚡ {generation.processing_time_ms}ms</span>
                  )}
                </div>
                {/* Expanded Content */}
                {expandedId === generation.id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Resultado:</h4>
                        <div className="bg-gray-50 rounded-lg p-3 text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {generation.result || generation.output_text || 'Nenhum resultado disponível'}
                        </div>
                      </div>
                      {generation.error_message && (
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-red-600">Erro:</h4>
                          <div className="bg-red-50 rounded-lg p-3 text-sm text-red-700">
                            {generation.error_message}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleExpanded(generation.id)}
                >
                  {expandedId === generation.id ? '👁️‍🗨️ Menos' : '👁️ Ver'}
                </Button>
                {onView && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(generation)}
                  >
                    📋 Detalhes
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(generation.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    🗑️ Excluir
                  </Button>
                )}
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
});
export default GenerationsTable;
