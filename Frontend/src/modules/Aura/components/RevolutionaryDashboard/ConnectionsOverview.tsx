import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const ConnectionsOverview: React.FC<{ connectionId?: string }> = () => {
  return (
        <>
      <Card className="p-6" />
      <h3 className="text-lg font-semibold mb-4">Conexões WhatsApp</h3>
      <div className="text-gray-600">Status das conexões</div>
    </Card>);};
