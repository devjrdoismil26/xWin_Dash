import { Card } from "@/components/ui/Card";
/**
 * Intelligent Notifications - Sistema de Notificações Inteligente
 * Sistema avançado de notificações com IA, priorização e personalização
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellRing,
  BellOff,
  Settings,
  Filter,
  Search,
  Check,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  Zap,
  Brain,
  Users,
  Mail,
  MessageSquare,
  Calendar,
  Target,
  TrendingUp,
  Clock,
  Eye,
  EyeOff,
  Archive,
  Trash2,
  Star,
  StarOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import Input from './Input';
import Select from './Select';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from './design-tokens';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'action';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'system' | 'user' | 'automation' | 'analytics' | 'security';
  source: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
  starred: boolean;
  actionable: boolean;
  actionLabel?: string;
  onAction?: () => void;
  metadata?: {
    userId?: string;
    moduleId?: string;
    automationId?: string;
    [key: string]: any;
  };
  expiresAt?: string;
  tags?: string[];
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
  push: boolean;
  categories: {
    system: boolean;
    user: boolean;
    automation: boolean;
    analytics: boolean;
    security: boolean;
  };
  priorities: {
    low: boolean;
    medium: boolean;
    high: boolean;
    critical: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  digest: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly';
    time: string;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  today: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  responseRate: number;
  avgResponseTime: number;
}

export interface IntelligentNotificationsProps {
  notifications?: Notification[];
  settings?: NotificationSettings;
  stats?: NotificationStats;
  loading?: boolean;
  error?: string;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onStar?: (id: string) => void;
  onUnstar?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAction?: (id: string) => void;
  onUpdateSettings?: (settings: Partial<NotificationSettings>) => void;
  onRefresh?: () => void;
  className?: string;
}

const IntelligentNotifications: React.FC<IntelligentNotificationsProps> = ({
  notifications = [],
  settings,
  stats,
  loading = false,
  error,
  onMarkAsRead,
  onMarkAllAsRead,
  onArchive,
  onUnarchive,
  onStar,
  onUnstar,
  onDelete,
  onAction,
  onUpdateSettings,
  onRefresh,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Memoized filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesTab = 
        (activeTab === 'all' && !notification.archived) ||
        (activeTab === 'unread' && !notification.read && !notification.archived) ||
        (activeTab === 'starred' && notification.starred && !notification.archived) ||
        (activeTab === 'archived' && notification.archived);
      
      const matchesSearch = 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.source.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || notification.type === typeFilter;
      const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
      
      return matchesTab && matchesSearch && matchesType && matchesPriority && matchesCategory;
    });
  }, [notifications, activeTab, searchTerm, typeFilter, priorityFilter, categoryFilter]);

  // Memoized stats calculations
  const notificationStats = useMemo(() => {
    if (!stats) {
      return {
        total: notifications.length,
        unread: notifications.filter(n => !n.read).length,
        today: notifications.filter(n => {
          const today = new Date().toDateString();
          return new Date(n.timestamp).toDateString() === today;
        }).length,
        byType: notifications.reduce((acc, n) => {
          acc[n.type] = (acc[n.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byPriority: notifications.reduce((acc, n) => {
          acc[n.priority] = (acc[n.priority] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byCategory: notifications.reduce((acc, n) => {
          acc[n.category] = (acc[n.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    }
    return stats;
  }, [notifications, stats]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'action': return <Zap className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system': return <Settings className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      case 'automation': return <Brain className="w-4 h-4" />;
      case 'analytics': return <TrendingUp className="w-4 h-4" />;
      case 'security': return <Target className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Agora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m atrás`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const isExpired = (notification: Notification) => {
    if (!notification.expiresAt) return false;
    return new Date(notification.expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 shadow-xl shadow-blue-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BellRing className="w-8 h-8 text-blue-600" />
              Notificações Inteligentes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Sistema avançado de notificações com IA e personalização
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className={ENHANCED_TRANSITIONS.button}
            >
              <TrendingUp className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className={ENHANCED_TRANSITIONS.button}
            >
              <Settings className="w-4 h-4" />
            </Button>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className={ENHANCED_TRANSITIONS.button}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
            {onMarkAllAsRead && notificationStats.unread > 0 && (
              <Button
                onClick={onMarkAllAsRead}
                className={ENHANCED_TRANSITIONS.button}
              >
                <Check className="w-4 h-4 mr-2" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {notificationStats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {notificationStats.unread}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Não lidas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {notificationStats.today}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hoje</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {notifications.filter(n => n.starred).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Favoritas</div>
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20">
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Estatísticas de Notificações
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Por Tipo</h4>
                  <div className="space-y-2">
                    {Object.entries(notificationStats.byType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {type}
                        </span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Por Prioridade</h4>
                  <div className="space-y-2">
                    {Object.entries(notificationStats.byPriority).map(([priority, count]) => (
                      <div key={priority} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {priority}
                        </span>
                        <Badge variant={getPriorityColor(priority)}>{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Por Categoria</h4>
                  <div className="space-y-2">
                    {Object.entries(notificationStats.byCategory).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {category}
                        </span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: 'all', label: 'Todas', count: notifications.filter(n => !n.archived).length },
          { id: 'unread', label: 'Não lidas', count: notifications.filter(n => !n.read && !n.archived).length },
          { id: 'starred', label: 'Favoritas', count: notifications.filter(n => n.starred && !n.archived).length },
          { id: 'archived', label: 'Arquivadas', count: notifications.filter(n => n.archived).length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <Badge variant="outline" className="text-xs">
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20">
        <Card.Content className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar notificações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <option value="all">Todos os tipos</option>
              <option value="info">Info</option>
              <option value="success">Sucesso</option>
              <option value="warning">Aviso</option>
              <option value="error">Erro</option>
              <option value="action">Ação</option>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <option value="all">Todas as prioridades</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <option value="all">Todas as categorias</option>
              <option value="system">Sistema</option>
              <option value="user">Usuário</option>
              <option value="automation">Automação</option>
              <option value="analytics">Analytics</option>
              <option value="security">Segurança</option>
            </Select>
          </div>
        </Card.Content>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 ${
                !notification.read ? 'ring-2 ring-blue-500/20' : ''
              } ${isExpired(notification) ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {notification.title}
                          </h3>
                          <Badge variant={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          {notification.starred && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        
                        <p className={`text-sm ${!notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(notification.category)}
                            <span className="capitalize">{notification.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                          <span>de {notification.source}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && onMarkAsRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onMarkAsRead(notification.id)}
                            className={ENHANCED_TRANSITIONS.button}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {notification.starred ? (
                          onUnstar && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onUnstar(notification.id)}
                              className={ENHANCED_TRANSITIONS.button}
                            >
                              <StarOff className="w-4 h-4" />
                            </Button>
                          )
                        ) : (
                          onStar && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onStar(notification.id)}
                              className={ENHANCED_TRANSITIONS.button}
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          )
                        )}
                        
                        {notification.archived ? (
                          onUnarchive && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onUnarchive(notification.id)}
                              className={ENHANCED_TRANSITIONS.button}
                            >
                              <Archive className="w-4 h-4" />
                            </Button>
                          )
                        ) : (
                          onArchive && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onArchive(notification.id)}
                              className={ENHANCED_TRANSITIONS.button}
                            >
                              <Archive className="w-4 h-4" />
                            </Button>
                          )
                        )}
                        
                        {onDelete && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDelete(notification.id)}
                            className={`text-red-600 hover:text-red-700 ${ENHANCED_TRANSITIONS.button}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {notification.actionable && notification.onAction && (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          onClick={() => onAction?.(notification.id)}
                          className={ENHANCED_TRANSITIONS.button}
                        >
                          {notification.actionLabel || 'Executar ação'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredNotifications.length === 0 && (
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20">
            <Card.Content className="p-12 text-center">
              <BellOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhuma notificação encontrada
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || typeFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Tente ajustar os filtros para ver mais notificações.'
                  : 'Você está em dia! Não há notificações no momento.'}
              </p>
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IntelligentNotifications;
