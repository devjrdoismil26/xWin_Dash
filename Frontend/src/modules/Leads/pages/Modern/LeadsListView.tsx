import React from 'react';
import { Eye, Edit, Trash2, Star } from 'lucide-react';
import { Lead } from '@/types';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import Button from '@/shared/components/ui/Button';

interface LeadsListViewProps {
  leads: Lead[];
  selectedLeads: Set<number>;
  onSelectLead?: (e: any) => void;
  onViewLead?: (e: any) => void;
  onEditLead?: (e: any) => void;
  onDeleteLead?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const LeadsListView: React.FC<LeadsListViewProps> = ({ leads,
  selectedLeads,
  onSelectLead,
  onViewLead,
  onEditLead,
  onDeleteLead
   }) => {
  return (
        <>
      <Card />
      <div className=" ">$2</div><table className="w-full" />
          <thead className="backdrop-blur-xl bg-white/10 border-white/20 border-b" />
            <tr />
              <th className="px-4 py-3 text-left" />
                <input
                  type="checkbox"
                  checked={ leads.length > 0 && leads.every(l => selectedLeads.has(l.id)) }
                  onChange={(e: unknown) => {
                    leads.forEach(l => onSelectLead(l.id, e.target.checked));

                  } /></th><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Score</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Origem</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Ações</th></tr></thead>
          <tbody className="divide-y" />
            {leads.map((lead: unknown) => (
              <tr key={lead.id} className="hover:bg-gray-50" />
                <td className="px-4 py-3" />
                  <input
                    type="checkbox"
                    checked={ selectedLeads.has(lead.id) }
                    onChange={ (e: unknown) => onSelectLead(lead.id, e.target.checked) } /></td><td className="px-4 py-3" />
                  <div className="font-medium text-gray-900">{lead.name}</div>
                  {lead.company && (
                    <div className="text-sm text-gray-500">{lead.company}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{lead.email}</td>
                <td className="px-4 py-3" />
                  <Badge variant={ lead.status === 'qualified' ? 'success' : 'default' } />
                    {lead.status}
                  </Badge></td><td className="px-4 py-3" />
                  <div className=" ">$2</div><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{lead.score || 0}</span></div></td>
                <td className="px-4 py-3 text-sm text-gray-600">{lead.origin || '-'}</td>
                <td className="px-4 py-3" />
                  <div className=" ">$2</div><Button
                      variant="ghost"
                      size="sm"
                      onClick={ () => onViewLead(lead)  }>
                      <Eye className="w-4 h-4" /></Button><Button
                      variant="ghost"
                      size="sm"
                      onClick={ () => onEditLead(lead)  }>
                      <Edit className="w-4 h-4" /></Button><Button
                      variant="ghost"
                      size="sm"
                      onClick={ () => onDeleteLead(lead) }
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" /></Button></div></td></tr>
            ))}
          </tbody></table></div>
    </Card>);};
