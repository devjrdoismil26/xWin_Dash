import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/shared/components/ui/Button';
import Pagination from '@/shared/components/ui/Pagination';
const EmailSegmentTable = ({ segments = [] as unknown[], pagination = null, onEdit, onDelete, onPageChange }) => {
  return (
            <div className=" ">$2</div><div className=" ">$2</div><table className="min-w-full text-sm" />
          <thead />
            <tr className="text-left border-b" />
              <th className="py-2 px-3">Nome</th>
              <th className="py-2 px-3">Descrição</th>
              <th className="py-2 px-3">Lista Associada</th>
              <th className="py-2 px-3">Inscritos</th>
              <th className="py-2 px-3">Criado em</th>
              <th className="py-2 px-3 text-right">Ações</th></tr></thead>
          <tbody />
            {(segments || []).map((segment: unknown) => (
              <tr key={segment.id} className="border-b hover:bg-gray-50" />
                <td className="py-2 px-3">{segment.name}</td>
                <td className="py-2 px-3">{segment.description || 'N/A'}</td>
                <td className="py-2 px-3">{segment.email_list?.name || 'N/A'}</td>
                <td className="py-2 px-3">{segment.subscribers_count ?? 0}</td>
                <td className="py-2 px-3">{segment.created_at ? new Date(segment.created_at).toLocaleDateString('pt-BR') : '-'}</td>
                <td className="py-2 px-3" />
                  <div className=" ">$2</div><Button variant="outline" size="sm" onClick={ () => onEdit?.(segment) }>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={ () => onDelete?.(segment) }>Excluir</Button></div></td>
      </tr>
    </>
  ))}
          </tbody></table></div>
      {pagination && pagination.last_page > 1 && (
        <Pagination
          currentPage={ pagination.current_page }
          lastPage={ pagination.last_page }
          onPageChange={ onPageChange }
        / />
      )}
    </div>);};

EmailSegmentTable.propTypes = {
  segments: PropTypes.array,
  pagination: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onPageChange: PropTypes.func,};

export default EmailSegmentTable;
