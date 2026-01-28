// Componentes principais do módulo Users
export { default as UsersDashboard } from './UsersDashboard';
export { default as UsersStats } from './UsersStats';
export { default as UsersQuickActions } from './UsersQuickActions';
export { default as UsersRecentActivity } from './UsersRecentActivity';
export { default as UsersRoleDistribution } from './UsersRoleDistribution';
export { default as UsersIntegrationTest } from './UsersIntegrationTest';

// Componentes de criação/edição
export { default as UserCreateEdit } from './UserCreateEdit';
export { default as UserForm } from './UserForm';

// Interfaces e tipos dos componentes
export interface UsersDashboardProps {
  className?: string;
}

export interface UsersStatsProps {
  className?: string;
  showDetails?: boolean;
  refreshInterval?: number;
}

export interface UsersQuickActionsProps {
  className?: string;
  onActionComplete?: (action: string, result?: any) => void;
  selectedUsers?: string[];
  onSelectionChange?: (users: string[]) => void;
}

export interface UsersRecentActivityProps {
  className?: string;
  limit?: number;
  showFilters?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UsersRoleDistributionProps {
  className?: string;
  showChart?: boolean;
  showTable?: boolean;
  showTrends?: boolean;
  refreshInterval?: number;
}

export interface UsersIntegrationTestProps {
  className?: string;
  autoRun?: boolean;
  showDetails?: boolean;
  onTestComplete?: (results: TestResults) => void;
}

// Tipos auxiliares
export interface TestResults {
  totalSuites: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  totalDuration: number;
  suites: TestSuite[];
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: Test[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  error?: string;
  details?: any;
}

export interface ActivityItem {
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

export interface RoleData {
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

export interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
  format?: 'number' | 'percentage' | 'duration';
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  requiresSelection?: boolean;
  requiresConfirmation?: boolean;
  action: () => void;
  disabled?: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  newUsersToday: number;
  usersGrowthRate: number;
  averageSessionDuration: number;
  unreadNotifications: number;
  totalActivities: number;
  activitiesToday: number;
}
