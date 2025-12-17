import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const ConnectorsList: React.FC<{ onSelect?: (e: any) => void }> = ({ onSelect }) => (
  <Card className="p-4" />
    <h3 className="font-semibold mb-4">Conectores Disponíveis</h3>
    <div className="{['API REST', 'GraphQL', 'WebSocket', 'Database'].map(name => (">$2</div>
        <div key={name} onClick={() => onSelect(name)} className="p-3 border rounded cursor-pointer hover:bg-gray-50">
          {name}
        </div>
      ))}
    </div>
  </Card>);
