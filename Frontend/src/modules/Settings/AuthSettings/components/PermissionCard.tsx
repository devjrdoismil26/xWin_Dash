import React from 'react';
import Button from '@/shared/components/ui/Button';

interface Permission {
  id?: string | number;
  name?: string;
  description?: string;
  created_at?: string; }

interface PermissionCardProps {
  permission: Permission;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export function PermissionCard({ permission, onEdit, onDelete }: PermissionCardProps) {
  return (
            <div className=" ">$2</div><div className=" ">$2</div><h3 className="font-semibold text-gray-900">{permission?.name || 'Permissão'}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">ID {permission?.id || '-'}</span></div><p className="text-sm text-gray-600 mb-3">{permission?.description || '—'}</p>
      <div className=" ">$2</div><span className="text-xs text-gray-500">Criado em: {permission?.created_at || '-'}</span>
        <div className=" ">$2</div><Button size="sm" variant="outline" onClick={ () => onEdit?.(permission) }>Editar</Button>
          <Button size="sm" variant="destructive" onClick={ () => onDelete?.(permission) }>Excluir</Button></div></div>);

}
export default PermissionCard;
