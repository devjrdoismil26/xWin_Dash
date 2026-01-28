import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
import { 
  Globe, 
  Zap, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  Copy,
  Download,
  Upload,
  Link,
  Unlink,
  Activity,
  BarChart3,
  Clock,
  Shield,
  Key,
  Database,
  Cloud,
  Server,
  Smartphone,
  Monitor,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  Image,
  Video,
  Music,
  Map,
  CreditCard,
  ShoppingCart,
  Users,
  Building,
  Star,
  Heart,
  ThumbsUp,
  Share2,
  Lock,
  Unlock
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from "@/components/ui/Card";
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import Modal from '@/components/ui/Modal';
import Tabs from '@/components/ui/Tabs';

interface Connector {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'database' | 'file' | 'social' | 'payment' | 'communication' | 'productivity';
  description: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  category: string;
  icon: string;
  color: string;
  isActive: boolean;
  isPremium: boolean;
  configuration: {
    endpoint?: string;
    apiKey?: string;
    secret?: string;
    webhook?: string;
    database?: string;
    table?: string;
    fields?: string[];
    filters?: Record<string, any>;
    syncFrequency?: string;
    lastSync?: string;
    nextSync?: string;
  };
  metrics: {
    requests: number;
    successRate: number;
    avgResponseTime: number;
    lastActivity: string;
    dataTransferred: number;
  };
  capabilities: string[];
  documentation: string;
  support: string[];
}

interface UniversalConnectorsProps {
  onConnectorAction?: (connectorId: string, action: string) => void;
  onConfigureConnector?: (connector: Connector) => void;
}

const UniversalConnectors: React.FC<UniversalConnectorsProps> = ({
  onConnectorAction,
  onConfigureConnector
}) => {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for connectors
  const mockConnectors: Connector[] = useMemo(() => [
    {
      id: 'shopify-api',
      name: 'Shopify API',
      type: 'api',
      description: 'Connect to Shopify stores for product and order management',
      status: 'connected',
      category: 'E-commerce',
      icon: 'ShoppingCart',
      color: 'green',
      isActive: true,
      isPremium: false,
      configuration: {
        endpoint: 'https://your-store.myshopify.com/admin/api/2023-10',
        apiKey: 'shpat_***',
        syncFrequency: '15min',
        lastSync: '2024-01-20T11:30:00Z',
        nextSync: '2024-01-20T11:45:00Z'
      },
      metrics: {
        requests: 15420,
        successRate: 99.2,
        avgResponseTime: 245,
        lastActivity: '2024-01-20T11:30:00Z',
        dataTransferred: 2.4
      },
      capabilities: ['Products', 'Orders', 'Customers', 'Inventory', 'Analytics'],
      documentation: 'https://shopify.dev/api',
      support: ['Email', 'Chat', 'Phone']
    },
    {
      id: 'hubspot-crm',
      name: 'HubSpot CRM',
      type: 'api',
      description: 'Integrate with HubSpot for lead and contact management',
      status: 'connected',
      category: 'CRM',
      icon: 'Users',
      color: 'orange',
      isActive: true,
      isPremium: true,
      configuration: {
        endpoint: 'https://api.hubapi.com',
        apiKey: 'pat-***',
        syncFrequency: '30min',
        lastSync: '2024-01-20T11:15:00Z',
        nextSync: '2024-01-20T11:45:00Z'
      },
      metrics: {
        requests: 8930,
        successRate: 98.7,
        avgResponseTime: 189,
        lastActivity: '2024-01-20T11:15:00Z',
        dataTransferred: 1.8
      },
      capabilities: ['Contacts', 'Deals', 'Companies', 'Tickets', 'Workflows'],
      documentation: 'https://developers.hubspot.com',
      support: ['Email', 'Chat']
    },
    {
      id: 'slack-webhook',
      name: 'Slack Webhook',
      type: 'webhook',
      description: 'Send notifications and updates to Slack channels',
      status: 'connected',
      category: 'Communication',
      icon: 'MessageSquare',
      color: 'purple',
      isActive: true,
      isPremium: false,
      configuration: {
        webhook: 'https://hooks.slack.com/services/***',
        syncFrequency: 'realtime',
        lastSync: '2024-01-20T11:45:00Z',
        nextSync: '2024-01-20T11:45:00Z'
      },
      metrics: {
        requests: 5670,
        successRate: 99.8,
        avgResponseTime: 156,
        lastActivity: '2024-01-20T11:45:00Z',
        dataTransferred: 0.3
      },
      capabilities: ['Messages', 'Notifications', 'File Sharing', 'Bot Commands'],
      documentation: 'https://api.slack.com/webhooks',
      support: ['Email', 'Community']
    },
    {
      id: 'mysql-database',
      name: 'MySQL Database',
      type: 'database',
      description: 'Connect to MySQL database for data synchronization',
      status: 'connected',
      category: 'Database',
      icon: 'Database',
      color: 'blue',
      isActive: true,
      isPremium: false,
      configuration: {
        database: 'production_db',
        table: 'users',
        syncFrequency: '1hour',
        lastSync: '2024-01-20T11:00:00Z',
        nextSync: '2024-01-20T12:00:00Z'
      },
      metrics: {
        requests: 12300,
        successRate: 99.9,
        avgResponseTime: 89,
        lastActivity: '2024-01-20T11:00:00Z',
        dataTransferred: 5.2
      },
      capabilities: ['Read', 'Write', 'Sync', 'Backup', 'Analytics'],
      documentation: 'https://dev.mysql.com/doc',
      support: ['Email', 'Phone']
    },
    {
      id: 'stripe-payment',
      name: 'Stripe Payment',
      type: 'payment',
      description: 'Process payments and manage subscriptions',
      status: 'error',
      category: 'Payment',
      icon: 'CreditCard',
      color: 'indigo',
      isActive: false,
      isPremium: true,
      configuration: {
        endpoint: 'https://api.stripe.com/v1',
        apiKey: 'sk_test_***',
        syncFrequency: 'realtime',
        lastSync: '2024-01-20T10:30:00Z',
        nextSync: '2024-01-20T11:45:00Z'
      },
      metrics: {
        requests: 2340,
        successRate: 97.5,
        avgResponseTime: 312,
        lastActivity: '2024-01-20T10:30:00Z',
        dataTransferred: 0.8
      },
      capabilities: ['Payments', 'Subscriptions', 'Refunds', 'Invoicing', 'Reporting'],
      documentation: 'https://stripe.com/docs/api',
      support: ['Email', 'Chat', 'Phone']
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      type: 'api',
      description: 'Sync events and manage calendar schedules',
      status: 'pending',
      category: 'Productivity',
      icon: 'Calendar',
      color: 'red',
      isActive: false,
      isPremium: false,
      configuration: {
        endpoint: 'https://www.googleapis.com/calendar/v3',
        apiKey: 'AIza***',
        syncFrequency: '1hour',
        lastSync: null,
        nextSync: '2024-01-20T12:00:00Z'
      },
      metrics: {
        requests: 0,
        successRate: 0,
        avgResponseTime: 0,
        lastActivity: null,
        dataTransferred: 0
      },
      capabilities: ['Events', 'Calendars', 'Reminders', 'Sharing', 'Sync'],
      documentation: 'https://developers.google.com/calendar',
      support: ['Email', 'Community']
    }
  ], []);

  const categories = useMemo(() => [
    { value: 'all', label: 'All Categories' },
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'CRM', label: 'CRM' },
    { value: 'Communication', label: 'Communication' },
    { value: 'Database', label: 'Database' },
    { value: 'Payment', label: 'Payment' },
    { value: 'Productivity', label: 'Productivity' },
    { value: 'Social', label: 'Social Media' },
    { value: 'Analytics', label: 'Analytics' }
  ], []);

  // Load connectors
  useEffect(() => {
    const loadConnectors = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConnectors(mockConnectors);
      setIsLoading(false);
    };

    loadConnectors();
  }, [mockConnectors]);

  // Filter connectors
  const filteredConnectors = useMemo(() => {
    return connectors.filter(connector => {
      const matchesSearch = connector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           connector.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || connector.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [connectors, searchTerm, selectedCategory]);

  const handleConnectorAction = useCallback((connectorId: string, action: string) => {
    setConnectors(prev => prev.map(connector => {
      if (connector.id === connectorId) {
        switch (action) {
          case 'connect':
            return { ...connector, status: 'connected', isActive: true };
          case 'disconnect':
            return { ...connector, status: 'disconnected', isActive: false };
          case 'restart':
            return { ...connector, status: 'connected', isActive: true };
          default:
            return connector;
        }
      }
      return connector;
    }));

    if (onConnectorAction) {
      onConnectorAction(connectorId, action);
    }
  }, [onConnectorAction]);

  const handleConfigureConnector = useCallback((connector: Connector) => {
    setSelectedConnector(connector);
    setIsConfigOpen(true);
    if (onConfigureConnector) {
      onConfigureConnector(connector);
    }
  }, [onConfigureConnector]);

  const getConnectorIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      ShoppingCart: <ShoppingCart className="w-6 h-6" />,
      Users: <Users className="w-6 h-6" />,
      MessageSquare: <MessageSquare className="w-6 h-6" />,
      Database: <Database className="w-6 h-6" />,
      CreditCard: <CreditCard className="w-6 h-6" />,
      Calendar: <Calendar className="w-6 h-6" />,
      Mail: <Mail className="w-6 h-6" />,
      BarChart3: <BarChart3 className="w-6 h-6" />,
      Globe: <Globe className="w-6 h-6" />
    };
    return iconMap[iconName] || <Globe className="w-6 h-6" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'disconnected': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <XCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const renderConnectorCard = useCallback((connector: Connector) => (
    <motion.div
      key={connector.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={ENHANCED_TRANSITIONS.spring}
      className="group"
    >
      <Card className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300">
        <Card.Header className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-${connector.color}-500/20`}>
                {getConnectorIcon(connector.icon)}
              </div>
              <div>
                <Card.Title className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {connector.name}
                </Card.Title>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {connector.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connector.isPremium && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
              <Badge className={getStatusColor(connector.status)}>
                {getStatusIcon(connector.status)}
                <span className="ml-1">{connector.status}</span>
              </Badge>
            </div>
          </div>
        </Card.Header>

        <Card.Content className="pt-0">
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {connector.metrics.requests.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Requests
              </div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {connector.metrics.successRate}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Success Rate
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Capabilities
            </h4>
            <div className="flex flex-wrap gap-1">
              {connector.capabilities.slice(0, 3).map((capability) => (
                <Badge key={capability} variant="secondary" className="text-xs">
                  {capability}
                </Badge>
              ))}
              {connector.capabilities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{connector.capabilities.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Last Activity */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>
                Last sync: {connector.metrics.lastActivity ? 
                  new Date(connector.metrics.lastActivity).toLocaleString() : 
                  'Never'
                }
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
              onClick={() => handleConfigureConnector(connector)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => handleConnectorAction(connector.id, connector.isActive ? 'disconnect' : 'connect')}
            >
              {connector.isActive ? (
                <>
                  <Unlink className="w-4 h-4 mr-2" />
                  Disconnect
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  ), [handleConnectorAction, handleConfigureConnector]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Universal Connectors
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Connect and manage integrations with external services
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Connector
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search connectors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="backdrop-blur-sm bg-white/10 border-white/20"
            startIcon={<Globe className="w-4 h-4" />}
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full sm:w-48"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {connectors.filter(c => c.status === 'connected').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Connected
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {connectors.filter(c => c.status === 'error').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Errors
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {connectors.reduce((sum, c) => sum + c.metrics.requests, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Requests
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Star className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {connectors.filter(c => c.isPremium).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Premium
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConnectors.map(renderConnectorCard)}
      </div>

      {/* Configuration Modal */}
      <Modal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        title={`Configure ${selectedConnector?.name}`}
        size="lg"
      >
        {selectedConnector && (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'configuration'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('configuration')}
                >
                  Configuration
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'metrics'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('metrics')}
                >
                  Metrics
                </button>
              </div>

              <div className="mt-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {selectedConnector.metrics.requests.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Total Requests
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {selectedConnector.metrics.successRate}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Success Rate
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Capabilities
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedConnector.capabilities.map((capability) => (
                          <div key={capability} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Zap className="w-3 h-3 text-green-500" />
                            {capability}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'configuration' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Connection Settings
                      </h4>
                      <div className="space-y-3">
                        {selectedConnector.configuration.endpoint && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Endpoint
                            </label>
                            <Input
                              value={selectedConnector.configuration.endpoint}
                              readOnly
                              className="backdrop-blur-sm bg-white/10 border-white/20"
                            />
                          </div>
                        )}
                        {selectedConnector.configuration.apiKey && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              API Key
                            </label>
                            <Input
                              value={selectedConnector.configuration.apiKey}
                              readOnly
                              type="password"
                              className="backdrop-blur-sm bg-white/10 border-white/20"
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Sync Frequency
                          </label>
                          <Select
                            value={selectedConnector.configuration.syncFrequency}
                            className="backdrop-blur-sm bg-white/10 border-white/20"
                          >
                            <option value="realtime">Real-time</option>
                            <option value="15min">Every 15 minutes</option>
                            <option value="30min">Every 30 minutes</option>
                            <option value="1hour">Every hour</option>
                            <option value="6hours">Every 6 hours</option>
                            <option value="24hours">Daily</option>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'metrics' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {selectedConnector.metrics.avgResponseTime}ms
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Avg Response Time
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {selectedConnector.metrics.dataTransferred}GB
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Data Transferred
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Activity Timeline
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Last Sync
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedConnector.metrics.lastActivity ? 
                              new Date(selectedConnector.metrics.lastActivity).toLocaleString() : 
                              'Never'
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Next Sync
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedConnector.configuration.nextSync ? 
                              new Date(selectedConnector.configuration.nextSync).toLocaleString() : 
                              'Not scheduled'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setIsConfigOpen(false)}
                className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handleConnectorAction(selectedConnector.id, 'restart');
                  setIsConfigOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Apply Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Connector Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Connector"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-center py-8">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Connector Builder Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We&apos;re building a powerful connector builder that will allow you to create custom integrations with any API or service.
            </p>
            <Button
              onClick={() => setIsCreateOpen(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UniversalConnectors;
