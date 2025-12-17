import React from 'react';
import { User } from '@/types/user.types';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Eye, Pencil, Trash2, Check, X } from 'lucide-react';

interface UserTableRowProps {
  user: User;
  isSelected: boolean;
  onSelect?: (e: any) => void;
  onEdit?: (e: any) => void;
  onDelete?: (e: any) => void;
  onToggleStatus?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const UserTableRow: React.FC<UserTableRowProps> = ({ user,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleStatus
   }) => (
  <tr className="hover:bg-gray-50" />
    <td className="px-4 py-3" />
      <input
        type="checkbox"
        checked={ isSelected }
        onChange={ () => onSelect(user.id) }
        className="rounded border-gray-300" /></td><td className="px-4 py-3" />
      <div className=" ">$2</div><div className=" ">$2</div><span className="text-blue-600 font-semibold">{user.name.charAt(0)}</span></div><div>
           
        </div><p className="font-medium text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p></div></td>
    <td className="px-4 py-3" />
      <Badge variant={ user.role === 'admin' ? 'default' : 'secondary' } />
        {user.role}
      </Badge></td><td className="px-4 py-3" />
      <Badge variant={ user.status === 'active' ? 'success' : 'secondary' } />
        {user.status}
      </Badge></td><td className="px-4 py-3 text-sm text-gray-500" />
      {new Date(user.created_at).toLocaleDateString()}
    </td>
    <td className="px-4 py-3" />
      <div className=" ">$2</div><Button size="sm" variant="ghost" onClick={ () => onEdit(user)  }>
          <Pencil className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={ () => onToggleStatus(user.id)  }>
          {user.status === 'active' ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
        </Button>
        <Button size="sm" variant="ghost" onClick={ () => onDelete(user.id)  }>
          <Trash2 className="h-4 w-4 text-red-600" /></Button></div></td></tr>);
