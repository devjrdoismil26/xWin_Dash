import React, { useState, useEffect } from 'react';
import { useUsersAdvanced } from '../hooks/useUsersAdvanced';
import { User, UserPermission } from '../types/user.types';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { ShieldCheck, User, Check, X, Eye, Pencil, Trash2, Plus, Settings, Eye, Plus, Pencil, TrashIcon, Cog, ShieldCheckIcon, Check, X } from 'lucide-react';

interface UserPermissionsManagerProps {
  userId: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const UserPermissionsManager: React.FC<UserPermissionsManagerProps> = ({ userId,
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

    } , [userId, fetchUserPermissions]);

  useEffect(() => {
    if (userPermissions.length > 0) {
      setSelectedPermissions((userPermissions || []).map(p => p.id));

    } , [userPermissions]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => {
      const newPermissions = prev.includes(permissionId)
        ? (prev || []).filter(id => id !== permissionId)
        : [...prev, permissionId];
      
      setHasChanges(true);

      return newPermissions;
    });};

  const handleSavePermissions = async () => {
    const success = await updateUserPermissions(userId, selectedPermissions);

    if (success) {
      setIsEditing(false);

      setHasChanges(false);

    } ;

  const handleCancelEdit = () => {
    setSelectedPermissions((userPermissions || []).map(p => p.id));

    setIsEditing(false);

    setHasChanges(false);};

  const getPermissionCategoryColor = (category: string) => {
    switch (category) {
      case 'users': return 'blue';
      case 'roles': return 'green';
      case 'permissions': return 'purple';
      case 'system': return 'red';
      case 'reports': return 'orange';
      default: return 'gray';
    } ;

  const getPermissionIcon = (action: string) => {
    switch (action) {
      case 'view': return <Eye className="h-4 w-4" />;
      case 'create': return <Plus className="h-4 w-4" />;
      case 'update': return <Pencil className="h-4 w-4" />;
      case 'delete': return <TrashIcon className="h-4 w-4" />;
      default: return <Cog className="h-4 w-4" />;
    } ;

  const groupedPermissions = userPermissions.reduce((acc: unknown, permission: unknown) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [] as unknown[];
    }
    acc[permission.category].push(permission);

    return acc;
  }, {} as Record<string, UserPermission[]>);

  if (permissionsLoading) {
    return (
        <>
      <Card className={`p-6 ${className} `} />
      <div className=" ">$2</div><div className=" ">$2</div><div className="{[1, 2, 3, 4, 5].map(i => (">$2</div>
      <div key={i} className="h-12 bg-gray-200 rounded">
    </>
  ))}
        </div>
          </div>
      </Card>);

  }

  if (permissionsError) {
    return (
        <>
      <Card className={`p-6 ${className} `} />
      <div className=" ">$2</div><p>Erro ao carregar permissões: {permissionsError}</p>
          <Button 
            onClick={ () => fetchUserPermissions(userId) }
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Tentar Novamente
          </Button></div></Card>);

  }

  return (
        <>
      <Card className={`p-6 ${className} `} />
      <div className=" ">$2</div><div className=" ">$2</div><ShieldCheckIcon className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900" />
            Gerenciar Permissões
          </h3></div><div className="{isEditing ? (">$2</div>
            <>
              <Button
                onClick={ handleSavePermissions }
                variant="primary"
                size="sm"
                disabled={ !hasChanges }
                className="flex items-center gap-2" />
                <Check className="h-4 w-4" />
                Salvar
              </Button>
              <Button
                onClick={ handleCancelEdit }
                variant="outline"
                size="sm"
                className="flex items-center gap-2" />
                <X className="h-4 w-4" />
                Cancelar
              </Button>
      </>
    </>
  ) : (
            <Button
              onClick={ () => setIsEditing(true) }
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          )}
        </div>

      {userPermissions.length === 0 ? (
        <div className=" ">$2</div><ShieldCheckIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Nenhuma permissão encontrada</p>
          <p className="text-sm">Configure as permissões do sistema primeiro</p>
      </div>
    </>
  ) : (
        <div className="{Object.entries(groupedPermissions).map(([category, permissions]) => (">$2</div>
            <div key={category} className="space-y-3">
           
        </div><div className=" ">$2</div><Badge variant={getPermissionCategoryColor(category)} size="sm" />
                  {category.toUpperCase()}
                </Badge>
                <span className="{permissions.length} permissões">$2</span>
                </span></div><div className="{(permissions || []).map((permission: unknown) => (">$2</div>
                  <div
                    key={ permission.id }
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedPermissions.includes(permission.id)
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${isEditing ? 'cursor-pointer' : ''}`}
                    onClick={ () => isEditing && handlePermissionToggle(permission.id)  }>
                    <div className=" ">$2</div><div className="{getPermissionIcon(permission.action)}">$2</div>
                      </div>
                      
                      <div className=" ">$2</div><div className=" ">$2</div><h4 className="font-medium text-gray-900" />
                            {permission.display_name}
                          </h4>
                          {selectedPermissions.includes(permission.id) && (
                            <Badge variant="success" size="sm" />
                              Ativa
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2" />
                          {permission.description}
                        </p>
                        
                        <div className=" ">$2</div><span>Recurso: {permission.resource}</span>
                          <span>•</span>
                          <span>Ação: {permission.action}</span>
                        </div>
                      
                      {isEditing && (
                        <div className=" ">$2</div><input
                            type="checkbox"
                            checked={ selectedPermissions.includes(permission.id) }
                            onChange={ () => handlePermissionToggle(permission.id) }
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                        </div>
                      )}
                    </div>
                ))}
              </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><span className="font-medium">{selectedPermissions.length}</span> de{' '}
            <span className="font-medium">{userPermissions.length}</span> permissões ativas
          </div>
          
          {hasChanges && (
            <Badge variant="warning" size="sm" />
              Alterações não salvas
            </Badge>
          )}
        </div>
    </Card>);};

export default UserPermissionsManager;
