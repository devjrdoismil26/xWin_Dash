/**
 * Componente de Contas Conectadas do ADStool
 * Exibe lista de contas conectadas
 */
import React from 'react';
import { CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface ADStoolConnectedAccountsProps {
  connectedAccounts: any[];
}

const ADStoolConnectedAccounts: React.FC<ADStoolConnectedAccountsProps> = ({
  connectedAccounts
}) => {
  if (connectedAccounts.length === 0) {
    return null;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Contas Conectadas</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedAccounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{account.name}</p>
                  <Badge variant="outline">{account.platform}</Badge>
                </div>
              </div>
              <Badge variant="success">Conectada</Badge>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
};

export default ADStoolConnectedAccounts;
