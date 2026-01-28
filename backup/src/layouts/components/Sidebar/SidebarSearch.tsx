import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface SidebarSearchProps {
  isCollapsed: boolean;
  searchQuery: string;
  contentPadding: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  className?: string;
}

const SidebarSearch: React.FC<SidebarSearchProps> = ({
  isCollapsed,
  searchQuery,
  contentPadding,
  onSearchChange,
  onClearSearch,
  className = ''
}) => {
  if (isCollapsed) return null;

  return (
    <div className={cn('border-b border-white/10 dark:border-gray-700/30', contentPadding, 'py-3', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            'pl-10 pr-4 py-2 text-sm',
            'bg-white/40 dark:bg-gray-800/40',
            'border-white/20 dark:border-gray-600/30',
            'focus:bg-white/70 dark:focus:bg-gray-800/70',
            'focus:border-primary/50 dark:focus:border-primary/50',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'transition-all duration-200'
          )}
        />
        {searchQuery && (
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onClearSearch} 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 hover:bg-gray-200/50"
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
};

export default SidebarSearch;