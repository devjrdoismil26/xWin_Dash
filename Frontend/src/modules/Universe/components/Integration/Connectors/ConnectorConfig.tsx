import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const ConnectorConfig: React.FC<{ connectorId: string | null }> = ({ connectorId    }) => (
  <Card className="p-4" />
    <h3 className="font-semibold mb-4">Configuração</h3>
    {connectorId ? (
      <div className="text-sm text-gray-600">Configurar {connectorId}</div>
    ) : (
      <div className="text-sm text-gray-400">Selecione um conector</div>
    )}
  </Card>);
