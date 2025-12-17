/**
 * @module modules/Dashboard/components/ProjectsStatsSummary
 * @description
 * Componente de resumo de estatísticas de projetos.
 * 
 * Exibe resumo de estatísticas de projetos:
 * - Total de projetos
 * - Projetos ativos
 * - Projetos concluídos
 * - Projetos em atraso
 * 
 * @example
 * ```typescript
 * <ProjectsStatsSummary
 *   stats={
 *     totalProjects: 100,
 *     activeProjects: 50,
 *     completedProjects: 40,
 *     overdueProjects: 10
 *   } *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { ProjectsStatsSummaryProps } from '../types';

/**
 * Componente de resumo de estatísticas de projetos
 * @param {ProjectsStatsSummaryProps} props - Props do componente
 * @returns {JSX.Element} Resumo de estatísticas de projetos
 */
const ProjectsStatsSummary: React.FC<ProjectsStatsSummaryProps> = ({ stats, loading, error    }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Resumo de Projetos</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="h-4 bg-gray-200 rounded w-2/3">
           
        </div></Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Resumo de Projetos</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Resumo de Projetos</Card.Title>
      </Card.Header>
      <Card.Content className="p-4" />
        <div className=" ">$2</div><div className=" ">$2</div><div className="{(stats.totalProjects || 0).toLocaleString('pt-BR')}">$2</div>
            </div>
            <div className="text-sm text-gray-600">Total de Projetos</div>
          <div className=" ">$2</div><div className="{(stats.activeProjects || 0).toLocaleString('pt-BR')}">$2</div>
            </div>
            <div className="text-sm text-gray-600">Projetos Ativos</div>
          <div className=" ">$2</div><div className="{(stats.completedProjects || 0).toLocaleString('pt-BR')}">$2</div>
            </div>
            <div className="text-sm text-gray-600">Concluídos</div>
          <div className=" ">$2</div><div className="{(stats.overdueProjects || 0).toLocaleString('pt-BR')}">$2</div>
            </div>
            <div className="text-sm text-gray-600">Atrasados</div></div></Card.Content>
    </Card>);};

export default ProjectsStatsSummary;
