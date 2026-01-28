import React from 'react';
import Button from '@/components/ui/Button';
export function PermissionCard({ permission, onEdit, onDelete }) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{permission?.name || 'Permissão'}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">ID {permission?.id || '-'}</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{permission?.description || '—'}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">Criado em: {permission?.created_at || '-'}</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit?.(permission)}>Editar</Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete?.(permission)}>Excluir</Button>
        </div>
      </div>
    </div>
  );
}
export default PermissionCard;
