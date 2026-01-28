import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../../hooks/useTranslation';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useAdvancedNotifications } from '../../../hooks/useAdvancedNotifications';
import { useLoadingStates } from '../../../hooks/useLoadingStates';
import {
  Users, User, UserPlus, UserMinus, UserCheck, UserX, Crown, Shield,
  Key, Lock, Unlock, Mail, Phone, MapPin, Calendar, Clock,
  Search, Filter, Grid, List, Eye, Edit2, Trash2, Ban, CheckCircle2,
  AlertCircle, XCircle, MoreHorizontal, Download, Upload, Settings,
  Award, Star, Heart, Zap, Activity, BarChart3, TrendingUp,
  Globe, Smartphone, Monitor, Tablet, Wifi, WifiOff, Power,
  UserCog, Briefcase, GraduationCap, Building, Home, MapPin2,
  Camera, Image, FileText, MessageSquare, Bell, BellOff,
  CreditCard, DollarSign, Package, ShoppingCart, Layers
} from 'lucide-react';
// Interfaces
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'banned';
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  profile: UserProfile;
  permissions: Permission[];
  subscription?: Subscription;
  activity: UserActivity;
  preferences: UserPreferences;
}
interface UserRole {
  id: string;
  name: string;
  level: number;
  color: string;
  permissions: string[];
}
interface UserProfile {
  bio?: string;
  location?: string;
  timezone: string;
  language: string;
  company?: string;
  position?: string;
  website?: string;
  socialLinks: Record<string, string>;
  skills: string[];
  interests: string[];
}
interface Permission {
  id: string;
  name: string;
  resource: string;
  actions: string[];
}
interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  startDate: string;
  endDate: string;
  features: string[];
  usage: Record<string, number>;
  limits: Record<string, number>;
}
interface UserActivity {
  loginCount: number;
  lastLoginDevice: string;
  lastLoginLocation: string;
  sessionsCount: number;
  actionsCount: number;
  engagementScore: number;
  favoriteFeatures: string[];
  timeSpent: number;
}
interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
    emailVisible: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
  };
}
interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  churnRate: number;
  averageEngagement: number;
  topRoles: { role: string; count: number }[];
  activityTrends: { date: string; users: number }[];
  geographicDistribution: { country: string; users: number }[];
  deviceStats: { device: string; percentage: number }[];
  recentActivity: ActivityEvent[];
}
interface ActivityEvent {
  id: string;
  type: 'user_registered' | 'user_login' | 'subscription_started' | 'role_changed' | 'user_suspended';
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  metadata: Record<string, any>;
}
const AdvancedUserManagementDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { showNotification, showError, showSuccess } = useAdvancedNotifications();
  const { isLoading, setLoading } = useLoadingStates();
  // Estados principais
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'lastLogin' | 'created'>('created');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  // Roles disponíveis
  const userRoles: UserRole[] = [
    {
      id: '1',
      name: 'Super Admin',
      level: 100,
      color: 'bg-red-500',
      permissions: ['*']
    },
    {
      id: '2',
      name: 'Admin',
      level: 80,
      color: 'bg-purple-500',
      permissions: ['users.*', 'settings.*', 'analytics.read']
    },
    {
      id: '3',
      name: 'Manager',
      level: 60,
      color: 'bg-blue-500',
      permissions: ['users.read', 'projects.*', 'reports.read']
    },
    {
      id: '4',
      name: 'Editor',
      level: 40,
      color: 'bg-green-500',
      permissions: ['content.*', 'media.*']
    },
    {
      id: '5',
      name: 'User',
      level: 20,
      color: 'bg-gray-500',
      permissions: ['profile.*']
    }
  ];
  // Dados simulados
  useEffect(() => {
    const loadData = async () => {
      setLoading('users', true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao.silva@exemplo.com',
          phone: '+55 11 99999-9999',
          role: userRoles[1], // Admin
          status: 'active',
          emailVerified: true,
          phoneVerified: true,
          twoFactorEnabled: true,
          lastLogin: '2024-01-20T14:30:00Z',
          createdAt: '2023-06-15T10:00:00Z',
          profile: {
            bio: 'Desenvolvedor Full-stack especializado em React e Node.js',
            location: 'São Paulo, Brasil',
            timezone: 'America/Sao_Paulo',
            language: 'pt-BR',
            company: 'Tech Solutions Inc.',
            position: 'Lead Developer',
            website: 'https://joaosilva.dev',
            socialLinks: {
              linkedin: 'https://linkedin.com/in/joaosilva',
              github: 'https://github.com/joaosilva'
            },
            skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
            interests: ['Technology', 'Startup', 'AI', 'Open Source']
          },
          permissions: [
            {
              id: '1',
              name: 'User Management',
              resource: 'users',
              actions: ['create', 'read', 'update', 'delete']
            }
          ],
          subscription: {
            id: '1',
            plan: 'Pro',
            status: 'active',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            features: ['Advanced Analytics', 'API Access', 'Priority Support'],
            usage: { api_calls: 1200, storage: 5.2 },
            limits: { api_calls: 10000, storage: 50 }
          },
          activity: {
            loginCount: 156,
            lastLoginDevice: 'MacBook Pro',
            lastLoginLocation: 'São Paulo, Brasil',
            sessionsCount: 89,
            actionsCount: 2340,
            engagementScore: 92,
            favoriteFeatures: ['Dashboard', 'Analytics', 'Projects'],
            timeSpent: 12450 // minutes
          },
          preferences: {
            notifications: {
              email: true,
              push: true,
              sms: false,
              marketing: false
            },
            privacy: {
              profileVisible: true,
              activityVisible: false,
              emailVisible: false
            },
            display: {
              theme: 'dark',
              language: 'pt-BR',
              timezone: 'America/Sao_Paulo'
            }
          }
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria.santos@exemplo.com',
          phone: '+55 11 88888-8888',
          role: userRoles[2], // Manager
          status: 'active',
          emailVerified: true,
          phoneVerified: false,
          twoFactorEnabled: false,
          lastLogin: '2024-01-19T16:45:00Z',
          createdAt: '2023-08-20T14:30:00Z',
          profile: {
            bio: 'Gerente de Projetos com 10 anos de experiência',
            location: 'Rio de Janeiro, Brasil',
            timezone: 'America/Sao_Paulo',
            language: 'pt-BR',
            company: 'Consulting Group',
            position: 'Project Manager',
            socialLinks: {},
            skills: ['Project Management', 'Agile', 'Scrum'],
            interests: ['Management', 'Leadership', 'Innovation']
          },
          permissions: [],
          activity: {
            loginCount: 89,
            lastLoginDevice: 'iPhone 15',
            lastLoginLocation: 'Rio de Janeiro, Brasil',
            sessionsCount: 56,
            actionsCount: 1450,
            engagementScore: 78,
            favoriteFeatures: ['Projects', 'Teams', 'Reports'],
            timeSpent: 8930
          },
          preferences: {
            notifications: {
              email: true,
              push: true,
              sms: true,
              marketing: true
            },
            privacy: {
              profileVisible: true,
              activityVisible: true,
              emailVisible: true
            },
            display: {
              theme: 'light',
              language: 'pt-BR',
              timezone: 'America/Sao_Paulo'
            }
          }
        }
      ];
      setUsers(mockUsers);
      setAnalytics({
        totalUsers: 2847,
        activeUsers: 2156,
        newUsersThisMonth: 234,
        churnRate: 2.3,
        averageEngagement: 78.5,
        topRoles: [
          { role: 'User', count: 1890 },
          { role: 'Manager', count: 567 },
          { role: 'Editor', count: 234 },
          { role: 'Admin', count: 89 }
        ],
        activityTrends: [
          { date: '2024-01-15', users: 1450 },
          { date: '2024-01-16', users: 1560 },
          { date: '2024-01-17', users: 1680 },
          { date: '2024-01-18', users: 1720 },
          { date: '2024-01-19', users: 1890 },
          { date: '2024-01-20', users: 2156 }
        ],
        geographicDistribution: [
          { country: 'Brasil', users: 1234 },
          { country: 'Estados Unidos', users: 567 },
          { country: 'Portugal', users: 234 },
          { country: 'México', users: 123 }
        ],
        deviceStats: [
          { device: 'Desktop', percentage: 45 },
          { device: 'Mobile', percentage: 35 },
          { device: 'Tablet', percentage: 20 }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'user_registered',
            userId: '3',
            userName: 'Ana Costa',
            message: 'Novo usuário registrado',
            timestamp: '2024-01-20T15:30:00Z',
            metadata: { plan: 'Basic' }
          },
          {
            id: '2',
            type: 'role_changed',
            userId: '2',
            userName: 'Maria Santos',
            message: 'Role alterado de User para Manager',
            timestamp: '2024-01-20T14:15:00Z',
            metadata: { oldRole: 'User', newRole: 'Manager' }
          }
        ]
      });
      setLoading('users', false);
    };
    loadData();
  }, [setLoading]);
  // Filtros e ordenação
  const filteredUsers = useMemo(() => {
    const filtered = users.filter(user => {
      const matchesRole = filterRole === 'all' || user.role.name === filterRole;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.profile.company?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    });
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'role':
          return b.role.level - a.role.level;
        case 'lastLogin':
          return new Date(b.lastLogin || 0).getTime() - new Date(a.lastLogin || 0).getTime();
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [users, filterRole, filterStatus, searchQuery, sortBy]);
  // Handlers
  const handleUserAction = useCallback(async (action: string, userId: string | string[]) => {
    const userIds = Array.isArray(userId) ? userId : [userId];
    setLoading(action, true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      switch (action) {
        case 'activate':
          setUsers(prev => prev.map(u => 
            userIds.includes(u.id) ? { ...u, status: 'active' as const } : u
          ));
          showSuccess(`${userIds.length} usuário(s) ativado(s)`);
          break;
        case 'suspend':
          setUsers(prev => prev.map(u => 
            userIds.includes(u.id) ? { ...u, status: 'suspended' as const } : u
          ));
          showSuccess(`${userIds.length} usuário(s) suspenso(s)`);
          break;
        case 'delete':
          if (window.confirm(`Confirma exclusão de ${userIds.length} usuário(s)?`)) {
            setUsers(prev => prev.filter(u => !userIds.includes(u.id)));
            showSuccess(`${userIds.length} usuário(s) excluído(s)`);
          }
          break;
        case 'export':
          showSuccess('Dados exportados com sucesso');
          break;
        default:
          showSuccess('Ação executada com sucesso');
      }
    } catch (error) {
      showError('Erro ao executar ação');
    } finally {
      setLoading(action, false);
      setSelectedUsers([]);
      setShowBulkActions(false);
    }
  }, [setLoading, showSuccess, showError]);
  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  }, []);
  const handleSelectAll = useCallback(() => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  }, [selectedUsers, filteredUsers]);
  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-orange-100 text-orange-800',
      banned: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  const getStatusIcon = (status: string) => {
    const icons = {
      active: CheckCircle2,
      inactive: XCircle,
      pending: Clock,
      suspended: AlertCircle,
      banned: Ban
    };
    return icons[status] || XCircle;
  };
  if (isLoading.users) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Carregando usuários...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 p-6">
      {/* Header Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Usuários Totais</p>
              <p className="text-3xl font-bold">{analytics?.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-blue-200 mt-1">
                +{analytics?.newUsersThisMonth} este mês
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.activeUsers.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {((analytics?.activeUsers || 0) / (analytics?.totalUsers || 1) * 100).toFixed(1)}%
              </p>
            </div>
            <Activity className="h-6 w-6 text-green-600" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Novos (30d)</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.newUsersThisMonth}</p>
              <p className="text-sm text-blue-600 mt-1">
                {analytics?.churnRate}% churn rate
              </p>
            </div>
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Engajamento Médio</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.averageEngagement}%</p>
              <p className="text-sm text-purple-600 mt-1">Score de atividade</p>
            </div>
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top Role</p>
              <p className="text-lg font-bold text-gray-900">
                {analytics?.topRoles[0]?.role}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {analytics?.topRoles[0]?.count} usuários
              </p>
            </div>
            <Crown className="h-6 w-6 text-yellow-600" />
          </div>
        </motion.div>
      </div>
      {/* Controles */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuários..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Roles</option>
              {userRoles.map(role => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos Status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="pending">Pendente</option>
              <option value="suspended">Suspenso</option>
              <option value="banned">Banido</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="created">Mais Recentes</option>
              <option value="name">Nome</option>
              <option value="email">E-mail</option>
              <option value="role">Role</option>
              <option value="lastLogin">Último Login</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-900">
                  {selectedUsers.length} selecionados
                </span>
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`p-2 rounded ${viewMode === 'analytics' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'}`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => handleUserAction('export', selectedUsers)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-2 border border-gray-300 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Novo Usuário</span>
            </button>
          </div>
        </div>
        {/* Bulk Actions */}
        <AnimatePresence>
          {showBulkActions && selectedUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg border-t border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleUserAction('activate', selectedUsers)}
                  className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Ativar</span>
                </button>
                <button
                  onClick={() => handleUserAction('suspend', selectedUsers)}
                  className="flex items-center space-x-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Ban className="h-4 w-4" />
                  <span>Suspender</span>
                </button>
                <button
                  onClick={() => handleUserAction('delete', selectedUsers)}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <UserMinus className="h-4 w-4" />
                  <span>Excluir</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Users Grid/List */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredUsers.map((user, index) => {
              const StatusIcon = getStatusIcon(user.status);
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden hover:shadow-md transition-all cursor-pointer ${
                    selectedUsers.includes(user.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleSelectUser(user.id)}
                >
                  {/* User Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${user.role.color} rounded-full border-2 border-white`}></div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(user.status)}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{user.status}</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    {/* Role & Company */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Role:</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 ${user.role.color} rounded-full`}></div>
                          <span className="text-sm font-medium">{user.role.name}</span>
                        </div>
                      </div>
                      {user.profile.company && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Empresa:</span>
                          <span className="text-sm">{user.profile.company}</span>
                        </div>
                      )}
                      {user.profile.position && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Cargo:</span>
                          <span className="text-sm">{user.profile.position}</span>
                        </div>
                      )}
                    </div>
                    {/* Activity Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="font-semibold text-sm text-gray-900">{user.activity.loginCount}</div>
                        <div className="text-xs text-gray-600">Logins</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm text-gray-900">{user.activity.engagementScore}%</div>
                        <div className="text-xs text-gray-600">Engajamento</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm text-gray-900">
                          {Math.round(user.activity.timeSpent / 60)}h
                        </div>
                        <div className="text-xs text-gray-600">Tempo</div>
                      </div>
                    </div>
                    {/* Verification Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded ${user.emailVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          <Mail className="h-3 w-3" />
                        </div>
                        <div className={`p-1 rounded ${user.phoneVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          <Phone className="h-3 w-3" />
                        </div>
                        <div className={`p-1 rounded ${user.twoFactorEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          <Shield className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                    {/* Last Login */}
                    {user.lastLogin && (
                      <div className="text-xs text-gray-500">
                        Último login: {new Date(user.lastLogin).toLocaleString()}
                      </div>
                    )}
                    {/* Subscription */}
                    {user.subscription && (
                      <div className="mt-3 p-2 bg-blue-50 rounded border">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-blue-900">
                            Plano {user.subscription.plan}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            user.subscription.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {user.subscription.status}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(user);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit user
                          }}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserAction('delete', user.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
      {/* Select All Control */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
            onChange={handleSelectAll}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            Selecionar todos ({filteredUsers.length})
          </span>
        </label>
        {selectedUsers.length > 0 && (
          <span className="text-sm text-blue-600">
            {selectedUsers.length} de {filteredUsers.length} selecionados
          </span>
        )}
      </div>
      {/* Loading States */}
      {Object.entries(isLoading).some(([key, loading]) => loading && key !== 'users') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Processando...</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdvancedUserManagementDashboard;
