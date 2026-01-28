import React from 'react';
import { PlusCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import UniverseButton from './UniverseButton';

interface EmptyProjectStateProps {
  size: 'sm' | 'md' | 'lg';
  showUniverseMode: boolean;
  className: string;
  onOpenUniverseMode: () => void;
}

const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({
  size,
  showUniverseMode,
  className,
  onOpenUniverseMode
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button variant="outline" size={size}>
        <PlusCircle className="w-4 h-4 mr-2" /> 
        Criar Projeto
      </Button>
      {showUniverseMode && (
        <UniverseButton size={size} onClick={onOpenUniverseMode} />
      )}
    </div>
  );
};

export default EmptyProjectState;