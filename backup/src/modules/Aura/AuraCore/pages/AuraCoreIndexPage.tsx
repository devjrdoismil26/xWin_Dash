/**
 * Página principal do módulo AuraCore
 * Dashboard com visão geral do sistema
 */
import React from 'react';
import { AuraDashboard } from '../components';
import { cn } from '@/lib/utils';

interface AuraCoreIndexPageProps {
  className?: string;
}

export const AuraCoreIndexPage: React.FC<AuraCoreIndexPageProps> = ({ className }) => {
  return (
    <div className={cn("aura-core-index-page", className)}>
      <AuraDashboard />
    </div>
  );
};
