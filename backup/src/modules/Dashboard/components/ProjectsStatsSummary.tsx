import React from 'react';
import Card from '@/components/ui/Card';
import { ProjectsStatsSummaryProps } from '../types';
const ProjectsStatsSummary: React.FC<ProjectsStatsSummaryProps> = ({ stats, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Resumo de Projetos</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </Card.Content>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Resumo de Projetos</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500">
          Erro: {error}
        </Card.Content>
      </Card>
    );
  }
  return (
    <Card>
      <Card.Header>
        <Card.Title>Resumo de Projetos</Card.Title>
      </Card.Header>
      <Card.Content className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {(stats.totalProjects || 0).toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-gray-600">Total de Projetos</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {(stats.activeProjects || 0).toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-gray-600">Projetos Ativos</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">
              {(stats.completedProjects || 0).toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-gray-600">Concluídos</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded">
            <div className="text-2xl font-bold text-red-600">
              {(stats.overdueProjects || 0).toLocaleString('pt-BR')}
            </div>
            <div className="text-sm text-gray-600">Atrasados</div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
export default ProjectsStatsSummary;
