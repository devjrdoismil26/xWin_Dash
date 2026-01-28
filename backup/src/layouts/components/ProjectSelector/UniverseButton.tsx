import React from 'react';
import { Brain, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface UniverseButtonProps {
  size: 'sm' | 'md' | 'lg';
  onClick: () => void;
}

const UniverseButton: React.FC<UniverseButtonProps> = ({ size, onClick }) => {
  return (
    <div className="relative">
      <Button
        variant="outline"
        size={size}
        onClick={onClick}
        className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 hover:shadow-lg transition-all duration-200"
      >
        <Brain className="w-4 h-4 mr-2 text-purple-600" />
        <span className="text-purple-700 dark:text-purple-300 font-medium">Universe</span>
        <Sparkles className="w-3 h-3 ml-1 text-yellow-500" />
      </Button>
      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-1.5 py-0.5">
        Novo
      </Badge>
    </div>
  );
};

export default UniverseButton;