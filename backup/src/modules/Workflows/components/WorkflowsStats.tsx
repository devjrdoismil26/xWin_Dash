import React from 'react';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';
import { Card } from "@/components/ui/Card";
import { AnimatedCounter, Animated } from '@/components/ui/AdvancedAnimations';
import { ProgressBar, CircularProgress } from '@/components/ui/AdvancedProgress';
import { LoadingSkeleton } from '@/components/ui/LoadingStates';
import { cn } from '@/lib/utils';

// Interfaces
interface ExecutionStats {
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  running_executions: number;
  average_execution_time: number;
  success_rate: number;
  failure_rate: number;
  throughput_per_hour: number;
}

interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  active_connections: number;
  queue_size: number;
  processing_rate: number;
  error_rate: number;
  uptime: number;
}

interface WorkflowsStatsProps {
  stats?: ExecutionStats | null;
  systemMetrics?: SystemMetrics | null;
  loading?: boolean;
  className?: string;
  showSystemMetrics?: boolean;
  showDetailedStats?: boolean;
}

/**
 * Componente de estatísticas de workflows
 * Exibe métricas de execução e performance do sistema
 */
const WorkflowsStats: React.FC<WorkflowsStatsProps> = ({
  stats,
  systemMetrics,
  loading = false,
  className,
  showSystemMetrics = true,
  showDetailedStats = true
}) => {
  // Formatar tempo de execução
  const formatExecutionTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  // Formatar uptime
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Formatar taxa de processamento
  const formatProcessingRate = (rate: number) => {
    return `${rate.toFixed(1)}/h`;
  };

  if (loading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <Card.Header className="pb-2">
              <LoadingSkeleton className="h-4 w-24" />
            </Card.Header>
            <Card.Content>
              <LoadingSkeleton className="h-8 w-16 mb-2" />
              <LoadingSkeleton className="h-3 w-20" />
            </Card.Content>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Estatísticas de Execução */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total de Execuções */}
          <Animated delay={0.1}>
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Total Execuções</Card.Title>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold">
                  <AnimatedCounter value={stats.total_executions} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatProcessingRate(stats.throughput_per_hour)} throughput
                </p>
              </Card.Content>
            </Card>
          </Animated>

          {/* Execuções Bem-sucedidas */}
          <Animated delay={0.2}>
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Sucessos</Card.Title>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold text-green-600">
                  <AnimatedCounter value={stats.successful_executions} />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <ProgressBar 
                    value={stats.success_rate} 
                    className="flex-1 h-2" 
                    color="green"
                  />
                  <span className="text-xs text-muted-foreground">
                    {stats.success_rate.toFixed(1)}%
                  </span>
                </div>
              </Card.Content>
            </Card>
          </Animated>

          {/* Execuções Falhadas */}
          <Animated delay={0.3}>
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Falhas</Card.Title>
                <XCircle className="h-4 w-4 text-red-500" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold text-red-600">
                  <AnimatedCounter value={stats.failed_executions} />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <ProgressBar 
                    value={stats.failure_rate} 
                    className="flex-1 h-2" 
                    color="red"
                  />
                  <span className="text-xs text-muted-foreground">
                    {stats.failure_rate.toFixed(1)}%
                  </span>
                </div>
              </Card.Content>
            </Card>
          </Animated>

          {/* Execuções em Andamento */}
          <Animated delay={0.4}>
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Em Execução</Card.Title>
                <Activity className="h-4 w-4 text-blue-500" />
              </Card.Header>
              <Card.Content>
                <div className="text-2xl font-bold text-blue-600">
                  <AnimatedCounter value={stats.running_executions} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Tempo médio: {formatExecutionTime(stats.average_execution_time)}
                </p>
              </Card.Content>
            </Card>
          </Animated>
        </div>
      )}

      {/* Métricas do Sistema */}
      {showSystemMetrics && systemMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* CPU Usage */}
          <Animated delay={0.5}>
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">CPU</Card.Title>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="flex items-center gap-3">
                  <CircularProgress 
                    value={systemMetrics.cpu_usage} 
                    size={60}
                    strokeWidth={6}
                    color={systemMetrics.cpu_usage > 80 ? 'red' : systemMetrics.cpu_usage > 60 ? 'yellow' : 'green'}
                  />
                  <div>
                    <div className="text-2xl font-bold">
                      {systemMetrics.cpu_usage.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {systemMetrics.active_connections} conexões
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </Animated>

          {/* Memory Usage */}
          <Animated delay={0.6}>
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Memória</Card.Title>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="flex items-center gap-3">
                  <CircularProgress 
                    value={systemMetrics.memory_usage} 
                    size={60}
                    strokeWidth={6}
                    color={systemMetrics.memory_usage > 80 ? 'red' : systemMetrics.memory_usage > 60 ? 'yellow' : 'green'}
                  />
                  <div>
                    <div className="text-2xl font-bold">
                      {systemMetrics.memory_usage.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {systemMetrics.queue_size} na fila
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </Animated>

          {/* System Health */}
          <Animated delay={0.7}>
            <Card>
              <Card.Header className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title className="text-sm font-medium">Sistema</Card.Title>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </Card.Header>
              <Card.Content>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de Processamento</span>
                    <span className="text-sm font-medium">
                      {formatProcessingRate(systemMetrics.processing_rate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de Erro</span>
                    <span className={cn(
                      'text-sm font-medium',
                      systemMetrics.error_rate > 5 ? 'text-red-600' : 
                      systemMetrics.error_rate > 2 ? 'text-yellow-600' : 'text-green-600'
                    )}>
                      {systemMetrics.error_rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium">
                      {formatUptime(systemMetrics.uptime)}
                    </span>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </Animated>
        </div>
      )}

      {/* Estatísticas Detalhadas */}
      {showDetailedStats && stats && (
        <Animated delay={0.8}>
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Detalhada
              </Card.Title>
              <Card.Description>
                Métricas avançadas de performance e throughput
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Throughput */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Throughput</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatProcessingRate(stats.throughput_per_hour)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Execuções por hora
                  </p>
                </div>

                {/* Tempo Médio */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Tempo Médio</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {formatExecutionTime(stats.average_execution_time)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Por execução
                  </p>
                </div>

                {/* Taxa de Sucesso */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Taxa de Sucesso</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.success_rate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Últimas 24h
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>
        </Animated>
      )}
    </div>
  );
};

export default WorkflowsStats;
