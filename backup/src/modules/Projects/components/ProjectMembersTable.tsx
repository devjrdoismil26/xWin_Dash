import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ProjectMembersTableProps, ProjectMember, ProjectRole } from '../types/projectTypes';
const ProjectMembersTable: React.FC<ProjectMembersTableProps> = ({ 
  members, 
  loading, 
  error, 
  onMemberUpdate, 
  onMemberRemove, 
  canManage = false 
}) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Membros do Projeto</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </Card.Content>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Membros do Projeto</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-center text-red-500">
          Erro: {error}
        </Card.Content>
      </Card>
    );
  }
  const getRoleColor = (role: ProjectRole): string => {
    const colors = {
      owner: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800',
      editor: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };
  const getRoleLabel = (role: ProjectRole): string => {
    const labels = {
      owner: 'Proprietário',
      admin: 'Administrador',
      editor: 'Editor',
      viewer: 'Visualizador'
    };
    return labels[role] || role;
  };
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  if (members.length === 0) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Membros do Projeto</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-center text-gray-500">
          Nenhum membro encontrado
        </Card.Content>
      </Card>
    );
  }
  return (
    <Card>
      <Card.Header>
        <Card.Title>Membros do Projeto ({members.length})</Card.Title>
      </Card.Header>
      <Card.Content className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrou em
                </th>
                {canManage && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {member.user?.avatar ? (
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={member.user.avatar} 
                            alt={member.user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {member.user?.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.user?.name || 'Usuário não encontrado'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.user?.email || 'Email não disponível'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getRoleColor(member.role)}>
                      {getRoleLabel(member.role)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(member.joined_at)}
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {member.role !== 'owner' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onMemberUpdate?.(member)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onMemberRemove?.(member.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remover
                            </Button>
                          </>
                        )}
                        {member.role === 'owner' && (
                          <span className="text-xs text-gray-500">
                            Proprietário
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card.Content>
    </Card>
  );
};
export default ProjectMembersTable;
