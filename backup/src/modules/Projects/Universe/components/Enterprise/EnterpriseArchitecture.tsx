import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from '@/components/ui/design-tokens';
import { 
  Building, 
  Users, 
  Shield, 
  Globe, 
  Server, 
  Database, 
  Lock, 
  Key,
  Eye,
  EyeOff,
  Settings,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Cpu,
  Memory,
  HardDrive,
  Network,
  Cloud,
  Smartphone,
  Monitor,
  Laptop,
  Tablet,
  Wifi,
  WifiOff,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Star,
  Crown,
  Award,
  Target,
  TrendingUp,
  DollarSign,
  FileText,
  Mail,
  MessageSquare,
  Calendar,
  Map,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card } from "@/components/ui/Card";
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import Modal from '@/components/ui/Modal';
import Tabs from '@/components/ui/Tabs';
import Progress from '@/components/ui/Progress';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  plan: 'basic' | 'professional' | 'enterprise' | 'custom';
  users: number;
  maxUsers: number;
  storage: number;
  maxStorage: number;
  createdAt: string;
  lastActivity: string;
  features: string[];
  compliance: string[];
  security: {
    sso: boolean;
    mfa: boolean;
    encryption: boolean;
    auditLogs: boolean;
    dataResidency: string;
  };
  metrics: {
    apiCalls: number;
    dataTransfer: number;
    uptime: number;
    responseTime: number;
  };
}

interface EnterpriseArchitectureProps {
  onTenantAction?: (tenantId: string, action: string) => void;
  onConfigureTenant?: (tenant: Tenant) => void;
}

const EnterpriseArchitecture: React.FC<EnterpriseArchitectureProps> = ({
  onTenantAction,
  onConfigureTenant
}) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for tenants
  const mockTenants: Tenant[] = useMemo(() => [
    {
      id: 'tenant-1',
      name: 'Acme Corporation',
      domain: 'acme.xwindash.com',
      status: 'active',
      plan: 'enterprise',
      users: 245,
      maxUsers: 500,
      storage: 125.6,
      maxStorage: 1000,
      createdAt: '2023-06-15T00:00:00Z',
      lastActivity: '2024-01-20T11:45:00Z',
      features: ['SSO', 'MFA', 'Audit Logs', 'Data Residency', 'Custom Branding', 'API Access'],
      compliance: ['SOC2', 'GDPR', 'HIPAA', 'ISO27001'],
      security: {
        sso: true,
        mfa: true,
        encryption: true,
        auditLogs: true,
        dataResidency: 'EU'
      },
      metrics: {
        apiCalls: 125000,
        dataTransfer: 2.4,
        uptime: 99.9,
        responseTime: 89
      }
    },
    {
      id: 'tenant-2',
      name: 'TechStart Inc',
      domain: 'techstart.xwindash.com',
      status: 'active',
      plan: 'professional',
      users: 89,
      maxUsers: 100,
      storage: 45.2,
      maxStorage: 100,
      createdAt: '2023-08-22T00:00:00Z',
      lastActivity: '2024-01-20T10:30:00Z',
      features: ['SSO', 'MFA', 'Audit Logs', 'API Access'],
      compliance: ['SOC2', 'GDPR'],
      security: {
        sso: true,
        mfa: true,
        encryption: true,
        auditLogs: true,
        dataResidency: 'US'
      },
      metrics: {
        apiCalls: 45600,
        dataTransfer: 0.8,
        uptime: 99.7,
        responseTime: 125
      }
    },
    {
      id: 'tenant-3',
      name: 'Global Solutions Ltd',
      domain: 'global.xwindash.com',
      status: 'active',
      plan: 'enterprise',
      users: 1200,
      maxUsers: 2000,
      storage: 567.8,
      maxStorage: 5000,
      createdAt: '2023-03-10T00:00:00Z',
      lastActivity: '2024-01-20T11:59:00Z',
      features: ['SSO', 'MFA', 'Audit Logs', 'Data Residency', 'Custom Branding', 'API Access', 'White Label'],
      compliance: ['SOC2', 'GDPR', 'HIPAA', 'ISO27001', 'PCI-DSS'],
      security: {
        sso: true,
        mfa: true,
        encryption: true,
        auditLogs: true,
        dataResidency: 'Global'
      },
      metrics: {
        apiCalls: 890000,
        dataTransfer: 15.6,
        uptime: 99.95,
        responseTime: 67
      }
    },
    {
      id: 'tenant-4',
      name: 'StartupXYZ',
      domain: 'startupxyz.xwindash.com',
      status: 'pending',
      plan: 'basic',
      users: 12,
      maxUsers: 25,
      storage: 2.1,
      maxStorage: 10,
      createdAt: '2024-01-18T00:00:00Z',
      lastActivity: '2024-01-19T16:20:00Z',
      features: ['MFA', 'API Access'],
      compliance: ['GDPR'],
      security: {
        sso: false,
        mfa: true,
        encryption: true,
        auditLogs: false,
        dataResidency: 'US'
      },
      metrics: {
        apiCalls: 1200,
        dataTransfer: 0.05,
        uptime: 98.5,
        responseTime: 200
      }
    },
    {
      id: 'tenant-5',
      name: 'Enterprise Corp',
      domain: 'enterprise.xwindash.com',
      status: 'suspended',
      plan: 'enterprise',
      users: 0,
      maxUsers: 1000,
      storage: 0,
      maxStorage: 2000,
      createdAt: '2023-11-05T00:00:00Z',
      lastActivity: '2024-01-15T09:10:00Z',
      features: ['SSO', 'MFA', 'Audit Logs', 'Data Residency', 'Custom Branding', 'API Access'],
      compliance: ['SOC2', 'GDPR', 'HIPAA'],
      security: {
        sso: true,
        mfa: true,
        encryption: true,
        auditLogs: true,
        dataResidency: 'EU'
      },
      metrics: {
        apiCalls: 0,
        dataTransfer: 0,
        uptime: 0,
        responseTime: 0
      }
    }
  ], []);

  const plans = useMemo(() => [
    { value: 'all', label: 'All Plans' },
    { value: 'basic', label: 'Basic' },
    { value: 'professional', label: 'Professional' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'custom', label: 'Custom' }
  ], []);

  // Load tenants
  useEffect(() => {
    const loadTenants = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTenants(mockTenants);
      setIsLoading(false);
    };

    loadTenants();
  }, [mockTenants]);

  // Filter tenants
  const filteredTenants = useMemo(() => {
    return tenants.filter(tenant => {
      const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tenant.domain.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlan = selectedPlan === 'all' || tenant.plan === selectedPlan;
      return matchesSearch && matchesPlan;
    });
  }, [tenants, searchTerm, selectedPlan]);

  const handleTenantAction = useCallback((tenantId: string, action: string) => {
    setTenants(prev => prev.map(tenant => {
      if (tenant.id === tenantId) {
        switch (action) {
          case 'activate':
            return { ...tenant, status: 'active' };
          case 'suspend':
            return { ...tenant, status: 'suspended' };
          case 'delete':
            return { ...tenant, status: 'inactive' };
          default:
            return tenant;
        }
      }
      return tenant;
    }));

    if (onTenantAction) {
      onTenantAction(tenantId, action);
    }
  }, [onTenantAction]);

  const handleConfigureTenant = useCallback((tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsConfigOpen(true);
    if (onConfigureTenant) {
      onConfigureTenant(tenant);
    }
  }, [onConfigureTenant]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'professional': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'enterprise': return 'bg-gold-500/20 text-gold-400 border-gold-500/30';
      case 'custom': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const renderTenantCard = useCallback((tenant: Tenant) => (
    <motion.div
      key={tenant.id}
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
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <Card.Title className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tenant.name}
                </Card.Title>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tenant.domain}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getPlanColor(tenant.plan)}>
                <Crown className="w-3 h-3 mr-1" />
                {tenant.plan}
              </Badge>
              <Badge className={getStatusColor(tenant.status)}>
                {getStatusIcon(tenant.status)}
                <span className="ml-1">{tenant.status}</span>
              </Badge>
            </div>
          </div>
        </Card.Header>

        <Card.Content className="pt-0">
          {/* Usage Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {tenant.users}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Users ({tenant.maxUsers} max)
              </div>
              <Progress value={(tenant.users / tenant.maxUsers) * 100} className="h-1 mt-2" />
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {tenant.storage.toFixed(1)}GB
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Storage ({tenant.maxStorage}GB max)
              </div>
              <Progress value={(tenant.storage / tenant.maxStorage) * 100} className="h-1 mt-2" />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {tenant.metrics.uptime}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Uptime
              </div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {tenant.metrics.responseTime}ms
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Response Time
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Security Features
            </h4>
            <div className="flex flex-wrap gap-1">
              {tenant.security.sso && <Badge variant="secondary" className="text-xs">SSO</Badge>}
              {tenant.security.mfa && <Badge variant="secondary" className="text-xs">MFA</Badge>}
              {tenant.security.encryption && <Badge variant="secondary" className="text-xs">Encryption</Badge>}
              {tenant.security.auditLogs && <Badge variant="secondary" className="text-xs">Audit Logs</Badge>}
            </div>
          </div>

          {/* Compliance */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Compliance
            </h4>
            <div className="flex flex-wrap gap-1">
              {tenant.compliance.slice(0, 3).map((cert) => (
                <Badge key={cert} variant="secondary" className="text-xs">
                  {cert}
                </Badge>
              ))}
              {tenant.compliance.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{tenant.compliance.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Last Activity */}
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>
                Last activity: {new Date(tenant.lastActivity).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
              onClick={() => handleConfigureTenant(tenant)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => handleTenantAction(tenant.id, tenant.status === 'active' ? 'suspend' : 'activate')}
            >
              {tenant.status === 'active' ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Suspend
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  ), [handleTenantAction, handleConfigureTenant]);

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
            Enterprise Architecture
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage multi-tenant architecture and enterprise features
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tenant
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tenants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="backdrop-blur-sm bg-white/10 border-white/20"
            startIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select
          value={selectedPlan}
          onValueChange={setSelectedPlan}
          className="w-full sm:w-48"
        >
          {plans.map((plan) => (
            <option key={plan.value} value={plan.value}>
              {plan.label}
            </option>
          ))}
        </Select>
      </div>

      {/* Enterprise Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Building className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {tenants.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Tenants
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {tenants.reduce((sum, t) => sum + t.users, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Users
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {tenants.filter(t => t.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Tenants
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Crown className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {tenants.filter(t => t.plan === 'enterprise').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Enterprise Plans
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map(renderTenantCard)}
      </div>

      {/* Configuration Modal */}
      <Modal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        title={`Configure ${selectedTenant?.name}`}
        size="lg"
      >
        {selectedTenant && (
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
                    activeTab === 'security'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('security')}
                >
                  Security
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
                          {selectedTenant.users}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Active Users
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {selectedTenant.storage.toFixed(1)}GB
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Storage Used
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Features
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTenant.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-gray-900 dark:text-white">SSO</span>
                        </div>
                        <Badge className={selectedTenant.security.sso ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                          {selectedTenant.security.sso ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Key className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-gray-900 dark:text-white">MFA</span>
                        </div>
                        <Badge className={selectedTenant.security.mfa ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                          {selectedTenant.security.mfa ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-purple-500" />
                          <span className="font-medium text-gray-900 dark:text-white">Encryption</span>
                        </div>
                        <Badge className={selectedTenant.security.encryption ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                          {selectedTenant.security.encryption ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-orange-500" />
                          <span className="font-medium text-gray-900 dark:text-white">Audit Logs</span>
                        </div>
                        <Badge className={selectedTenant.security.auditLogs ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                          {selectedTenant.security.auditLogs ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Compliance Certifications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTenant.compliance.map((cert) => (
                          <Badge key={cert} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Data Residency
                      </h4>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Globe className="w-3 h-3 mr-1" />
                        {selectedTenant.security.dataResidency}
                      </Badge>
                    </div>
                  </div>
                )}

                {activeTab === 'metrics' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {selectedTenant.metrics.apiCalls.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          API Calls (30 days)
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {selectedTenant.metrics.dataTransfer}GB
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Data Transfer
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {selectedTenant.metrics.uptime}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Uptime
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {selectedTenant.metrics.responseTime}ms
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Avg Response Time
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
                  handleTenantAction(selectedTenant.id, 'restart');
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

      {/* Create Tenant Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Tenant"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-center py-8">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tenant Provisioning Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We&apos;re building an automated tenant provisioning system that will allow you to create and configure new tenants with enterprise-grade security and compliance features.
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

export default EnterpriseArchitecture;
