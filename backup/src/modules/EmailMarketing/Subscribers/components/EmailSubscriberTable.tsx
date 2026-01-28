import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
const EmailSubscriberTable: React.FC<{subscribers?: any, pagination?: any, onEdit, onDelete, onPageChange}> = ({ subscribers = [], pagination = null, onEdit, onDelete, onPageChange }) => {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 px-3">E-mail</th>
              <th className="py-2 px-3">Nome</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Criado em</th>
              <th className="py-2 px-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{subscriber.email}</td>
                <td className="py-2 px-3">{subscriber.name || 'N/A'}</td>
                <td className="py-2 px-3">{subscriber.status || '-'}</td>
                <td className="py-2 px-3">{subscriber.created_at ? new Date(subscriber.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                <td className="py-2 px-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit?.(subscriber)}>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete?.(subscriber)}>Excluir</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && pagination.last_page > 1 && (
        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} onPageChange={onPageChange} />
      )}
    </div>
  );
};
EmailSubscriberTable.propTypes = {
  subscribers: PropTypes.array,
  pagination: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onPageChange: PropTypes.func,
};
export default EmailSubscriberTable;
