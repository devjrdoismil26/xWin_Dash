import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import AuraStatsCards from '@/modules/Aura/Stats/components/AuraStatsCards';
import AuraStatsChart from '@/modules/Aura/Stats/components/AuraStatsChart';
import NotificationContainer from '@/shared/components/ui/NotificationContainer';
import Button from '@/shared/components/ui/Button';
import Select from '@/shared/components/ui/Select';
const StatsIndex: React.FC<{ auth?: string; stats?: string }> = ({ auth, stats    }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);};

  return (
        <>
      <AuthenticatedLayout user={ auth?.user } />
      <Head title="Estatísticas Aura" / />
      <PageLayout title="Estatísticas" />
        <div className="{/* Header with controls */}">$2</div>
          <div className=" ">$2</div><div>
           
        </div><h2 className="text-lg font-semibold text-gray-900">Dashboard de Métricas</h2>
              <p className="text-gray-600">Acompanhe o desempenho do seu atendimento</p></div><div className=" ">$2</div><Select
                value={ selectedPeriod }
                onChange={ (value: unknown) => setSelectedPeriod(value as '7d' | '30d' | '90d') }
                options={[
                  { value: '7d', label: 'Últimos 7 dias' },
                  { value: '30d', label: 'Últimos 30 dias' },
                  { value: '90d', label: 'Últimos 90 dias' }
                ]} />
              <Button variant="outline" onClick={ handleRefresh } />
                🔄 Atualizar
              </Button>
            </div>
          {/* Stats Cards */}
          <AuraStatsCards stats={stats} refreshTrigger={ refreshTrigger  }>
          {/* Chart */}
          <AuraStatsChart period={selectedPeriod} / /></div></PageLayout>
      <NotificationContainer / />
    </AuthenticatedLayout>);};

export default StatsIndex;
