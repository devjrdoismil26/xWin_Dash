import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  User, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Shield, 
  Bell, 
  Settings, 
  Clock, 
  Filter, 
  RefreshCw, 
  Eye, 
  MoreHorizontal,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/LoadingStates';
import { Animated } from '@/components/ui/AdvancedAnimations';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import Tooltip from '@/components/ui/Tooltip';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUserActivity } from '../hooks/useUserActivity';

interface UsersRecentActivityProps {
  className?: string;
  limit?: number;
  showFilters?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface ActivityItem {
  id: string;
  type: 'user_created' | 'user_updated' | 'user_deleted' | 'user_activated' | 'user_deactivated' | 
        'user_suspended' | 'role_assigned' | 'role_removed' | 'login' | 'logout' | 'profile_updated' |
        'notification_sent' | 'bulk_action' | 'system_event';
  user_id: string;
  user_name: string;
  user_avatar?: string;
  description: string;
  details?: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: {
    ip_address?: string;
    user_agent?: string;
    location?: string;
    affected_users?: number;
    role_name?: string;
    action_type?: string;
  };
}

const UsersRecentActivity: React.FC<UsersRecentActivityProps> = ({ 
  className = '',
  limit = 10,
  showFilters = true,
  autoRefresh = true,
  refreshInterval = 30000 // 30 segundos
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Hooks
  const { 
    recentActivities, 
    fetchRecentActivities, 
    activityTypes, 
    fetchActivityTypes 
  } = useUserActivity();

  // Carregar dados iniciais
  useEffect(() => {
    loadActivities();
  }, [limit, filter]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(loadActivities, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, limit, filter]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchRecentActivities({ limit, type: filter === 'all' ? undefined : filter }),
        fetchActivityTypes()
      ]);

      // Simular dados de atividades (em produção viria da API)
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'user_created',
          user_id: 'user1',
          user_name: 'João Silva',
          description: 'Usuário criado com sucesso',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          status: 'success',
          metadata: { ip_address: '192.168.1.1' }
        },
        {
          id: '2',
          type: 'role_assigned',
          user_id: 'user2',
          user_name: 'Maria Santos',
          description: 'Role de administrador atribuída',
          details: 'O usuário recebeu permissões de administrador do sistema',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          status: 'info',
          metadata: { role_name: 'admin', action_type: 'role_assignment' }
        },
        {
          id: '3',
          type: 'user_suspended',
          user_id: 'user3',
          user_name: 'Pedro Costa',
          description: 'Usuário suspenso por violação de política',
          details: 'Suspensão temporária por 7 dias devido a múltiplas tentativas de login inválidas',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'warning',
          metadata: { action_type: 'security_violation' }
        },
        {
          id: '4',
          type: 'bulk_action',
          user_id: 'system',
          user_name: 'Sistema',
          description: 'Ação em lote executada',
          details: '15 usuários foram ativados em lote',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          status: 'success',
          metadata: { affected_users: 15, action_type: 'bulk_activate' }
        },
        {
          id: '5',
          type: 'login',
          user_id: 'user4',
          user_name: 'Ana Oliveira',
          description: 'Login realizado com sucesso',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          status: 'success',
          metadata: { ip_address: '192.168.1.5', location: 'São Paulo, SP' }
        }
      ];

      setActivities(mockActivities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadActivities();
    setRefreshing(false);
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getActivityIcon = (type: string, status: string) => {
    const iconClass = `w-5 h-5 ${
      status === 'success' ? 'text-green-600' :
      status === 'warning' ? 'text-yellow-600' :
      status === 'error' ? 'text-red-600' : 'text-blue-600'
    }`;

    switch (type) {
      case 'user_created':
        return <UserPlus className={iconClass} />;
      case 'user_updated':
        return <User className={iconClass} />;
      case 'user_deleted':
        return <UserX className={iconClass} />;
      case 'user_activated':
        return <UserCheck className={iconClass} />;
      case 'user_deactivated':
        return <UserX className={iconClass} />;
      case 'user_suspended':
        return <AlertCircle className={iconClass} />;
      case 'role_assigned':
      case 'role_removed':
        return <Shield className={iconClass} />;
      case 'login':
        return <CheckCircle className={iconClass} />;
      case 'logout':
        return <XCircle className={iconClass} />;
      case 'profile_updated':
        return <Settings className={iconClass} />;
      case 'notification_sent':
        return <Bell className={iconClass} />;
      case 'bulk_action':
        return <Activity className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  const filterOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'user_created', label: 'Criação' },
    { value: 'user_updated', label: 'Atualização' },
    { value: 'user_activated', label: 'Ativação' },
    { value: 'user_suspended', label: 'Suspensão' },
    { value: 'role_assigned', label: 'Roles' },
    { value: 'login', label: 'Login' },
    { value: 'bulk_action', label: 'Ações em Lote' }
  ];

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-8 w-24" />
        </div>
        {[...Array(5)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar atividades"
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

  if (activities.length === 0) {
    return (
      <EmptyState
        title="Nenhuma atividade recente"
        message="Não há atividades para exibir no momento"
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
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
          <p className="text-gray-600">Últimas ações realizadas no sistema</p>
        </div>
        <div className="flex items-center gap-2">
          {showFilters && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
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

      {/* Activities List */}
      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {activities.map((activity, index) => (
            <Animated key={activity.id} delay={index * 50}>
              <div className={`p-4 hover:bg-gray-50 transition-colors ${getStatusColor(activity.status)}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type, activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user_name}
                        </p>
                        <span className="text-sm text-gray-500">•</span>
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tooltip content={new Date(activity.timestamp).toLocaleString('pt-BR')}>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </Tooltip>
                        {activity.details && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(activity.id)}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {activity.details && expandedItems.has(activity.id) && (
                      <div className="mt-2 p-3 bg-white rounded-md border border-gray-200">
                        <p className="text-sm text-gray-700">{activity.details}</p>
                        {activity.metadata && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {activity.metadata.ip_address && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                IP: {activity.metadata.ip_address}
                              </span>
                            )}
                            {activity.metadata.role_name && (
                              <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                                Role: {activity.metadata.role_name}
                              </span>
                            )}
                            {activity.metadata.affected_users && (
                              <span className="text-xs bg-green-100 px-2 py-1 rounded">
                                {activity.metadata.affected_users} usuários
                              </span>
                            )}
                            {activity.metadata.location && (
                              <span className="text-xs bg-purple-100 px-2 py-1 rounded">
                                {activity.metadata.location}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Animated>
          ))}
        </div>
      </Card>

      {/* Load More */}
      {activities.length >= limit && (
        <div className="text-center">
          <Button variant="outline" onClick={loadActivities}>
            Carregar Mais Atividades
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsersRecentActivity;
