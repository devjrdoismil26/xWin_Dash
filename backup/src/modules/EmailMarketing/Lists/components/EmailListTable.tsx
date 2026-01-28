import React from 'react';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import { EmailList } from '../../types/emailTypes';
interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
interface EmailListTableProps {
  lists?: EmailList[];
  pagination?: PaginationData | null;
  onEdit?: (list: EmailList) => void;
  onDelete?: (list: EmailList) => void;
  onPageChange?: (page: number) => void;
}
const EmailListTable: React.FC<EmailListTableProps> = ({ 
  lists = [], 
  pagination = null, 
  onEdit, 
  onDelete, 
  onPageChange 
}) => {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 px-3">Nome</th>
              <th className="py-2 px-3">Descrição</th>
              <th className="py-2 px-3">Inscritos</th>
              <th className="py-2 px-3">Data de Criação</th>
              <th className="py-2 px-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((list) => (
              <tr key={list.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{list.name}</td>
                <td className="py-2 px-3">{list.description || 'N/A'}</td>
                <td className="py-2 px-3">{list.subscribers_count ?? 0}</td>
                <td className="py-2 px-3">
                  {list.created_at ? new Date(list.created_at).toLocaleDateString('pt-BR') : '-'}
                </td>
                <td className="py-2 px-3">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit?.(list)}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => onDelete?.(list)}
                    >
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && pagination.last_page > 1 && (
        <Pagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
export default EmailListTable;
