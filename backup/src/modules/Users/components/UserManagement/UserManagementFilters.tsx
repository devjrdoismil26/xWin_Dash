/**
 * Componente de filtros para o User Management Dashboard
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Download, Upload } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';

interface UserManagementFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onExport: () => void;
  onImport: () => void;
  totalUsers: number;
  filteredUsers: number;
}

const UserManagementFilters: React.FC<UserManagementFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onExport,
  onImport,
  totalUsers,
  filteredUsers
}) => {
  const roleOptions = [
    { value: '', label: 'Todos os Roles' },
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuário' },
    { value: 'moderator', label: 'Moderador' },
    { value: 'guest', label: 'Convidado' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos os Status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'pending', label: 'Pendente' },
    { value: 'suspended', label: 'Suspenso' },
    { value: 'banned', label: 'Banido' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4"
    >
      {/* Header com estatísticas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gerenciamento de Usuários
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Total: {totalUsers}
            </Badge>
            {filteredUsers !== totalUsers && (
              <Badge variant="outline">
                Filtrados: {filteredUsers}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onImport}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Importar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtro por Role */}
        <Select
          value={selectedRole}
          onValueChange={onRoleChange}
          options={roleOptions}
          placeholder="Filtrar por role"
        />

        {/* Filtro por Status */}
        <Select
          value={selectedStatus}
          onValueChange={onStatusChange}
          options={statusOptions}
          placeholder="Filtrar por status"
        />

        {/* Modo de visualização */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="flex items-center gap-2"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filtros ativos */}
      {(searchTerm || selectedRole || selectedStatus) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center gap-2 flex-wrap"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">Filtros ativos:</span>
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Busca: {searchTerm}
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedRole && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Role: {roleOptions.find(r => r.value === selectedRole)?.label}
              <button
                onClick={() => onRoleChange('')}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedStatus && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {statusOptions.find(s => s.value === selectedStatus)?.label}
              <button
                onClick={() => onStatusChange('')}
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
            </Badge>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserManagementFilters;