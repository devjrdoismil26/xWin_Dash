import React from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { AdminProjectTableProps, Project, ProjectStatus, ProjectPriority } from '../types/projectTypes';
const AdminProjectTable: React.FC<AdminProjectTableProps> = ({ projects, 
  loading, 
  error, 
  onProjectUpdate, 
  onProjectDelete 
   }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Projetos</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="{[...Array(5)].map((_: unknown, index: unknown) => (">$2</div>
      <div key={index} className="h-16 bg-gray-200 rounded">
    </>
  ))}
        </div>
          </div>
        </Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Projetos</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-center text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  const getStatusColor = (status: ProjectStatus): string => {
    const colors = {
      planning: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      on_hold: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'};

    return colors[status] || 'bg-gray-100 text-gray-800';};

  const getPriorityColor = (priority: ProjectPriority): string => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'};

    return colors[priority] || 'bg-gray-100 text-gray-800';};

  const getStatusLabel = (status: ProjectStatus): string => {
    const labels = {
      planning: 'Planejamento',
      active: 'Ativo',
      on_hold: 'Pausado',
      completed: 'Concluído',
      cancelled: 'Cancelado'};

    return labels[status] || status;};

  const getPriorityLabel = (priority: ProjectPriority): string => {
    const labels = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente'};

    return labels[priority] || priority;};

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Não definida';
    return new Date(dateString).toLocaleDateString('pt-BR');};

  const formatBudget = (budget?: number): string => {
    if (!budget) return 'Não definido';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(budget);};

  if (projects.length === 0) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Projetos</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-center text-gray-500" />
          Nenhum projeto encontrado
        </Card.Content>
      </Card>);

  }
  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Projetos ({projects.length})</Card.Title>
      </Card.Header>
      <Card.Content className="p-0" />
        <div className=" ">$2</div><table className="w-full" />
            <thead className="backdrop-blur-xl bg-white/10 border-white/20 border-b" />
              <tr />
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  Projeto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  Progresso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  Orçamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  Prazo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
                  Ações
                </th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200" />
              {(projects || []).map((project: unknown) => (
                <tr key={project.id} className="hover:bg-gray-50" />
                  <td className="px-6 py-4 whitespace-nowrap" />
                    <div>
           
        </div><div className="{project.name}">$2</div>
                      </div>
                      {project.description && (
                        <div className="{project.description}">$2</div>
    </div>
  )}
                    </div></td><td className="px-6 py-4 whitespace-nowrap" />
                    <Badge className={getStatusColor(project.status) } />
                      {getStatusLabel(project.status)}
                    </Badge></td><td className="px-6 py-4 whitespace-nowrap" />
                    <Badge className={getPriorityColor(project.priority) } />
                      {getPriorityLabel(project.priority)}
                    </Badge></td><td className="px-6 py-4 whitespace-nowrap" />
                    <div className=" ">$2</div><div className=" ">$2</div><div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={width: `${project.progress} %` } />
           
        </div><span className="{project.progress}%">$2</span>
                      </span></div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" />
                    {formatBudget(project.budget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" />
                    {formatDate(project.end_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" />
                    <div className=" ">$2</div><Button
                        variant="outline"
                        size="sm"
                        onClick={ () => onProjectUpdate?.(project)  }>
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={ () => onProjectDelete?.(project.id) }
                        className="text-red-600 hover:text-red-700"
                      >
                        Excluir
                      </Button></div></td>
      </tr>
    </>
  ))}
            </tbody></table></div>
      </Card.Content>
    </Card>);};

export default AdminProjectTable;
