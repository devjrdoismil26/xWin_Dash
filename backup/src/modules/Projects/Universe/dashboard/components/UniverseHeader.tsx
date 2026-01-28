import React from 'react';
import { motion } from 'framer-motion';
import { ENHANCED_TRANSITIONS } from '@/components/ui/design-tokens';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface UniverseHeaderProps {
  onNavigate: (path: string) => void;
}

const UniverseHeader: React.FC<UniverseHeaderProps> = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={ENHANCED_TRANSITIONS.smooth}
      className="flex items-center justify-between"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Universe Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Central de controle para todos os projetos e recursos
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="success">Ativo</Badge>
          <Badge variant="info">12 Projetos</Badge>
          <Badge variant="warning">3 Pendentes</Badge>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => onNavigate('/projects/create')}
          className="flex items-center gap-2"
        >
          <span>+</span>
          Novo Projeto
        </Button>
        <Button
          variant="primary"
          onClick={() => onNavigate('/projects/analytics')}
          className="flex items-center gap-2"
        >
          <span>📊</span>
          Analytics
        </Button>
      </div>
    </motion.div>
  );
};

export default UniverseHeader;