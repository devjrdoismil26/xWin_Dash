import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, BellOff, X, Check, AlertCircle, Info, CheckCircle, XCircle,
  Settings, Filter, Search, Trash2, Archive, Star, Clock, User,
  Mail, MessageSquare, Zap, TrendingUp, Package, Calendar, Globe,
  Shield, CreditCard, Users, BarChart3, Heart, Share2, Download,
  Play, Pause, Volume2, VolumeX, Eye, EyeOff, MoreHorizontal,
  Pin, PinOff, Reply, Forward, ExternalLink, Copy, Bookmark
} from 'lucide-react';

// Interfaces
interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'system' | 'social' | 'marketing' | 'sales';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  pinned: boolean;
  starred: boolean;
  archived: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  avatar?: string;
  thumbnail?: string;
  url?: string;
  dismissible: boolean;
  autoRemove?: boolean;
  duration?: number;
}

interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  action: () => void;
  icon?: React.ComponentType<any>;
}

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  email: boolean;
  categories: Record<string, boolean>;
  quiet: {
    enabled: boolean;
    start: string;
    end: string;
  };
  filters: {
    priority: string[];
    types: string[];
    sources: string[];
  };
}

interface NotificationContextType {
  notifications: NotificationItem[];
  settings: NotificationSettings;
  unreadCount: number;
  isOpen: boolean;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  togglePin: (id: string) => void;
  toggleStar: (id: string) => void;
  archiveNotification: (id: string) => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  openCenter: () => void;
  closeCenter: () => void;
  clearAll: () => void;
  clearRead: () => void;
}

// Context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider
export const AdvancedNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
    categories: {
      system: true,
      social: true,
      marketing: true,
      sales: true,
      security: true
    },
    quiet: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    filters: {
      priority: ['low', 'medium', 'high', 'urgent'],
      types: ['success', 'error', 'warning', 'info', 'system', 'social', 'marketing', 'sales'],
      sources: []
    }
  });
  
  const [isOpen, setIsOpen] = useState(false);

  // Notificações iniciais simuladas
  useEffect(() => {
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        type: 'success',
        title: 'Campaign Launched Successfully',
        message: 'Your email campaign "Summer Sale 2024" has been launched and is now active.',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
        read: false,
        pinned: true,
        starred: false,
        archived: false,
        category: 'Marketing',
        priority: 'high',
        source: 'Email Marketing',
        dismissible: true,
        autoRemove: false,
        actions: [
          {
            id: 'view',
            label: 'View Campaign',
            type: 'primary',
            action: () => console.log('View campaign'),
            icon: Eye
          }
        ],
        avatar: '/avatars/marketing.jpg'
      },
      {
        id: '2',
        type: 'info',
        title: 'New Lead Captured',
        message: 'A new high-quality lead "João Silva" has been captured from your landing page.',
        timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
        read: false,
        pinned: false,
        starred: true,
        archived: false,
        category: 'Sales',
        priority: 'medium',
        source: 'Lead Capture',
        dismissible: true,
        autoRemove: false,
        actions: [
          {
            id: 'contact',
            label: 'Contact Lead',
            type: 'primary',
            action: () => console.log('Contact lead'),
            icon: MessageSquare
          },
          {
            id: 'assign',
            label: 'Assign to Rep',
            type: 'secondary',
            action: () => console.log('Assign lead'),
            icon: User
          }
        ],
        metadata: {
          leadId: 'lead123',
          score: 85,
          source: 'landing-page'
        }
      },
      {
        id: '3',
        type: 'warning',
        title: 'Workflow Error',
        message: 'The "Lead Nurturing" workflow has encountered an error and needs attention.',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        read: false,
        pinned: false,
        starred: false,
        archived: false,
        category: 'System',
        priority: 'urgent',
        source: 'Workflow Engine',
        dismissible: true,
        autoRemove: false,
        actions: [
          {
            id: 'fix',
            label: 'Fix Workflow',
            type: 'danger',
            action: () => console.log('Fix workflow'),
            icon: Settings
          }
        ]
      },
      {
        id: '4',
        type: 'system',
        title: 'System Update Available',
        message: 'A new system update (v2.1.0) is available with new features and bug fixes.',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: true,
        pinned: false,
        starred: false,
        archived: false,
        category: 'System',
        priority: 'low',
        source: 'System',
        dismissible: true,
        autoRemove: false,
        actions: [
          {
            id: 'update',
            label: 'Update Now',
            type: 'primary',
            action: () => console.log('Update system'),
            icon: Download
          },
          {
            id: 'later',
            label: 'Remind Later',
            type: 'secondary',
            action: () => console.log('Remind later'),
            icon: Clock
          }
        ]
      },
      {
        id: '5',
        type: 'social',
        title: 'High Engagement Post',
        message: 'Your Instagram post is getting high engagement: 245 likes, 32 comments in the last hour.',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        read: true,
        pinned: false,
        starred: false,
        archived: false,
        category: 'Social Media',
        priority: 'medium',
        source: 'Social Buffer',
        dismissible: true,
        autoRemove: false,
        thumbnail: '/social/post-thumbnail.jpg'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  // Contadores
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read && !n.archived).length
  , [notifications]);

  // Adicionar notificação
  const addNotification = useCallback((notificationData: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const notification: NotificationItem = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [notification, ...prev]);

    // Som de notificação
    if (settings.enabled && settings.sound && !isQuietTime()) {
      playNotificationSound(notification.type);
    }

    // Notificação do desktop
    if (settings.enabled && settings.desktop && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }

    // Auto remove
    if (notification.autoRemove && notification.duration) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
    }
  }, [settings]);

  // Verificar horário silencioso
  const isQuietTime = useCallback(() => {
    if (!settings.quiet.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = settings.quiet.start.split(':').map(Number);
    const [endHour, endMin] = settings.quiet.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  }, [settings.quiet]);

  // Sons de notificação
  const playNotificationSound = useCallback((type: NotificationItem['type']) => {
    const audio = new Audio();
    switch (type) {
      case 'success':
        audio.src = '/sounds/success.mp3';
        break;
      case 'error':
        audio.src = '/sounds/error.mp3';
        break;
      case 'warning':
        audio.src = '/sounds/warning.mp3';
        break;
      default:
        audio.src = '/sounds/notification.mp3';
    }
    audio.play().catch(() => {}); // Ignore errors
  }, []);

  // Handlers
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, pinned: !n.pinned } : n
    ));
  }, []);

  const toggleStar = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, starred: !n.starred } : n
    ));
  }, []);

  const archiveNotification = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, archived: !n.archived } : n
    ));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const openCenter = useCallback(() => setIsOpen(true), []);
  const closeCenter = useCallback(() => setIsOpen(false), []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearRead = useCallback(() => {
    setNotifications(prev => prev.filter(n => !n.read));
  }, []);

  const value: NotificationContextType = {
    notifications,
    settings,
    unreadCount,
    isOpen,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    togglePin,
    toggleStar,
    archiveNotification,
    updateSettings,
    openCenter,
    closeCenter,
    clearAll,
    clearRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro do AdvancedNotificationProvider');
  }
  return context;
};

// Componente principal do centro de notificações
export const AdvancedNotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isOpen,
    openCenter,
    closeCenter,
    markAllAsRead,
    clearRead,
    settings,
    updateSettings
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned' | 'starred'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Filtrar notificações
  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter(n => !n.archived);

    // Aplicar filtro
    switch (filter) {
      case 'unread':
        filtered = filtered.filter(n => !n.read);
        break;
      case 'pinned':
        filtered = filtered.filter(n => n.pinned);
        break;
      case 'starred':
        filtered = filtered.filter(n => n.starred);
        break;
    }

    // Aplicar busca
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ordenar: pinned primeiro, depois por timestamp
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [notifications, filter, searchQuery]);

  return (
    <>
      {/* Botão de notificações */}
      <div className="relative">
        <button
          onClick={openCenter}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </button>
      </div>

      {/* Centro de Notificações */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end pt-16 pr-6 z-50"
            onClick={closeCenter}
          >
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-96 max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notificações
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={closeCenter}
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar notificações..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    {[
                      { key: 'all', label: 'Todas', count: notifications.filter(n => !n.archived).length },
                      { key: 'unread', label: 'Não lidas', count: unreadCount },
                      { key: 'pinned', label: 'Fixadas', count: notifications.filter(n => n.pinned && !n.archived).length },
                      { key: 'starred', label: 'Favoritas', count: notifications.filter(n => n.starred && !n.archived).length }
                    ].map(({ key, label, count }) => (
                      <button
                        key={key}
                        onClick={() => setFilter(key as any)}
                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                          filter === key
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {label} {count > 0 && `(${count})`}
                      </button>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          Marcar todas como lidas
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={clearRead}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Limpar lidas
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-gray-200 dark:border-gray-700 p-4 space-y-3 overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Notificações</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.enabled}
                          onChange={(e) => updateSettings({ enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Som</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.sound}
                          onChange={(e) => updateSettings({ sound: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Desktop</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.desktop}
                          onChange={(e) => updateSettings({ desktop: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto max-h-96">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchQuery ? 'Nenhuma notificação encontrada' : 'Nenhuma notificação'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <AnimatePresence>
                      {filteredNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <ToastContainer />
    </>
  );
};

// Componente de item de notificação
interface NotificationItemProps {
  notification: NotificationItem;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markAsRead, removeNotification, togglePin, toggleStar, archiveNotification } = useNotifications();
  const [showActions, setShowActions] = useState(false);

  const getTypeIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertCircle;
      case 'info': return Info;
      case 'system': return Settings;
      case 'social': return Share2;
      case 'marketing': return TrendingUp;
      case 'sales': return BarChart3;
      default: return Bell;
    }
  };

  const getTypeColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      case 'system': return 'text-gray-500';
      case 'social': return 'text-purple-500';
      case 'marketing': return 'text-pink-500';
      case 'sales': return 'text-indigo-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityColor = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const TypeIcon = getTypeIcon(notification.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${
        !notification.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
      }`}
      onClick={() => !notification.read && markAsRead(notification.id)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar/Icon */}
        <div className="flex-shrink-0">
          {notification.avatar ? (
            <img
              src={notification.avatar}
              alt=""
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${getTypeColor(notification.type)}`}>
              <TypeIcon className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <p className={`text-sm font-medium text-gray-900 dark:text-white ${!notification.read ? 'font-semibold' : ''}`}>
                  {notification.title}
                </p>
                {notification.pinned && <Pin className="h-3 w-3 text-gray-400" />}
                {notification.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                {notification.message}
              </p>

              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{notification.source}</span>
                <span>•</span>
                <span>{formatTime(notification.timestamp)}</span>
                <span>•</span>
                <span className={`px-1.5 py-0.5 rounded ${
                  notification.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                  notification.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                  notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                }`}>
                  {notification.priority}
                </span>
              </div>

              {/* Actions */}
              {notification.actions && notification.actions.length > 0 && (
                <div className="flex items-center space-x-2 mt-3">
                  {notification.actions.map((action) => {
                    const ActionIcon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.action();
                        }}
                        className={`flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                          action.type === 'primary' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400' :
                          action.type === 'danger' ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400' :
                          'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {ActionIcon && <ActionIcon className="h-3 w-3" />}
                        <span>{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center space-x-1 ml-2"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(notification.id);
                    }}
                    className="p-1 text-gray-400 hover:text-yellow-500 rounded transition-colors"
                  >
                    <Star className={`h-3 w-3 ${notification.starred ? 'fill-current text-yellow-500' : ''}`} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(notification.id);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-500 rounded transition-colors"
                  >
                    {notification.pinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      archiveNotification(notification.id);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  >
                    <Archive className="h-3 w-3" />
                  </button>
                  
                  {notification.dismissible && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Container de Toast Notifications
const ToastContainer: React.FC = () => {
  const { notifications } = useNotifications();
  
  // Mostrar apenas notificações recentes que devem aparecer como toast
  const toastNotifications = notifications
    .filter(n => {
      const isRecent = Date.now() - new Date(n.timestamp).getTime() < 5000; // 5 segundos
      return isRecent && !n.read;
    })
    .slice(0, 3); // Máximo 3 toasts

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toastNotifications.map((notification) => (
          <ToastNotification key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast Notification individual
interface ToastNotificationProps {
  notification: NotificationItem;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ notification }) => {
  const { markAsRead, removeNotification } = useNotifications();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => markAsRead(notification.id), 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification.id, markAsRead]);

  if (!isVisible) return null;

  const getTypeIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'error': return XCircle;
      case 'warning': return AlertCircle;
      default: return Info;
    }
  };

  const getTypeColors = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const TypeIcon = getTypeIcon(notification.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`max-w-sm w-full border rounded-lg shadow-lg p-4 ${getTypeColors(notification.type)}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <TypeIcon className="h-5 w-5" />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium">
            {notification.title}
          </p>
          <p className="mt-1 text-sm opacity-90">
            {notification.message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => removeNotification(notification.id)}
            className="inline-flex text-current hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdvancedNotificationCenter;
