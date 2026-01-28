/**
* Componente principal do dashboard do AuraCore
* Layout principal com estatísticas, módulos e ações rápidas
*/
import React from 'react';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ErrorState } from '@/components/ui/ErrorState';
import { useAuraCore } from '../hooks';
import { AuraHeader } from './AuraHeader';
import { AuraStats } from './AuraStats';
import { cn } from '@/lib/utils';

interface AuraDashboardProps {
className?: string;
}

export const AuraDashboard: React.FC<AuraDashboardProps> = ({ className }) => {
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
<div className="flex items-center justify-center h-64">
<LoadingSpinner size="lg" />
</div>
);
}

if (error) {
return (
<ErrorState
title="Erro ao carregar dashboard"
description={error}
onRetry={refreshAllData}
/>
);
}

return (
<div className={cn("aura-dashboard space-y-8", className)}>
{/* Cabeçalho */}
<AuraHeader
totalConnections={stats?.total_connections || 0}
totalFlows={stats?.active_flows || 0}
totalChats={stats?.messages_sent || 0}
loading={loading}
onRefresh={refreshAllData}
/>

{/* Estatísticas */}
<AuraStats
stats={stats}
loading={loading}
error={error}
onRefresh={refreshAllData}
/>

{/* Módulos */}
<AuraStats
modules={modules}
loading={loading}
error={error}
/>

{/* Ações Rápidas */}
<AuraHeader
actions={quick_actions}
loading={loading}
error={error}
/>
</div>
);
};
