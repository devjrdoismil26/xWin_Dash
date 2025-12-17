import React, { useState, useEffect, useCallback } from 'react';
import { useUsers, CreateUserData } from '../hooks/useUserList';
import { User, UserFilters } from '../types/user.types';
import { Card } from '@/shared/components/ui/Card';
import { UserTableHeader } from './UserManagement/UserTableHeader';
import { UserTableRow } from './UserManagement/UserTableRow';
import { UserTablePagination } from './UserManagement/UserTablePagination';
import { toast } from 'sonner';

interface UserManagementTableProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const UserManagementTable: React.FC<UserManagementTableProps> = ({ className = ''    }) => {
  const {
    users,
    loading: usersLoading,
    pagination,
    fetchUsers,
    createUser: createUserHook,
    updateUser,
    deleteUser,
    updateUserStatus,
    searchUsers,
    exportUsers
  } = useUsers();

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    per_page: 10
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers(filters);

  }, [filters]);

  const handleCreateUser = useCallback(async () => {
    setCreateModalOpen(true);

  }, []);

  const handleCreateUserSubmit = useCallback(async (data: CreateUserData) => {
    try {
      await createUserHook(data);

      toast.success('Usuário criado com sucesso');

      setCreateModalOpen(false);

      await fetchUsers(filters);

    } catch (error) {
      toast.error('Erro ao criar usuário');

    } , [createUserHook, fetchUsers, filters]);

  const handleImport = useCallback(() => {
    // TODO: Implementar importação de usuários via CSV/Excel
    toast.info('Importação de usuários será implementada em breve');

  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchUsers(searchQuery, filters);

    } else {
      await fetchUsers(filters);

    } ;

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);};

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);

    } else {
      setSelectedUsers(users.map(u => u.id));

    } ;

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));};

  if (usersLoading) {
    return (
              <div className=" ">$2</div><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" / />);

        </div>
  }

  return (
        <>
      <div className={className  }>
      </div><UserTableHeader
        searchQuery={ searchQuery }
        onSearchChange={ setSearchQuery }
        onSearch={ handleSearch }
        onCreateNew={ handleCreateUser }
        onExport={ exportUsers }
        onImport={ handleImport }
        selectedCount={ selectedUsers.length }
      / />
      <Card />
        <div className=" ">$2</div><table className="w-full" />
            <thead className="backdrop-blur-xl bg-white/10 border-white/20 bg-gray-50 border-b" />
              <tr />
                <th className="px-4 py-3 text-left" />
                  <input
                    type="checkbox"
                    checked={ selectedUsers.length === users.length && users.length > 0 }
                    onChange={ handleSelectAll }
                    className="rounded border-gray-300" /></th><th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Usuário</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Função</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Criado em</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ações</th></tr></thead>
            <tbody className="divide-y divide-gray-200" />
              {users.map(user => (
                <UserTableRow
                  key={ user.id }
                  user={ user }
                  isSelected={ selectedUsers.includes(user.id) }
                  onSelect={ handleSelectUser }
                  onEdit={ setEditingUser }
                  onDelete={async (userId: string) => {
                    if (confirm('Deseja realmente deletar este usuário?')) {
                      try {
                        await deleteUser(Number(userId));

                        toast.success('Usuário deletado com sucesso');

                        await fetchUsers(filters);

                      } catch (error) {
                        toast.error('Erro ao deletar usuário');

                      } } onToggleStatus={async (userId: string) => {
                    const user = users.find(u => u.id === userId);

                    if (!user) return;
                    const newStatus = user.status === 'active' ? 'inactive' : 'active';
                    try {
                      await updateUserStatus(Number(userId), newStatus);

                      toast.success('Status do usuário atualizado');

                      await fetchUsers(filters);

                    } catch (error) {
                      toast.error('Erro ao atualizar status');

                    } } />
              ))}
            </tbody></table></div>

        {pagination && (
          <UserTablePagination
            currentPage={ pagination.current_page }
            totalPages={ pagination.last_page }
            totalItems={ pagination.total }
            perPage={ pagination.per_page }
            onPageChange={ handlePageChange }
          / />
        )}
      </Card>
    </div>);};

export default UserManagementTable;
