/**
 * Componente de filtros para o User Management Dashboard
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Download, Upload } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import Badge from '@/shared/components/ui/Badge';

interface UserManagementFiltersProps {
  searchTerm: string;
  onSearchChange?: (e: any) => void;
  selectedRole: string;
  onRoleChange?: (e: any) => void;
  selectedStatus: string;
  onStatusChange?: (e: any) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange?: (e: any) => void;
  onExport??: (e: any) => void;
  onImport??: (e: any) => void;
  totalUsers: number;
  filteredUsers: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const UserManagementFilters: React.FC<UserManagementFiltersProps> = ({ searchTerm,
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
        <>
      <div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      </div>{/* Header com estatísticas */}
      <div className=" ">$2</div><div className=" ">$2</div><h2 className="text-lg font-semibold text-gray-900 dark:text-white" />
            Gerenciamento de Usuários
          </h2>
          <div className=" ">$2</div><Badge variant="secondary" />
              Total: {totalUsers}
            </Badge>
            {filteredUsers !== totalUsers && (
              <Badge variant="outline" />
                Filtrados: {filteredUsers}
              </Badge>
            )}
          </div>
        
        <div className=" ">$2</div><Button
            variant="outline"
            size="sm"
            onClick={ onImport }
            className="flex items-center gap-2" />
            <Upload className="w-4 h-4" />
            Importar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={ onExport }
            className="flex items-center gap-2" />
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>

      {/* Filtros */}
      <div className="{/* Busca */}">$2</div>
        <div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar usuários..."
            value={ searchTerm }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value) }
            className="pl-10" />
        </div>

        {/* Filtro por Role */}
        <Select
          value={ selectedRole }
          onValueChange={ onRoleChange }
          options={ roleOptions }
          placeholder="Filtrar por role"
       >
          {/* Filtro por Status */}
        <Select
          value={ selectedStatus }
          onValueChange={ onStatusChange }
          options={ statusOptions }
          placeholder="Filtrar por status"
       >
          {/* Modo de visualização */}
        <div className=" ">$2</div><Button
            variant={ viewMode === 'grid' ? 'default' : 'outline' }
            size="sm"
            onClick={ () => onViewModeChange('grid') }
            className="flex items-center gap-2"
          >
            <Grid className="w-4 h-4" /></Button><Button
            variant={ viewMode === 'list' ? 'default' : 'outline' }
            size="sm"
            onClick={ () => onViewModeChange('list') }
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" /></Button></div>

      {/* Filtros ativos */}
      {(searchTerm || selectedRole || selectedStatus) && (
        <div
          className="flex items-center gap-2 flex-wrap">
           
        </div><span className="text-sm text-gray-600 dark:text-gray-400">Filtros ativos:</span>
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1" />
              Busca: {searchTerm}
              <button
                onClick={ () => onSearchChange('') }
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
      </Badge>
    </>
  )}
          {selectedRole && (
            <Badge variant="secondary" className="flex items-center gap-1" />
              Role: {roleOptions.find(r => r.value === selectedRole)?.label}
              <button
                onClick={ () => onRoleChange('') }
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
      </Badge>
    </>
  )}
          {selectedStatus && (
            <Badge variant="secondary" className="flex items-center gap-1" />
              Status: {statusOptions.find(s => s.value === selectedStatus)?.label}
              <button
                onClick={ () => onStatusChange('') }
                className="ml-1 hover:text-red-500"
              >
                ×
              </button>
      </Badge>
    </>
  )}
        </div>
      )}
    </div>);};

export default UserManagementFilters;