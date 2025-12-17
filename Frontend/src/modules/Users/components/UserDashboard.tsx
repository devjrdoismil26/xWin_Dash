import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import { useUserStats } from '../hooks/useUserStats';
import { UserStatsGrid } from './Dashboard/UserStatsGrid';
import { UserActivityList } from './UserActivityList';
import { UserRoleChart } from './UserRoleChart';

interface UsersDashboardProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const UsersDashboard: React.FC<UsersDashboardProps> = ({ className = ''    }) => {
  const { stats, loading, error, fetchStats } = useUserStats();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();

  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);

    await fetchStats();

    setRefreshing(false);};

  if (loading && !stats) {
    return (
              <div className=" ">$2</div><LoadingSpinner / />
      </div>);

  }

  if (error) {
    return (
        <>
      <Card />
      <Card.Content className="p-6" />
          <p className="text-red-600">Erro ao carregar dashboard: {error}</p>
        </Card.Content>
      </Card>);

  }

  if (!stats) return null;

  return (
        <>
      <PageTransition />
      <div className={`space-y-6 ${className} `}>
           
        </div><div className=" ">$2</div><h1 className="text-2xl font-bold text-gray-900">Dashboard de Usuários</h1>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline" />
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''} `} / />
            Atualizar
          </Button></div><UserStatsGrid
          totalUsers={ stats.totalUsers }
          activeUsers={ stats.activeUsers }
          inactiveUsers={ stats.inactiveUsers }
          growthRate={ stats.usersGrowthRate }
        / />
        <div className=" ">$2</div><UserRoleChart / />
          <UserActivityList / /></div></PageTransition>);};

export default UsersDashboard;
