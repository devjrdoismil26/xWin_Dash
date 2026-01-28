import React from 'react';
import { Search } from 'lucide-react';
import { NotificationBell } from '@/components/Notifications/NotificationBell';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';

interface HeaderActionsProps {
  onSearchOpen: () => void;
  className?: string;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ 
  onSearchOpen, 
  className = '' 
}) => {
  return (
    <div className={`hidden sm:flex sm:items-center sm:space-x-4 ${className}`}>
      {/* Global Search */}
      <button
        onClick={onSearchOpen}
        className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        title="Busca global (Cmd+K)"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Theme Toggle */}
      <ThemeToggle compact={true} />

      {/* Notifications */}
      <NotificationBell />

      {/* User Menu */}
      <UserMenu />
    </div>
  );
};

export default HeaderActions;