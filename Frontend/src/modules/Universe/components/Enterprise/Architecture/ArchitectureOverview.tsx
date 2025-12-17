import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const ArchitectureOverview: React.FC<{ organizationId?: string }> = () => (
  <Card className="p-6" />
    <h3 className="text-lg font-semibold mb-4">Visão Geral da Arquitetura</h3>
    <div className="text-gray-600">Diagrama da arquitetura enterprise</div>
  </Card>);
