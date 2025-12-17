import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  role: string;
  allocation: number;
  hours: number;
  cost: number;
  status: string; }

interface ResourcesTableProps {
  resources: Resource[];
  onEdit?: (e: any) => void;
  onDelete?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ResourcesTable: React.FC<ResourcesTableProps> = ({ resources, onEdit, onDelete    }) => (
  <div className=" ">$2</div><table className="w-full" />
      <thead className="bg-gray-50" />
        <tr />
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Função</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alocação</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horas</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custo</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th></tr></thead>
      <tbody className="divide-y divide-gray-200" />
        { resources.map((resource: unknown) => (
          <tr key={resource.id } />
            <td className="px-6 py-4 whitespace-nowrap">{resource.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{resource.role}</td>
            <td className="px-6 py-4 whitespace-nowrap">{resource.allocation}%</td>
            <td className="px-6 py-4 whitespace-nowrap">{resource.hours}h</td>
            <td className="px-6 py-4 whitespace-nowrap">R$ {resource.cost}</td>
            <td className="px-6 py-4 whitespace-nowrap" />
              <span className={`px-2 py-1 text-xs rounded-full ${
                resource.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              } `}>
           
        </span>{resource.status}
              </span></td><td className="px-6 py-4 whitespace-nowrap text-right" />
              <button onClick={() => onEdit(resource.id)} className="text-blue-600 hover:text-blue-800 mr-3">
                <Edit className="w-4 h-4" /></button><button onClick={() => onDelete(resource.id)} className="text-red-600 hover:text-red-800">
                <Trash2 className="w-4 h-4" /></button></td>
      </tr>
    </>
  ))}
      </tbody></table></div>);
