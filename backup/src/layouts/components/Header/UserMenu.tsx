import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import Dropdown from '@/components/ui/Dropdown';

interface UserMenuProps {
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ className = '' }) => {
  // Em um contexto real, isso viria do AuthContext
  const user = {
    name: 'Usuário',
    email: 'usuario@exemplo.com'
  };

  return (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <button className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}>
          <span className="sr-only">Abrir menu do usuário</span>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-lg">
            {typeof user?.name === 'string' ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {typeof user?.name === 'string' ? user.name : "Usuário"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {typeof user?.email === 'string' ? user.email : "email@exemplo.com"}
            </p>
          </div>
        </button>
      </Dropdown.Trigger>

      <Dropdown.Content align="right" className="w-56">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-600">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {typeof user?.name === 'string' ? user.name : "Usuário"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {typeof user?.email === 'string' ? user.email : "email@exemplo.com"}
          </p>
        </div>

        <Dropdown.Item href="/profile">
          <User className="mr-3 h-4 w-4" />
          Perfil
        </Dropdown.Item>

        <Dropdown.Item href="/settings">
          <Settings className="mr-3 h-4 w-4" />
          Configurações
        </Dropdown.Item>

        <Dropdown.Divider />

        <Dropdown.Item href="/logout" method="post" as="button">
          <LogOut className="mr-3 h-4 w-4" />
          Sair
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
};

export default UserMenu;