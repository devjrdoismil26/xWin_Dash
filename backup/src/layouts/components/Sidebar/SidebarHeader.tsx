import React from 'react';
import { ChevronLeft, ChevronRight, Pin, PinOff, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  isPinned: boolean;
  isMinimized: boolean;
  filteredLinksCount: number;
  contentPadding: string;
  onToggleCollapse: () => void;
  onTogglePin: () => void;
  onToggleMinimize: () => void;
  className?: string;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  isPinned,
  isMinimized,
  filteredLinksCount,
  contentPadding,
  onToggleCollapse,
  onTogglePin,
  onToggleMinimize,
  className = ''
}) => {
  return (
    <div className={cn('flex items-center justify-between border-b border-white/10 dark:border-gray-700/30', contentPadding, 'py-4', className)}>
      {!isCollapsed && (
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">Navegação</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {filteredLinksCount} {filteredLinksCount === 1 ? 'item' : 'itens'}
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-1">
        <Tooltip content={isPinned ? 'Soltar' : 'Fixar'}>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onTogglePin} 
            className="w-8 h-8 p-0 hover:bg-white/30 dark:hover:bg-gray-800/50"
          >
            {isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
          </Button>
        </Tooltip>
        <Tooltip content={isCollapsed ? 'Expandir' : 'Recolher'}>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onToggleCollapse} 
            className="w-8 h-8 p-0 hover:bg-white/30 dark:hover:bg-gray-800/50"
          >
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </Button>
        </Tooltip>
        <Tooltip content={isMinimized ? 'Expandir' : 'Minimizar'}>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onToggleMinimize} 
            className="w-8 h-8 p-0 hover:bg-white/30 dark:hover:bg-gray-800/50"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default SidebarHeader;