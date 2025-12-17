import React from 'react';
import Card from '@/shared/components/ui/Card';

interface User {
  id: number;
  name: string;
  email: string;
  role: string; }

interface UsersTableProps {
  users: User[];
  onEdit?: (e: any) => void;
  onDelete?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const UsersTable: React.FC<UsersTableProps> = ({ users, onEdit, onDelete    }) => {
  return (
        <>
      <Card />
      <table className="w-full" />
        <thead className="bg-gray-50" />
          <tr />
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-right">Ações</th></tr></thead>
        <tbody />
          {users.map(user => (
            <tr key={user.id} className="border-t" />
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2 text-right" />
                <button onClick={() => onEdit(user.id)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => onDelete(user.id)} className="text-red-600">Delete</button></td></tr>
          ))}
        </tbody></table></Card>);};
