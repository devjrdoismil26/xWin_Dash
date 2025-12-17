import React from 'react';
import { motion } from 'framer-motion';
import { ENHANCED_TRANSITIONS } from '@/shared/components/ui/design-tokens';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';

interface UniverseHeaderProps {
  onNavigate?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const UniverseHeader: React.FC<UniverseHeaderProps> = ({ onNavigate    }) => {
  return (
        <>
      <div
      className="flex items-center justify-between">
      </div><div>
           
        </div><h1 className="text-3xl font-bold text-gray-900 dark:text-white" />
          Universe Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1" />
          Central de controle para todos os projetos e recursos
        </p>
        <div className=" ">$2</div><Badge variant="success">Ativo</Badge>
          <Badge variant="info">12 Projetos</Badge>
          <Badge variant="warning">3 Pendentes</Badge></div><div className=" ">$2</div><Button
          variant="outline"
          onClick={ () => onNavigate('/projects/create') }
          className="flex items-center gap-2"
        >
          <span>+</span>
          Novo Projeto
        </Button>
        <Button
          variant="primary"
          onClick={ () => onNavigate('/projects/analytics') }
          className="flex items-center gap-2"
        >
          <span>📊</span>
          Analytics
        </Button>
      </div>);};

export default UniverseHeader;