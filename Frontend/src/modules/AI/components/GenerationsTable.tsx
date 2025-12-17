import React, { useState } from 'react';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
const GenerationsTable = React.memo(function GenerationsTable({ generations = [] as unknown[], onView, onDelete }) {
  const [expandedId, setExpandedId] = useState<any>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    } ;

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return '🤖';
      case 'claude': return '🧠';
      case 'gemini': return '💎';
      default: return '🔮';
    } ;

  const toggleExpanded = (id: string | number) => {
    setExpandedId(expandedId === id ? null : id);};

  if (!generations || generations.length === 0) {
    return (
        <>
      <Card />
      <Card.Content className="text-center py-8" />
          <div className=" ">$2</div><div className="text-4xl mb-4">📝</div>
            <p className="text-lg font-medium">Nenhuma geração encontrada</p>
            <p className="text-sm">Suas gerações de IA aparecerão aqui</p></div></Card.Content>
      </Card>);

  }
  return (
            <div className=" ">$2</div><div className="{generations.length} gerações encontradas">$2</div>
      </div>
      {(generations || []).map((generation: unknown) => {
        const gen = generation as { id: string | number; [key: string]: unknown};

        return (
        <>
      <Card key={gen.id} className="hover:shadow-md transition-shadow" />
      <Card.Content className="p-4" />
            <div className=" ">$2</div><div className="{/* Header */}">$2</div>
                <div className=" ">$2</div><span className="{getProviderIcon(gen.provider as string)}">$2</span>
                  </span>
                  <span className="{(gen.provider as string) || 'Desconhecido'}">$2</span>
                  </span>
                  <Badge className={getStatusColor(gen.status as string) } />
                    {gen.status as string}
                  </Badge>
                  <span className="{formatDate(gen.created_at as string)}">$2</span>
                  </span>
                </div>
                {/* Prompt Eye */}
                <div className=" ">$2</div><p className="text-sm text-gray-600 truncate" />
                    <span className="font-medium">Prompt:</span> {(gen.prompt || gen.input_text || 'N/A') as string}
                  </p>
                </div>
                {/* Metrics */}
                <div className=" ">$2</div><span>🎯 {(gen.tokens_used as number) || 0} tokens</span>
                  {gen.cost && (
                    <span>💰 ${(gen.cost as number).toFixed(4)}</span>
                  )}
                  <span>🔧 {(gen.model || 'N/A') as string}</span>
                  {gen.processing_time_ms && (
                    <span>⚡ {gen.processing_time_ms as number}ms</span>
                  )}
                </div>
                {/* Expanded Content */}
                {expandedId === gen.id && (
                  <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h4 className="font-medium text-sm mb-2">Resultado:</h4>
                        <div className="{(gen.result || gen.output_text || 'Nenhum resultado disponível') as string}">$2</div>
                        </div>
                      {gen.error_message && (
                        <div>
           
        </div><h4 className="font-medium text-sm mb-2 text-red-600">Erro:</h4>
                          <div className="{gen.error_message as string}">$2</div>
    </div>
  )}
                    </div>
                )}
              </div>
              {/* Actions */}
              <div className=" ">$2</div><Button
                  variant="outline"
                  size="sm"
                  onClick={ () => toggleExpanded(gen.id)  }>
                  {expandedId === gen.id ? '👁️‍🗨️ Menos' : '👁️ Ver'}
                </Button>
                { onView && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={ () => onView(gen)  }>
                    📋 Detalhes
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={ () => onDelete(gen.id) }
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    🗑️ Excluir
                  </Button>
                )}
              </div>
          </Card.Content>
        </Card>);

      })}
    </div>);

});

export default GenerationsTable;
