import React from 'react';
import Button from '@/shared/components/ui/Button';
import Pagination from '@/shared/components/ui/Pagination';
import { EmailList } from '@/types/emailTypes';
interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number; }
interface EmailListTableProps {
  lists?: EmailList[];
  pagination?: PaginationData | null;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  onPageChange??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const EmailListTable: React.FC<EmailListTableProps> = ({ lists = [] as unknown[], 
  pagination = null, 
  onEdit, 
  onDelete, 
  onPageChange 
   }) => {
  return (
            <div className=" ">$2</div><div className=" ">$2</div><table className="min-w-full text-sm" />
          <thead />
            <tr className="text-left border-b" />
              <th className="py-2 px-3">Nome</th>
              <th className="py-2 px-3">Descrição</th>
              <th className="py-2 px-3">Inscritos</th>
              <th className="py-2 px-3">Data de Criação</th>
              <th className="py-2 px-3 text-right">Ações</th></tr></thead>
          <tbody />
            {(lists || []).map((list: unknown) => (
              <tr key={list.id} className="border-b hover:bg-gray-50" />
                <td className="py-2 px-3">{list.name}</td>
                <td className="py-2 px-3">{list.description || 'N/A'}</td>
                <td className="py-2 px-3">{list.subscribers_count ?? 0}</td>
                <td className="py-2 px-3" />
                  {list.created_at ? new Date(list.created_at).toLocaleDateString('pt-BR') : '-'}
                </td>
                <td className="py-2 px-3" />
                  <div className=" ">$2</div><Button 
                      variant="outline" 
                      size="sm" 
                      onClick={ () => onEdit?.(list)  }>
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={ () => onDelete?.(list)  }>
                      Excluir
                    </Button></div></td>
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

export default EmailListTable;
