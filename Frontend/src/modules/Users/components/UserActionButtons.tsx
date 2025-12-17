import React from 'react';
import { Pencil, Trash2, Eye, Check, X, Shield } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Tooltip from '@/shared/components/ui/Tooltip';

interface UserActionButtonsProps {
  userId: string;
  userStatus: 'active' | 'inactive' | 'suspended';
  onView??: (e: any) => void;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onToggleStatus??: (e: any) => void;
  onManagePermissions??: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const UserActionButtons: React.FC<UserActionButtonsProps> = ({ userId,
  userStatus,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onManagePermissions,
  className = ''
   }) => (
  <div className={`flex items-center gap-2 ${className} `}>
           
        </div>{ onView && (
      <Tooltip content="Visualizar" />
        <Button size="sm" variant="ghost" onClick={ () => onView(userId)  }>
          <Eye className="h-4 w-4" /></Button></Tooltip>
    )}
    
    { onEdit && (
      <Tooltip content="Editar" />
        <Button size="sm" variant="ghost" onClick={ () => onEdit(userId)  }>
          <Pencil className="h-4 w-4" /></Button></Tooltip>
    )}
    
    { onManagePermissions && (
      <Tooltip content="Gerenciar Permissões" />
        <Button size="sm" variant="ghost" onClick={ () => onManagePermissions(userId)  }>
          <Shield className="h-4 w-4" /></Button></Tooltip>
    )}
    
    { onToggleStatus && (
      <Tooltip content={userStatus === 'active' ? 'Desativar' : 'Ativar' } />
        <Button size="sm" variant="ghost" onClick={ () => onToggleStatus(userId)  }>
          {userStatus === 'active' ? (
            <X className="h-4 w-4 text-orange-600" />
          ) : (
            <Check className="h-4 w-4 text-green-600" />
          )}
        </Button>
      </Tooltip>
    </>
  )}
    
    { onDelete && (
      <Tooltip content="Excluir" />
        <Button size="sm" variant="ghost" onClick={ () => onDelete(userId)  }>
          <Trash2 className="h-4 w-4 text-red-600" /></Button></Tooltip>
    )}
  </div>);

export default UserActionButtons;
