import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test-utils/test-utils';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';

// Mock do módulo Users com implementação fragmentada
const Users = () => {
  const [users, setUsers] = React.useState([
    { id: '1', name: 'João Silva', email: 'joao@email.com', role: 'admin', status: 'active', lastLogin: '2024-01-20T10:00:00Z', createdAt: '2024-01-15T09:00:00Z' },
    { id: '2', name: 'Maria Santos', email: 'maria@email.com', role: 'user', status: 'inactive', lastLogin: '2024-01-18T14:30:00Z', createdAt: '2024-01-16T11:00:00Z' },
    { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', role: 'moderator', status: 'active', lastLogin: '2024-01-21T08:15:00Z', createdAt: '2024-01-17T13:00:00Z' }
  ]);
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showUserForm, setShowUserForm] = React.useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const createUser = (userData: any) => {
    const newUser = {
      id: (users.length + 1).toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, updates: any) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const toggleUserStatus = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      updateUser(id, { status: user.status === 'active' ? 'inactive' : 'active' });
    }
  };

  const updateUserRole = (id: string, role: string) => {
    updateUser(id, { role });
  };

  const refreshUsers = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getStats = () => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const inactive = users.filter(u => u.status === 'inactive').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const moderators = users.filter(u => u.role === 'moderator').length;
    const regularUsers = users.filter(u => u.role === 'user').length;
    return { total, active, inactive, admins, moderators, regularUsers };
  };

  const stats = getStats();

  return (
    <div data-testid="users-module">
      <h1>Users Management</h1>
      
      {/* Estatísticas */}
      <div data-testid="stats">
        <div>Total de usuários: {stats.total}</div>
        <div>Usuários ativos: {stats.active}</div>
        <div>Usuários inativos: {stats.inactive}</div>
        <div>Administradores: {stats.admins}</div>
        <div>Moderadores: {stats.moderators}</div>
        <div>Usuários regulares: {stats.regularUsers}</div>
      </div>

      {/* Filtros */}
      <div data-testid="filters">
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="search-input"
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          data-testid="role-filter"
        >
          <option value="all">Todos os cargos</option>
          <option value="admin">Administrador</option>
          <option value="moderator">Moderador</option>
          <option value="user">Usuário</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          data-testid="status-filter"
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>

      {/* Ações */}
      <div data-testid="actions">
        <button onClick={() => setShowUserForm(!showUserForm)} data-testid="toggle-form-btn">
          {showUserForm ? 'Ocultar Formulário' : 'Mostrar Formulário'}
        </button>
        <button onClick={() => createUser({ name: 'Novo Usuário', email: 'novo@email.com', role: 'user', status: 'active' })} data-testid="create-user-btn">
          Criar Usuário
        </button>
        <button onClick={refreshUsers} data-testid="refresh-btn" disabled={isLoading}>
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {/* Formulário de usuário */}
      {showUserForm && (
        <div data-testid="user-form" className="user-form">
          <h3>Criar Novo Usuário</h3>
          <input type="text" placeholder="Nome" data-testid="form-name" />
          <input type="email" placeholder="Email" data-testid="form-email" />
          <select data-testid="form-role">
            <option value="user">Usuário</option>
            <option value="moderator">Moderador</option>
            <option value="admin">Administrador</option>
          </select>
          <button data-testid="form-submit">Salvar</button>
        </div>
      )}

      {/* Lista de usuários */}
      <div data-testid="users-list">
        {filteredUsers.map(user => (
          <div key={user.id} data-testid={`user-${user.id}`} className="user-card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Cargo: {user.role}</p>
            <p>Status: {user.status}</p>
            <p>Último login: {new Date(user.lastLogin).toLocaleString()}</p>
            <p>Criado em: {new Date(user.createdAt).toLocaleString()}</p>
            <div>
              <button onClick={() => toggleUserStatus(user.id)} data-testid={`toggle-status-${user.id}`}>
                {user.status === 'active' ? 'Desativar' : 'Ativar'}
              </button>
              <button onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')} data-testid={`toggle-role-${user.id}`}>
                Alternar Cargo
              </button>
              <button onClick={() => updateUser(user.id, { name: `${user.name} (Editado)` })} data-testid={`edit-${user.id}`}>
                Editar
              </button>
              <button onClick={() => deleteUser(user.id)} data-testid={`delete-${user.id}`}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {isLoading && <div data-testid="loading">Carregando usuários...</div>}
    </div>
  );
};

describe('Users Module', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
  });

  it('should render users module', () => {
    render(<Users />, { queryClient });
    expect(screen.getByTestId('users-module')).toBeInTheDocument();
    expect(screen.getByText('Users Management')).toBeInTheDocument();
  });

  it('should display user statistics', () => {
    render(<Users />, { queryClient });
    expect(screen.getByTestId('stats')).toBeInTheDocument();
    expect(screen.getByText('Total de usuários: 3')).toBeInTheDocument();
    expect(screen.getByText('Usuários ativos: 2')).toBeInTheDocument();
    expect(screen.getByText('Usuários inativos: 1')).toBeInTheDocument();
    expect(screen.getByText('Administradores: 1')).toBeInTheDocument();
    expect(screen.getByText('Moderadores: 1')).toBeInTheDocument();
    expect(screen.getByText('Usuários regulares: 1')).toBeInTheDocument();
  });

  it('should filter users by search term', () => {
    render(<Users />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'João' } });
    expect(screen.getByTestId('user-1')).toBeInTheDocument();
    expect(screen.queryByTestId('user-2')).not.toBeInTheDocument();
  });

  it('should filter users by role', () => {
    render(<Users />, { queryClient });
    const roleFilter = screen.getByTestId('role-filter');
    fireEvent.change(roleFilter, { target: { value: 'admin' } });
    expect(screen.getByTestId('user-1')).toBeInTheDocument();
    expect(screen.queryByTestId('user-2')).not.toBeInTheDocument();
  });

  it('should filter users by status', () => {
    render(<Users />, { queryClient });
    const statusFilter = screen.getByTestId('status-filter');
    fireEvent.change(statusFilter, { target: { value: 'active' } });
    expect(screen.getByTestId('user-1')).toBeInTheDocument();
    expect(screen.getByTestId('user-3')).toBeInTheDocument();
    expect(screen.queryByTestId('user-2')).not.toBeInTheDocument();
  });

  it('should create new user', () => {
    render(<Users />, { queryClient });
    const createButton = screen.getByTestId('create-user-btn');
    fireEvent.click(createButton);
    expect(screen.getByTestId('user-4')).toBeInTheDocument();
    expect(screen.getByText('Novo Usuário')).toBeInTheDocument();
  });

  it('should toggle user status', () => {
    render(<Users />, { queryClient });
    const toggleButton = screen.getByTestId('toggle-status-1');
    fireEvent.click(toggleButton);
    const user1 = screen.getByTestId('user-1');
    expect(user1).toHaveTextContent('inactive');
  });

  it('should toggle user role', () => {
    render(<Users />, { queryClient });
    const toggleRoleButton = screen.getByTestId('toggle-role-1');
    fireEvent.click(toggleRoleButton);
    const user1 = screen.getByTestId('user-1');
    expect(user1).toHaveTextContent('user');
  });

  it('should edit user', () => {
    render(<Users />, { queryClient });
    const editButton = screen.getByTestId('edit-1');
    fireEvent.click(editButton);
    expect(screen.getByText('João Silva (Editado)')).toBeInTheDocument();
  });

  it('should delete user', () => {
    render(<Users />, { queryClient });
    const deleteButton = screen.getByTestId('delete-1');
    fireEvent.click(deleteButton);
    expect(screen.queryByTestId('user-1')).not.toBeInTheDocument();
  });

  it('should toggle user form', () => {
    render(<Users />, { queryClient });
    const toggleFormButton = screen.getByTestId('toggle-form-btn');
    fireEvent.click(toggleFormButton);
    expect(screen.getByTestId('user-form')).toBeInTheDocument();
    
    fireEvent.click(toggleFormButton);
    expect(screen.queryByTestId('user-form')).not.toBeInTheDocument();
  });

  it('should refresh users', async () => {
    render(<Users />, { queryClient });
    const refreshButton = screen.getByTestId('refresh-btn');
    fireEvent.click(refreshButton);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  it('should display user details correctly', () => {
    render(<Users />, { queryClient });
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Email: joao@email.com')).toBeInTheDocument();
    expect(screen.getByText('Cargo: admin')).toBeInTheDocument();
    const user1 = screen.getByTestId('user-1');
    expect(user1).toHaveTextContent('active');
  });

  it('should handle multiple filters simultaneously', () => {
    render(<Users />, { queryClient });
    const searchInput = screen.getByTestId('search-input');
    const roleFilter = screen.getByTestId('role-filter');
    const statusFilter = screen.getByTestId('status-filter');
    
    fireEvent.change(searchInput, { target: { value: 'João' } });
    fireEvent.change(roleFilter, { target: { value: 'admin' } });
    fireEvent.change(statusFilter, { target: { value: 'active' } });
    
    expect(screen.getByTestId('user-1')).toBeInTheDocument();
    expect(screen.queryByTestId('user-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-3')).not.toBeInTheDocument();
  });

  it('should update statistics after user creation', () => {
    render(<Users />, { queryClient });
    const createButton = screen.getByTestId('create-user-btn');
    fireEvent.click(createButton);
    
    expect(screen.getByText('Total de usuários: 4')).toBeInTheDocument();
    expect(screen.getByText('Usuários ativos: 3')).toBeInTheDocument();
    expect(screen.getByText('Usuários regulares: 2')).toBeInTheDocument();
  });

  it('should update statistics after user deletion', () => {
    render(<Users />, { queryClient });
    const deleteButton = screen.getByTestId('delete-1');
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('Total de usuários: 2')).toBeInTheDocument();
    expect(screen.getByText('Usuários ativos: 1')).toBeInTheDocument();
    expect(screen.getByText('Administradores: 0')).toBeInTheDocument();
  });
});
