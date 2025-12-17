/**
 * Dashboard principal do AuraCore
 *
 * @description
 * Componente principal que integra todos os subcomponentes do módulo Aura:
 * header, estatísticas, módulos e ações rápidas. Gerencia estados de loading
 * e erro, e coordena interações entre componentes.
 *
 * @module modules/Aura/AuraCore/components/AuraDashboard
 * @since 1.0.0
 */

import React from 'react';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { Card } from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { useAuraCore } from '../hooks';
import { AuraHeader } from './AuraHeader';
import { AuraStats } from './AuraStats';
import { cn } from '@/lib/utils';

/**
 * Props do componente AuraDashboard
 *
 * @interface AuraDashboardProps
 * @property {string} [className] - Classes CSS adicionais
 */
interface AuraDashboardProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente AuraDashboard
 *
 * @description
 * Renderiza dashboard completo do Aura com layout responsivo.
 * Integra header, estatísticas e módulos. Gerencia estados de loading
 * e erro automaticamente.
 *
 * @param {AuraDashboardProps} props - Props do componente
 * @returns {JSX.Element} Dashboard do Aura
 */
export const AuraDashboard: React.FC<AuraDashboardProps> = ({ className    }) => {
const {
loading,
error,
stats,
modules,
quick_actions,
refreshAllData,
getDashboardStatus,
hasData
} = useAuraCore();

const dashboardStatus = getDashboardStatus();

if (loading && !hasData()) {
return (
        <>
      <div className="flex items-center justify-center h-64">
      <LoadingSpinner size="lg" / />
</div>);

}

if (error) {
return (
        <ErrorState
title="Erro ao carregar dashboard"
description={ error }
onRetry={ refreshAllData }
/ />);

}

return (
        <div className={cn("aura-dashboard space-y-8", className) } />
{/* Cabeçalho */}
<AuraHeader
totalConnections={ stats?.total_connections || 0 }
totalFlows={ stats?.active_flows || 0 }
totalChats={ stats?.messages_sent || 0 }
loading={ loading }
onRefresh={ refreshAllData }
/ />
{/* Estatísticas */}
<AuraStats
stats={ stats }
loading={ loading }
error={ error }
onRefresh={ refreshAllData }
/ />
{/* Módulos */}
<AuraStats
modules={ modules }
loading={ loading }
error={ error }
/ />
{/* Ações Rápidas */}
<AuraHeader
actions={ quick_actions }
loading={ loading }
error={ error }
/ />
</div>);};
