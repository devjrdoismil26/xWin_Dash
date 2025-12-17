import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const ProjectsOverview: React.FC<{ projectId?: string }> = () => (
  <Card className="p-6" />
    <h3 className="text-lg font-semibold mb-4">Projetos Universe</h3>
    <div className="text-gray-600">Visão geral dos projetos</div>
  </Card>);
