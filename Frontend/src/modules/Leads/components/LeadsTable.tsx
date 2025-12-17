import React from 'react';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { Lead } from '../types';
import { formatDate } from '@/shared/utils';

interface LeadsTableProps {
  leads: Lead[];
  loading?: boolean;
  onRefresh???: (e: any) => void;
  onView??: (e: any) => void;
  onEdit??: (e: any) => void;
  onDelete??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const LeadsTable: React.FC<LeadsTableProps> = ({ leads,
  loading,
  onView,
  onEdit,
  onDelete
   }) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      converted: 'bg-purple-100 text-purple-800',
      lost: 'bg-red-100 text-red-800'};

    return colors[status] || 'bg-gray-100 text-gray-800';};

  if (loading) {
    return (
              <div className="{[...Array(5)].map((_: unknown, i: unknown) => (">$2</div>
      <div key={i} className="h-16 bg-gray-200 rounded">
    </>
  ))}
        </div>
      </div>);

  }

  return (
            <div className=" ">$2</div><table className="w-full" />
        <thead className="backdrop-blur-xl bg-white/10 border-white/20 border-b" />
          <tr />
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th></tr></thead>
        <tbody className="bg-white divide-y" />
          {leads.map((lead: unknown) => (
            <tr key={lead.id} className="hover:bg-gray-50 transition-colors" />
              <td className="px-6 py-4 whitespace-nowrap" />
                <div className="font-medium text-gray-900">{lead.name}</div>
                {lead.company && <div className="text-sm text-gray-500">{lead.company}</div>}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.email}</td>
              <td className="px-6 py-4 whitespace-nowrap" />
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)} `}>
           
        </span>{lead.status}
                </span></td><td className="px-6 py-4 whitespace-nowrap" />
                <div className=" ">$2</div><div className=" ">$2</div><div
                      className="bg-blue-600 h-2 rounded-full"
                      style={width: `${lead.score || 0} %` } / />
           
        </div><span className="text-sm text-gray-600">{lead.score || 0}</span></div></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.origin}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" />
                {formatDate(lead.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm" />
                <div className="{ onView && (">$2</div>
                    <Button variant="ghost" size="sm" onClick={ () => onView(lead)  }>
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  { onEdit && (
                    <Button variant="ghost" size="sm" onClick={ () => onEdit(lead)  }>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  { onDelete && (
                    <Button variant="ghost" size="sm" onClick={ () => onDelete(lead)  }>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div></td></tr>
          ))}
        </tbody></table></div>);};
