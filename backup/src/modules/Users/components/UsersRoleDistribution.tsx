import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Eye,
  EyeOff,
  Filter,
  Download,
  Settings
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/LoadingStates';
import { Animated } from '@/components/ui/AdvancedAnimations';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import Tooltip from '@/components/ui/Tooltip';
import { useUserRoles } from '../hooks/useUserRoles';
import { useUserStats } from '../hooks/useUserStats';

interface UsersRoleDistributionProps {
  className?: string;
  showChart?: boolean;
  showTable?: boolean;
  showTrends?: boolean;
  refreshInterval?: number;
}

interface RoleData {
  role_id: string;
  role_name: string;
  user_count: number;
  percentage: number;
  color: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
  permissions_count: number;
  description?: string;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }>;
}

const UsersRoleDistribution: React.FC<UsersRoleDistributionProps> = ({ 
  className = '',
  showChart = true,
  showTable = true,
  showTrends = true,
  refreshInterval = 300000 // 5 minutos
}) => {
  const [roleData, setRoleData] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Hooks
  const { 
    roles, 
    fetchRoles, 
    roleStats, 
    fetchRoleStats 
  } = useUserRoles();

  const { 
    roleStats: userRoleStats, 
    fetchRoleStats: fetchUserRoleStats 
  } = useUserStats();

  // Cores para os roles
  const roleColors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
    '#EC4899', // pink
    '#6B7280'  // gray
  ];

  // Carregar dados iniciais
  useEffect(() => {
    loadRoleData();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(loadRoleData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  const loadRoleData = async () => {
    try {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchRoles(),
        fetchRoleStats(),
        fetchUserRoleStats()
      ]);

      // Simular dados de roles (em produção viria da API)
      const mockRoleData: RoleData[] = [
        {
          role_id: '1',
          role_name: 'Administrador',
          user_count: 5,
          percentage: 12.5,
          color: roleColors[0],
          trend: { value: 2.3, direction: 'up' },
          permissions_count: 25,
          description: 'Acesso completo ao sistema'
        },
        {
          role_id: '2',
          role_name: 'Moderador',
          user_count: 12,
          percentage: 30.0,
          color: roleColors[1],
          trend: { value: 1.8, direction: 'up' },
          permissions_count: 15,
          description: 'Gerenciamento de conteúdo e usuários'
        },
        {
          role_id: '3',
          role_name: 'Usuário',
          user_count: 20,
          percentage: 50.0,
          color: roleColors[2],
          trend: { value: 0.5, direction: 'down' },
          permissions_count: 5,
          description: 'Acesso básico ao sistema'
        },
        {
          role_id: '4',
          role_name: 'Editor',
          user_count: 3,
          percentage: 7.5,
          color: roleColors[3],
          trend: { value: 0, direction: 'stable' },
          permissions_count: 10,
          description: 'Criação e edição de conteúdo'
        }
      ];

      setRoleData(mockRoleData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de roles');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRoleData();
    setRefreshing(false);
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderPieChart = () => {
    if (!showChart || roleData.length === 0) return null;

    return (
      <div className="relative w-full h-64 flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Pie Chart Simulation */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {roleData.map((role, index) => {
              const startAngle = roleData.slice(0, index).reduce((acc, r) => acc + (r.percentage * 3.6), 0);
              const endAngle = startAngle + (role.percentage * 3.6);
              const largeArcFlag = role.percentage > 50 ? 1 : 0;
              
              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');

              return (
                <path
                  key={role.role_id}
                  d={pathData}
                  fill={role.color}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={() => setSelectedRole(role.role_id)}
                />
              );
            })}
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {roleData.reduce((sum, role) => sum + role.user_count, 0)}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBarChart = () => {
    if (!showChart || roleData.length === 0) return null;

    const maxCount = Math.max(...roleData.map(role => role.user_count));

    return (
      <div className="space-y-3">
        {roleData.map((role, index) => (
          <div key={role.role_id} className="flex items-center gap-3">
            <div className="w-20 text-sm font-medium text-gray-700 truncate">
              {role.role_name}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="h-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{
                  width: `${(role.user_count / maxCount) * 100}%`,
                  backgroundColor: role.color
                }}
              >
                <span className="text-xs font-medium text-white">
                  {role.user_count}
                </span>
              </div>
            </div>
            <div className="w-16 text-sm text-gray-600 text-right">
              {role.percentage.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTable = () => {
    if (!showTable || roleData.length === 0) return null;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuários
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Percentual
              </th>
              {showTrends && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tendência
                </th>
              )}
              {showDetails && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissões
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roleData.map((role) => (
              <tr key={role.role_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: role.color }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {role.role_name}
                      </div>
                      {showDetails && role.description && (
                        <div className="text-sm text-gray-500">
                          {role.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{role.user_count}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${role.percentage}%`,
                          backgroundColor: role.color
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {role.percentage.toFixed(1)}%
                    </span>
                  </div>
                </td>
                {showTrends && role.trend && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${getTrendColor(role.trend.direction)}`}>
                      {getTrendIcon(role.trend.direction)}
                      <span className="ml-1">
                        {role.trend.value.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                )}
                {showDetails && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {role.permissions_count}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRole(role.role_id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-8 w-24" />
        </div>
        <LoadingSkeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar distribuição de roles"
        message={error}
        action={
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        }
      />
    );
  }

  if (roleData.length === 0) {
    return (
      <EmptyState
        title="Nenhum role encontrado"
        message="Não há dados de roles para exibir"
        action={
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Recarregar
          </Button>
        }
      />
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Distribuição de Roles</h3>
          <p className="text-gray-600">Visão geral dos roles e permissões dos usuários</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'chart' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('chart')}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Gráfico
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Tabela
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Chart/Table */}
      <Card className="p-6">
        {viewMode === 'chart' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Distribuição por Role</h4>
              {renderPieChart()}
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Comparação de Usuários</h4>
              {renderBarChart()}
            </div>
          </div>
        ) : (
          renderTable()
        )}
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Legenda</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {roleData.map((role) => (
            <div key={role.role_id} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: role.color }}
              />
              <span className="text-sm text-gray-700">{role.role_name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default UsersRoleDistribution;
