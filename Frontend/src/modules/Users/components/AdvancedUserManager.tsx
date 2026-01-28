import React, { useState, useEffect } from 'react';
import { useUsersAdvanced } from '../hooks/useUsersAdvanced';
import { User, UserFilters, UserBulkUpdate, UserBulkDelete, UserImport } from '../types/userTypes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye,
  Check,
  X,
  UserPlus,
  Download,
  Upload,
  Search,
  Filter,
  Settings,
  UserPlusIcon,
  Search,
  Filter,
  TrashIcon,
  Check,
  X,
  Pencil,
  FileUp,
  FileDown
} from 'lucide-react';

interface AdvancedUserManagerProps {
  className?: string;
}

export const AdvancedUserManager: React.FC<AdvancedUserManagerProps> = ({
  className = ''
}) => {
  const {
    users,
    usersLoading,
    usersError,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    searchUsers,
    getUsersByRole,
    getUsersByStatus,
    bulkUpdateUsers,
    bulkDeleteUsers,
    importUsers,
    exportUsers
  } = useUsersAdvanced();

  const [activeTab, setActiveTab] = useState<'list' | 'bulk' | 'import' | 'export'>('list');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<UserFilters>({
    status: undefined,
    role: undefined,
    page: 1,
    per_page: 10
  });
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  });

  useEffect(() => {
    fetchUsers(filters);
  }, [fetchUsers, filters]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchUsers(searchQuery, filters);
    } else {
      await fetchUsers(filters);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserData.name.trim() || !newUserData.email.trim()) return;

    const success = await createUser(newUserData);
    if (success) {
      setNewUserData({ name: '', email: '', role: 'user', status: 'active' });
      setIsCreating(false);
    }
  };

  const handleUpdateUser = async (userId: string, userData: any) => {
    const success = await updateUser(userId, userData);
    if (success) {
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      await deleteUser(userId);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    await toggleUserStatus(userId);
  };

  const handleBulkUpdate = async (updates: any) => {
    if (selectedUsers.length === 0) return;

    const bulkData: UserBulkUpdate = {
      user_ids: selectedUsers,
      updates,
      reason: 'Bulk update via Advanced User Manager'
    };

    const success = await bulkUpdateUsers(bulkData);
    if (success) {
      setSelectedUsers([]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;

    if (window.confirm(`Tem certeza que deseja excluir ${selectedUsers.length} usuários?`)) {
      const bulkData: UserBulkDelete = {
        user_ids: selectedUsers,
        reason: 'Bulk delete via Advanced User Manager'
      };

      const success = await bulkDeleteUsers(bulkData);
      if (success) {
        setSelectedUsers([]);
      }
    }
  };

  const handleImportUsers = async (file: File) => {
    const importData: UserImport = {
      file,
      mapping: {
        name: 'name',
        email: 'email',
        role: 'role',
        status: 'status'
      },
      options: {
        skip_duplicates: true,
        send_welcome_email: false,
        assign_default_role: true
      }
    };

    await importUsers(importData);
  };

  const handleExportUsers = async () => {
    await exportUsers(filters);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'gray';
      case 'suspended': return 'red';
      default: return 'gray';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'manager': return 'blue';
      case 'user': return 'green';
      case 'guest': return 'gray';
      default: return 'gray';
    }
  };

  const tabs = [
    { id: 'list', label: 'Lista de Usuários', icon: Eye },
    { id: 'bulk', label: 'Operações em Lote', icon: Cog },
    { id: 'import', label: 'Importar', icon: FileUp },
    { id: 'export', label: 'Exportar', icon: FileDown }
  ];

  if (usersLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (usersError) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-red-600">
          <p>Erro ao carregar usuários: {usersError}</p>
          <Button 
            onClick={() => fetchUsers(filters)}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Tentar Novamente
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gerenciamento Avançado de Usuários
            </h2>
            <p className="text-gray-600 mt-1">
              Gerencie usuários, permissões, atividades e muito mais
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="info" size="lg">
              {pagination.total} usuários
            </Badge>
            
            <Button
              onClick={() => setIsCreating(true)}
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            >
              <UserPlusIcon className="h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar usuários..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full"
            />
          </div>
          
          <Button
            onClick={handleSearch}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Buscar
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="suspended">Suspenso</option>
          </select>

          <select
            value={filters.role || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Todas as roles</option>
            <option value="admin">Administrador</option>
            <option value="manager">Gerente</option>
            <option value="user">Usuário</option>
            <option value="guest">Convidado</option>
          </select>

          <Button
            onClick={() => setFilters({ page: 1, per_page: 10 })}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Card className="p-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'list' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Lista de Usuários
              </h3>
              
              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="info" size="sm">
                    {selectedUsers.length} selecionados
                  </Badge>
                  <Button
                    onClick={handleBulkDelete}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Excluir Selecionados
                  </Button>
                </div>
              )}
            </div>

            {/* Create User Form */}
            {isCreating && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-3">Criar Novo Usuário</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Nome completo"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, role: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="user">Usuário</option>
                    <option value="manager">Gerente</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <select
                    value={newUserData.status}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleCreateUser}
                    variant="primary"
                    size="sm"
                    disabled={!newUserData.name.trim() || !newUserData.email.trim()}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Criar
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreating(false);
                      setNewUserData({ name: '', email: '', role: 'user', status: 'active' });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Users List */}
            <div className="space-y-3">
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserPlusIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum usuário encontrado</p>
                  <p className="text-sm">Crie seu primeiro usuário para começar</p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedUsers.includes(user.id) ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(prev => [...prev, user.id]);
                          } else {
                            setSelectedUsers(prev => prev.filter(id => id !== user.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      
                      <div className="flex-shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {user.name}
                          </h4>
                          <Badge variant={getStatusBadgeColor(user.status)} size="sm">
                            {user.status}
                          </Badge>
                          <Badge variant={getRoleBadgeColor(user.role)} size="sm">
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>Criado em {new Date(user.created_at).toLocaleDateString('pt-BR')}</span>
                          {user.last_login_at && (
                            <span>Último login: {new Date(user.last_login_at).toLocaleDateString('pt-BR')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setEditingUser(user)}
                        variant="outline"
                        size="sm"
                        title="Editar usuário"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => handleToggleStatus(user.id)}
                        variant="outline"
                        size="sm"
                        title="Alterar status"
                      >
                        {user.status === 'active' ? 'Desativar' : 'Ativar'}
                      </Button>

                      <Button
                        onClick={() => handleDeleteUser(user.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        title="Excluir usuário"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Mostrando {((pagination.current_page - 1) * pagination.per_page) + 1} a{' '}
                  {Math.min(pagination.current_page * pagination.per_page, pagination.total)} de{' '}
                  {pagination.total} usuários
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page! - 1 }))}
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page <= 1}
                  >
                    Anterior
                  </Button>
                  
                  <span className="text-sm text-gray-700">
                    Página {pagination.current_page} de {pagination.last_page}
                  </span>
                  
                  <Button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page! + 1 }))}
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page >= pagination.last_page}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {activeTab === 'bulk' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Operações em Lote
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Atualizar Status</h4>
                <p className="text-sm text-gray-600">
                  Altere o status de múltiplos usuários
                </p>
                
                <div className="space-y-3">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkUpdate({ status: e.target.value });
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Selecionar novo status</option>
                    <option value="active">Ativar</option>
                    <option value="inactive">Desativar</option>
                    <option value="suspended">Suspender</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Atualizar Role</h4>
                <p className="text-sm text-gray-600">
                  Altere a role de múltiplos usuários
                </p>
                
                <div className="space-y-3">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkUpdate({ role: e.target.value });
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Selecionar nova role</option>
                    <option value="user">Usuário</option>
                    <option value="manager">Gerente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'import' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Importar Usuários
            </h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">
                  Arraste e solte um arquivo Excel ou CSV aqui
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImportUsers(file);
                    }
                  }}
                  className="hidden"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Selecionar Arquivo
                </label>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Formatos suportados: Excel (.xlsx, .xls) e CSV</p>
                <p>Colunas necessárias: Nome, Email, Role, Status</p>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'export' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Exportar Usuários
            </h3>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Exporte a lista de usuários com os filtros aplicados
              </p>
              
              <Button
                onClick={handleExportUsers}
                variant="primary"
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Exportar para Excel
              </Button>
              
              <div className="text-sm text-gray-500">
                <p>O arquivo será baixado automaticamente</p>
                <p>Inclui: Nome, Email, Status, Role, Data de Criação, Último Login</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdvancedUserManager;
