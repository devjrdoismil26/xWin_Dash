import React, { useState, useEffect } from 'react';
import { useUsersAdvanced } from '../hooks/useUsersAdvanced';
import { User, UserPermission } from '../types/userTypes';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  ShieldCheck,
  User,
  Check,
  X,
  Eye,
  Pencil,
  Trash2,
  Plus,
  Settings,
  Eye,
  Plus,
  Pencil,
  TrashIcon,
  Cog,
  ShieldCheckIcon,
  Check,
  X
} from 'lucide-react';

interface UserPermissionsManagerProps {
  userId: string;
  className?: string;
}

export const UserPermissionsManager: React.FC<UserPermissionsManagerProps> = ({
  userId,
  className = ''
}) => {
  const {
    userPermissions,
    permissionsLoading,
    permissionsError,
    fetchUserPermissions,
    updateUserPermissions
  } = useUsersAdvanced();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserPermissions(userId);
    }
  }, [userId, fetchUserPermissions]);

  useEffect(() => {
    if (userPermissions.length > 0) {
      setSelectedPermissions(userPermissions.map(p => p.id));
    }
  }, [userPermissions]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => {
      const newPermissions = prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId];
      
      setHasChanges(true);
      return newPermissions;
    });
  };

  const handleSavePermissions = async () => {
    const success = await updateUserPermissions(userId, selectedPermissions);
    if (success) {
      setIsEditing(false);
      setHasChanges(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedPermissions(userPermissions.map(p => p.id));
    setIsEditing(false);
    setHasChanges(false);
  };

  const getPermissionCategoryColor = (category: string) => {
    switch (category) {
      case 'users': return 'blue';
      case 'roles': return 'green';
      case 'permissions': return 'purple';
      case 'system': return 'red';
      case 'reports': return 'orange';
      default: return 'gray';
    }
  };

  const getPermissionIcon = (action: string) => {
    switch (action) {
      case 'view': return <Eye className="h-4 w-4" />;
      case 'create': return <Plus className="h-4 w-4" />;
      case 'update': return <Pencil className="h-4 w-4" />;
      case 'delete': return <TrashIcon className="h-4 w-4" />;
      default: return <Cog className="h-4 w-4" />;
    }
  };

  const groupedPermissions = userPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, UserPermission[]>);

  if (permissionsLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (permissionsError) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-red-600">
          <p>Erro ao carregar permissões: {permissionsError}</p>
          <Button 
            onClick={() => fetchUserPermissions(userId)}
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
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShieldCheckIcon className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Gerenciar Permissões
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSavePermissions}
                variant="primary"
                size="sm"
                disabled={!hasChanges}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Salvar
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {userPermissions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ShieldCheckIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Nenhuma permissão encontrada</p>
          <p className="text-sm">Configure as permissões do sistema primeiro</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([category, permissions]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={getPermissionCategoryColor(category)} size="sm">
                  {category.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600">
                  {permissions.length} permissões
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedPermissions.includes(permission.id)
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${isEditing ? 'cursor-pointer' : ''}`}
                    onClick={() => isEditing && handlePermissionToggle(permission.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getPermissionIcon(permission.action)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {permission.display_name}
                          </h4>
                          {selectedPermissions.includes(permission.id) && (
                            <Badge variant="success" size="sm">
                              Ativa
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {permission.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Recurso: {permission.resource}</span>
                          <span>•</span>
                          <span>Ação: {permission.action}</span>
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{selectedPermissions.length}</span> de{' '}
            <span className="font-medium">{userPermissions.length}</span> permissões ativas
          </div>
          
          {hasChanges && (
            <Badge variant="warning" size="sm">
              Alterações não salvas
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserPermissionsManager;
