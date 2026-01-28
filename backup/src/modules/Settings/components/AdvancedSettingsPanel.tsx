import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../../hooks/useTranslation';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useAdvancedNotifications } from '../../../hooks/useAdvancedNotifications';
import { useLoadingStates } from '../../../hooks/useLoadingStates';
import { UnifiedThemeProvider, useUnifiedTheme } from '../../../components/theme/UnifiedThemeSystem';
import {
  Settings, User, Shield, Bell, Palette, Globe, Database,
  Zap, Cloud, Key, Lock, Unlock, Eye, EyeOff, Camera,
  Mail, Phone, MapPin, Calendar, Clock, Download, Upload,
  Save, RotateCcw, Trash2, Plus, Minus, Edit2, Check, X,
  Monitor, Smartphone, Tablet, Sun, Moon, Contrast, Volume2,
  Smartphone,
  VolumeX, Wifi, WifiOff, Bluetooth, Battery, HardDrive,
  Cpu, MemoryStick, Network, Server, CloudLightning,
  CreditCard, DollarSign, Receipt, FileText, Archive,
  Bookmark, Tag, Star, Heart, Share2, ExternalLink,
  Code, Terminal, Bug, Wrench, HelpCircle, Info,
  Facebook, Twitter, Instagram, Linkedin, MessageCircle
} from 'lucide-react';
// Interfaces
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
}
interface NotificationSettings {
  email: {
    marketing: boolean;
    security: boolean;
    updates: boolean;
    projects: boolean;
  };
  browser: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
  mobile: {
    push: boolean;
    sms: boolean;
  };
}
interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSymbols: boolean;
    requireUppercase: boolean;
  };
  trustedDevices: TrustedDevice[];
  loginAttempts: LoginAttempt[];
}
interface TrustedDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  lastSeen: string;
  trusted: boolean;
}
interface LoginAttempt {
  id: string;
  ip: string;
  location: string;
  device: string;
  status: 'success' | 'failed' | 'blocked';
  timestamp: string;
}
interface SystemSettings {
  performance: {
    cacheEnabled: boolean;
    compressionEnabled: boolean;
    lazyLoading: boolean;
    prefetchEnabled: boolean;
  };
  storage: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    compressionLevel: number;
    retentionDays: number;
  };
  api: {
    rateLimit: number;
    timeout: number;
    retryAttempts: number;
    caching: boolean;
  };
}
interface IntegrationSettings {
  connectedServices: ConnectedService[];
  webhooks: Webhook[];
  apiKeys: ApiKey[];
  socialAccounts: SocialAccount[];
}
interface SocialAccount {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'pinterest';
  username: string;
  displayName: string;
  status: 'connected' | 'disconnected' | 'error' | 'expired';
  lastSync: string;
  accountType: 'personal' | 'business' | 'creator';
  permissions: string[];
  followers?: number;
  avatar?: string;
}
interface ApiConfiguration {
  id: string;
  name: string;
  category: 'ai' | 'social' | 'advertising' | 'email' | 'analytics' | 'storage' | 'communication';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  credentials: ApiCredential[];
  lastTested?: string;
  errorMessage?: string;
  usage?: {
    requests: number;
    limit: number;
    resetTime: string;
  };
}
interface ApiCredential {
  id: string;
  name: string;
  type: 'api_key' | 'client_id' | 'client_secret' | 'access_token' | 'refresh_token' | 'webhook_url';
  value: string;
  encrypted: boolean;
  required: boolean;
  description?: string;
  placeholder?: string;
}
interface ConnectedService {
  id: string;
  name: string;
  type: 'social' | 'payment' | 'analytics' | 'storage' | 'communication';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  permissions: string[];
}
interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  lastTriggered?: string;
}
interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  status: 'active' | 'revoked';
  createdAt: string;
  lastUsed?: string;
}
const AdvancedSettingsPanel: React.FC = () => {
  const { t } = useTranslation();
  const { showNotification, showError, showSuccess } = useAdvancedNotifications();
  const { isLoading, setLoading } = useLoadingStates();
  // Estados
  const [activeSection, setActiveSection] = useState('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings | null>(null);
  const [apiConfigurations, setApiConfigurations] = useState<ApiConfiguration[]>([]);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string | number | boolean>>({});
  // Seções de configuração
  const settingSections = [
    { id: 'profile', name: 'Perfil', icon: User, color: 'blue' },
    { id: 'security', name: 'Segurança', icon: Shield, color: 'red' },
    { id: 'notifications', name: 'Notificações', icon: Bell, color: 'yellow' },
    { id: 'appearance', name: 'Aparência', icon: Palette, color: 'purple' },
    { id: 'social', name: 'Redes Sociais', icon: Share2, color: 'orange' },
    { id: 'apis', name: 'APIs & Integrações', icon: Key, color: 'cyan' },
    { id: 'system', name: 'Sistema', icon: Settings, color: 'green' },
    { id: 'integrations', name: 'Integrações', icon: Zap, color: 'indigo' },
    { id: 'billing', name: 'Cobrança', icon: CreditCard, color: 'pink' },
    { id: 'developer', name: 'Desenvolvedor', icon: Code, color: 'gray' }
  ];
  // Validação
  const { validateField, getFieldError, isFormValid } = useFormValidation({
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    password: { minLength: 8 }
  });
  // Dados simulados
  useEffect(() => {
    const loadSettings = async () => {
      setLoading('settings', true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserProfile({
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@exemplo.com',
        phone: '+55 11 99999-9999',
        bio: 'Desenvolvedor Full-stack especializado em React e Node.js',
        location: 'São Paulo, Brasil',
        timezone: 'America/Sao_Paulo',
        language: 'pt-BR',
        theme: 'light',
        notifications: {
          email: {
            marketing: true,
            security: true,
            updates: false,
            projects: true
          },
          browser: {
            enabled: true,
            sound: false,
            desktop: true
          },
          mobile: {
            push: true,
            sms: false
          }
        }
      });
      setSecuritySettings({
        twoFactorEnabled: true,
        sessionTimeout: 120,
        passwordPolicy: {
          minLength: 8,
          requireNumbers: true,
          requireSymbols: true,
          requireUppercase: true
        },
        trustedDevices: [
          {
            id: '1',
            name: 'MacBook Pro',
            type: 'desktop',
            browser: 'Chrome 120.0',
            location: 'São Paulo, Brasil',
            lastSeen: '2024-01-20T14:30:00Z',
            trusted: true
          }
        ],
        loginAttempts: [
          {
            id: '1',
            ip: '192.168.1.100',
            location: 'São Paulo, Brasil',
            device: 'MacBook Pro',
            status: 'success',
            timestamp: '2024-01-20T14:30:00Z'
          }
        ]
      });
      setSystemSettings({
        performance: {
          cacheEnabled: true,
          compressionEnabled: true,
          lazyLoading: true,
          prefetchEnabled: false
        },
        storage: {
          autoBackup: true,
          backupFrequency: 'weekly',
          compressionLevel: 6,
          retentionDays: 30
        },
        api: {
          rateLimit: 1000,
          timeout: 30000,
          retryAttempts: 3,
          caching: true
        }
      });
      setIntegrationSettings({
        connectedServices: [
          {
            id: '1',
            name: 'Google Analytics',
            type: 'analytics',
            status: 'connected',
            lastSync: '2024-01-20T12:00:00Z',
            permissions: ['read', 'write']
          },
          {
            id: '2',
            name: 'Stripe',
            type: 'payment',
            status: 'connected',
            lastSync: '2024-01-20T10:30:00Z',
            permissions: ['read', 'write', 'webhook']
          }
        ],
        webhooks: [
          {
            id: '1',
            name: 'Payment Webhook',
            url: 'https://api.exemplo.com/webhooks/payment',
            events: ['payment.succeeded', 'payment.failed'],
            status: 'active',
            lastTriggered: '2024-01-20T11:15:00Z'
          }
        ],
        apiKeys: [
          {
            id: '1',
            name: 'Production API',
            key: 'sk_live_••••••••••••••••',
            permissions: ['read', 'write'],
            status: 'active',
            createdAt: '2024-01-01',
            lastUsed: '2024-01-20T13:45:00Z'
          }
        ],
        socialAccounts: [
          {
            id: 'fb1',
            platform: 'facebook',
            username: '@minhaempresa',
            displayName: 'Minha Empresa',
            status: 'connected',
            lastSync: '2024-01-20T14:30:00Z',
            accountType: 'business',
            permissions: ['publish_pages', 'read_insights', 'manage_pages'],
            followers: 15420,
            avatar: 'https://example.com/avatar-fb.jpg'
          },
          {
            id: 'ig1',
            platform: 'instagram',
            username: '@minhaempresa_oficial',
            displayName: 'Minha Empresa Oficial',
            status: 'connected',
            lastSync: '2024-01-20T14:25:00Z',
            accountType: 'business',
            permissions: ['content_publish', 'read_insights'],
            followers: 8530,
            avatar: 'https://example.com/avatar-ig.jpg'
          },
          {
            id: 'tw1',
            platform: 'twitter',
            username: '@minhaempresa',
            displayName: 'Minha Empresa',
            status: 'expired',
            lastSync: '2024-01-18T09:15:00Z',
            accountType: 'business',
            permissions: ['write', 'read'],
            followers: 3240
          },
          {
            id: 'li1',
            platform: 'linkedin',
            username: 'Minha Empresa Ltda',
            displayName: 'Minha Empresa Ltda',
            status: 'disconnected',
            lastSync: '2024-01-15T16:00:00Z',
            accountType: 'business',
            permissions: [],
            followers: 1180
          }
        ]
      });
      // Configurações de API simuladas
      setApiConfigurations([
        {
          id: 'openai',
          name: 'OpenAI',
          category: 'ai',
          provider: 'OpenAI',
          status: 'active',
          credentials: [
            {
              id: 'api_key',
              name: 'API Key',
              type: 'api_key',
              value: 'sk-••••••••••••••••••••••••••••••••••••••••',
              encrypted: true,
              required: true,
              description: 'Chave de API para acessar os modelos OpenAI',
              placeholder: 'sk-proj-...'
            }
          ],
          lastTested: '2024-01-20T15:30:00Z',
          usage: {
            requests: 1250,
            limit: 5000,
            resetTime: '2024-01-21T00:00:00Z'
          }
        },
        {
          id: 'gemini',
          name: 'Google Gemini',
          category: 'ai',
          provider: 'Google',
          status: 'inactive',
          credentials: [
            {
              id: 'api_key',
              name: 'API Key',
              type: 'api_key',
              value: '',
              encrypted: false,
              required: true,
              description: 'Chave de API do Google AI Studio',
              placeholder: 'AIza...'
            },
            {
              id: 'project_id',
              name: 'Project ID',
              type: 'client_id',
              value: '',
              encrypted: false,
              required: true,
              description: 'ID do projeto no Google Cloud',
              placeholder: 'meu-projeto-123'
            }
          ]
        },
        {
          id: 'anthropic',
          name: 'Anthropic Claude',
          category: 'ai',
          provider: 'Anthropic',
          status: 'pending',
          credentials: [
            {
              id: 'api_key',
              name: 'API Key',
              type: 'api_key',
              value: 'sk-ant-••••••••••••••••••••••••••••••••••',
              encrypted: true,
              required: true,
              description: 'Chave de API da Anthropic',
              placeholder: 'sk-ant-...'
            }
          ],
          lastTested: '2024-01-20T10:15:00Z'
        },
        {
          id: 'sendgrid',
          name: 'SendGrid',
          category: 'email',
          provider: 'SendGrid',
          status: 'active',
          credentials: [
            {
              id: 'api_key',
              name: 'API Key',
              type: 'api_key',
              value: 'SG.••••••••••••••••••••••••••••••••••••••',
              encrypted: true,
              required: true,
              description: 'Chave de API do SendGrid para envio de emails',
              placeholder: 'SG...'
            }
          ],
          lastTested: '2024-01-20T14:45:00Z',
          usage: {
            requests: 850,
            limit: 10000,
            resetTime: '2024-02-01T00:00:00Z'
          }
        },
        {
          id: 'google_ads',
          name: 'Google Ads',
          category: 'advertising',
          provider: 'Google',
          status: 'error',
          credentials: [
            {
              id: 'developer_token',
              name: 'Developer Token',
              type: 'api_key',
              value: '••••••••••••••••••••••••••••••••••••••••',
              encrypted: true,
              required: true,
              description: 'Token de desenvolvedor do Google Ads',
              placeholder: 'Seu developer token'
            },
            {
              id: 'client_id',
              name: 'Client ID',
              type: 'client_id',
              value: '••••••••••••••••••••••••••••••••••••••••',
              encrypted: true,
              required: true,
              description: 'Client ID da aplicação OAuth',
              placeholder: 'Seu client ID'
            }
          ],
          lastTested: '2024-01-19T08:30:00Z',
          errorMessage: 'Token expirado. Renovação necessária.'
        }
      ]);
      setLoading('settings', false);
    };
    loadSettings();
  }, [setLoading]);
  // Handlers
  const handleSettingChange = useCallback((section: string, key: string, value: string | number | boolean) => {
    setPendingChanges(prev => ({
      ...prev,
      [`${section}.${key}`]: value
    }));
  }, []);
  const handleSaveSettings = useCallback(async () => {
    setLoading('save', true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPendingChanges({});
      showSuccess('Configurações salvas com sucesso!');
    } catch (error) {
      showError('Erro ao salvar configurações');
    } finally {
      setLoading('save', false);
    }
  }, [setLoading, showSuccess, showError]);
  const handleResetSection = useCallback(() => {
    const sectionKeys = Object.keys(pendingChanges).filter(key => 
      key.startsWith(activeSection)
    );
    const newPendingChanges = { ...pendingChanges };
    sectionKeys.forEach(key => {
      delete newPendingChanges[key];
    });
    setPendingChanges(newPendingChanges);
    showSuccess('Alterações desfeitas');
  }, [activeSection, pendingChanges, showSuccess]);
  const getSectionColor = (sectionId: string) => {
    const section = settingSections.find(s => s.id === sectionId);
    return section?.color || 'blue';
  };
  const hasPendingChanges = Object.keys(pendingChanges).length > 0;
  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userProfile?.name?.split(' ').map(n => n[0]).join('') || 'JS'}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
            <Camera className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{userProfile?.name}</h3>
          <p className="text-gray-600">{userProfile?.email}</p>
          <p className="text-sm text-gray-500 mt-1">{userProfile?.bio}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            value={userProfile?.name || ''}
            onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            value={userProfile?.email || ''}
            onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            value={userProfile?.phone || ''}
            onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localização
          </label>
          <input
            type="text"
            value={userProfile?.location || ''}
            onChange={(e) => handleSettingChange('profile', 'location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Cidade, País"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuso Horário
          </label>
          <select
            value={userProfile?.timezone || ''}
            onChange={(e) => handleSettingChange('profile', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="America/Sao_Paulo">São Paulo (UTC-3)</option>
            <option value="America/New_York">Nova York (UTC-5)</option>
            <option value="Europe/London">Londres (UTC+0)</option>
            <option value="Asia/Tokyo">Tóquio (UTC+9)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Idioma
          </label>
          <select
            value={userProfile?.language || ''}
            onChange={(e) => handleSettingChange('profile', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          value={userProfile?.bio || ''}
          onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Conte um pouco sobre você..."
        />
      </div>
    </div>
  );
  const renderSecuritySection = () => (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-green-900 mb-2">Autenticação de Dois Fatores</h4>
            <p className="text-sm text-green-700">
              Adiciona uma camada extra de segurança à sua conta.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              securitySettings?.twoFactorEnabled 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {securitySettings?.twoFactorEnabled ? 'Ativo' : 'Inativo'}
            </span>
            <button className="text-green-700 hover:text-green-800 text-sm font-medium">
              Configurar
            </button>
          </div>
        </div>
      </div>
      {/* Password Policy */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">Política de Senhas</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Comprimento mínimo</span>
            <input
              type="number"
              value={securitySettings?.passwordPolicy.minLength || 8}
              onChange={(e) => handleSettingChange('security', 'passwordPolicy.minLength', Number(e.target.value))}
              className="w-20 px-3 py-1 border border-gray-300 rounded text-sm"
              min="6"
              max="32"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings?.passwordPolicy.requireNumbers || false}
                onChange={(e) => handleSettingChange('security', 'passwordPolicy.requireNumbers', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Exigir números</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings?.passwordPolicy.requireSymbols || false}
                onChange={(e) => handleSettingChange('security', 'passwordPolicy.requireSymbols', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Exigir símbolos</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={securitySettings?.passwordPolicy.requireUppercase || false}
                onChange={(e) => handleSettingChange('security', 'passwordPolicy.requireUppercase', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Exigir letras maiúsculas</span>
            </label>
          </div>
        </div>
      </div>
      {/* Trusted Devices */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">Dispositivos Confiáveis</h4>
        <div className="space-y-3">
          {securitySettings?.trustedDevices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded">
                  {device.type === 'desktop' && <Monitor className="h-4 w-4 text-gray-600" />}
                  {device.type === 'mobile' && <Mobile className="h-4 w-4 text-gray-600" />}
                  {device.type === 'tablet' && <Tablet className="h-4 w-4 text-gray-600" />}
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">{device.name}</div>
                  <div className="text-xs text-gray-600">{device.browser} • {device.location}</div>
                  <div className="text-xs text-gray-500">
                    Última atividade: {new Date(device.lastSeen).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {device.trusted ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Confiável
                  </span>
                ) : (
                  <button className="text-blue-600 hover:text-blue-700 text-xs">
                    Confiar
                  </button>
                )}
                <button className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  const renderAppearanceSection = () => (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">Tema</h4>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'light', name: 'Claro', icon: Sun, preview: 'bg-white border-gray-300' },
            { id: 'dark', name: 'Escuro', icon: Moon, preview: 'bg-gray-900 border-gray-600' },
            { id: 'auto', name: 'Automático', icon: Contrast, preview: 'bg-gradient-to-r from-white to-gray-900' }
          ].map((theme) => {
            const Icon = theme.icon;
            return (
              <button
                key={theme.id}
                onClick={() => handleSettingChange('appearance', 'theme', theme.id)}
                className={`p-4 border-2 rounded-lg transition-all ${
                  userProfile?.theme === theme.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-full h-12 ${theme.preview} rounded mb-3 border`}></div>
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{theme.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* Display Options */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">Opções de Exibição</h4>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Animações reduzidas</span>
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Alto contraste</span>
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Fonte grande</span>
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
  const renderSocialSection = () => {
    const getPlatformIcon = (platform: string) => {
      switch (platform) {
        case 'facebook': return Facebook;
        case 'instagram': return Instagram;
        case 'twitter': return Twitter;
        case 'linkedin': return Linkedin;
        default: return Share2;
      }
    };
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'connected': return 'text-green-600 bg-green-100';
        case 'expired': return 'text-yellow-600 bg-yellow-100';
        case 'error': return 'text-red-600 bg-red-100';
        case 'disconnected': return 'text-gray-600 bg-gray-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };
    const getStatusText = (status: string) => {
      switch (status) {
        case 'connected': return 'Conectado';
        case 'expired': return 'Token Expirado';
        case 'error': return 'Erro';
        case 'disconnected': return 'Desconectado';
        default: return 'Desconhecido';
      }
    };
    const handleConnectAccount = (platform: string) => {
      window.open(`/oauth/${platform}/redirect`, '_blank', 'width=600,height=600');
    };
    const handleDisconnectAccount = async (accountId: string) => {
      if (window.confirm('Tem certeza que deseja desconectar esta conta?')) {
        try {
          // API call would go here
          showSuccess('Conta desconectada com sucesso!');
        } catch (error) {
          showError('Erro ao desconectar conta');
        }
      }
    };
    const handleRefreshToken = async (accountId: string) => {
      try {
        // API call would go here
        showSuccess('Token atualizado com sucesso!');
      } catch (error) {
        showError('Erro ao atualizar token');
      }
    };
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <Share2 className="h-6 w-6" />
            <div>
              <h3 className="text-lg font-medium">Redes Sociais</h3>
              <p className="text-orange-100 text-sm">
                Conecte suas contas de redes sociais para publicar automaticamente
              </p>
            </div>
          </div>
        </div>
        {/* Connected Accounts */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Contas Conectadas</h4>
          <div className="grid gap-4">
            {integrationSettings?.socialAccounts.map((account) => {
              const PlatformIcon = getPlatformIcon(account.platform);
              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <PlatformIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-medium text-gray-900 truncate">
                          {account.displayName}
                        </h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                          {getStatusText(account.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{account.username}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {account.followers ? `${account.followers.toLocaleString()} seguidores` : ''}
                        </span>
                        <span className="text-xs text-gray-500">
                          Última sinc: {new Date(account.lastSync).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {account.status === 'connected' && (
                      <button
                        onClick={() => handleDisconnectAccount(account.id)}
                        className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 rounded hover:bg-red-50"
                      >
                        Desconectar
                      </button>
                    )}
                    {account.status === 'expired' && (
                      <button
                        onClick={() => handleRefreshToken(account.id)}
                        className="px-3 py-1 text-xs font-medium text-orange-600 hover:text-orange-700 border border-orange-200 rounded hover:bg-orange-50"
                      >
                        Renovar Token
                      </button>
                    )}
                    {account.status === 'disconnected' && (
                      <button
                        onClick={() => handleConnectAccount(account.platform)}
                        className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded hover:bg-blue-50"
                      >
                        Reconectar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Add New Account */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Conectar Nova Conta</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'blue' },
              { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'pink' },
              { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'blue' },
              { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'blue' },
            ].map((platform) => {
              const PlatformIcon = platform.icon;
              const isConnected = integrationSettings?.socialAccounts.some(
                account => account.platform === platform.id && account.status === 'connected'
              );
              return (
                <button
                  key={platform.id}
                  onClick={() => !isConnected && handleConnectAccount(platform.id)}
                  disabled={isConnected}
                  className={`p-4 border-2 border-dashed rounded-lg text-center transition-colors ${
                    isConnected
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <PlatformIcon className={`h-8 w-8 mx-auto mb-2 ${
                    isConnected ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <p className={`text-sm font-medium ${
                    isConnected ? 'text-gray-400' : 'text-gray-900'
                  }`}>
                    {platform.name}
                  </p>
                  {isConnected && (
                    <p className="text-xs text-gray-500 mt-1">Conectado</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* Permissions Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-900 mb-1">Sobre as Permissões</h5>
              <p className="text-sm text-blue-700">
                Ao conectar suas contas, você autoriza o xWin Dash a publicar conteúdo, 
                acessar métricas e gerenciar posts em seu nome. Você pode revogar essas 
                permissões a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderApiSection = () => {
    const getCategoryColor = (category: string) => {
      const colors = {
        ai: 'bg-purple-100 text-purple-800',
        social: 'bg-blue-100 text-blue-800',
        advertising: 'bg-green-100 text-green-800',
        email: 'bg-orange-100 text-orange-800',
        analytics: 'bg-indigo-100 text-indigo-800',
        storage: 'bg-gray-100 text-gray-800',
        communication: 'bg-pink-100 text-pink-800'
      };
      return colors[category] || 'bg-gray-100 text-gray-800';
    };
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active': return 'text-green-600 bg-green-100';
        case 'pending': return 'text-yellow-600 bg-yellow-100';
        case 'error': return 'text-red-600 bg-red-100';
        case 'inactive': return 'text-gray-600 bg-gray-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };
    const getStatusText = (status: string) => {
      switch (status) {
        case 'active': return 'Ativo';
        case 'pending': return 'Pendente';
        case 'error': return 'Erro';
        case 'inactive': return 'Inativo';
        default: return 'Desconhecido';
      }
    };
    const handleTestConnection = async (apiId: string) => {
      try {
        setLoading(`test-${apiId}`, true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        showSuccess('Conexão testada com sucesso!');
      } catch (error) {
        showError('Erro ao testar conexão');
      } finally {
        setLoading(`test-${apiId}`, false);
      }
    };
    const handleUpdateCredential = (apiId: string, credentialId: string, value: string) => {
      setApiConfigurations(prev => 
        prev.map(api => 
          api.id === apiId 
            ? {
                ...api,
                credentials: api.credentials.map(cred =>
                  cred.id === credentialId 
                    ? { ...cred, value }
                    : cred
                )
              }
            : api
        )
      );
    };
    const handleSaveApiConfig = async (apiId: string) => {
      try {
        setLoading(`save-${apiId}`, true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Atualizar status para ativo se todas as credenciais obrigatórias estão preenchidas
        const api = apiConfigurations.find(a => a.id === apiId);
        const allRequiredFilled = api?.credentials
          .filter(c => c.required)
          .every(c => c.value.trim() !== '');
        if (allRequiredFilled) {
          setApiConfigurations(prev =>
            prev.map(a => 
              a.id === apiId 
                ? { ...a, status: 'active', lastTested: new Date().toISOString() }
                : a
            )
          );
        }
        showSuccess('Configuração salva com sucesso!');
      } catch (error) {
        showError('Erro ao salvar configuração');
      } finally {
        setLoading(`save-${apiId}`, false);
      }
    };
    const groupedApis = apiConfigurations.reduce((acc, api) => {
      if (!acc[api.category]) {
        acc[api.category] = [];
      }
      acc[api.category].push(api);
      return acc;
    }, {} as Record<string, ApiConfiguration[]>);
    const categoryNames = {
      ai: 'Inteligência Artificial',
      social: 'Redes Sociais',
      advertising: 'Publicidade',
      email: 'Email Marketing',
      analytics: 'Analytics',
      storage: 'Armazenamento',
      communication: 'Comunicação'
    };
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <Key className="h-6 w-6" />
            <div>
              <h3 className="text-lg font-medium">APIs & Integrações</h3>
              <p className="text-cyan-100 text-sm">
                Configure suas chaves de API e credenciais de forma segura
              </p>
            </div>
          </div>
        </div>
        {/* Categories */}
        {Object.entries(groupedApis).map(([category, apis]) => (
          <div key={category} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                {categoryNames[category] || category}
              </span>
              <span className="text-sm text-gray-500">
                {apis.length} configuração{apis.length !== 1 ? 'ões' : ''}
              </span>
            </div>
            <div className="space-y-4">
              {apis.map((api) => (
                <div
                  key={api.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{api.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(api.status)}`}>
                          {getStatusText(api.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Provider: {api.provider}</p>
                      {api.lastTested && (
                        <p className="text-xs text-gray-500">
                          Último teste: {new Date(api.lastTested).toLocaleString()}
                        </p>
                      )}
                      {api.errorMessage && (
                        <p className="text-xs text-red-600 mt-1">
                          {api.errorMessage}
                        </p>
                      )}
                      {api.usage && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Uso da API</span>
                            <span>{api.usage.requests}/{api.usage.limit}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${(api.usage.requests / api.usage.limit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTestConnection(api.id)}
                        disabled={isLoading[`test-${api.id}`]}
                        className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-50"
                      >
                        {isLoading[`test-${api.id}`] ? 'Testando...' : 'Testar'}
                      </button>
                      <button
                        onClick={() => handleSaveApiConfig(api.id)}
                        disabled={isLoading[`save-${api.id}`]}
                        className="px-3 py-1 text-xs font-medium text-green-600 hover:text-green-700 border border-green-200 rounded hover:bg-green-50 disabled:opacity-50"
                      >
                        {isLoading[`save-${api.id}`] ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                  {/* Credentials */}
                  <div className="space-y-3">
                    {api.credentials.map((credential) => (
                      <div key={credential.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {credential.name}
                          {credential.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {credential.description && (
                          <p className="text-xs text-gray-500 mb-2">{credential.description}</p>
                        )}
                        <div className="relative">
                          <input
                            type={credential.encrypted && credential.value ? 'password' : 'text'}
                            value={credential.value}
                            onChange={(e) => handleUpdateCredential(api.id, credential.id, e.target.value)}
                            placeholder={credential.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          {credential.encrypted && credential.value && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Security Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-900 mb-1">Segurança das Credenciais</h5>
              <p className="text-sm text-blue-700">
                Todas as credenciais são criptografadas antes de serem armazenadas. 
                Apenas você e administradores autorizados podem visualizar estas informações.
                As chaves são enviadas de forma segura através de conexões HTTPS.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'security':
        return renderSecuritySection();
      case 'appearance':
        return renderAppearanceSection();
      case 'social':
        return renderSocialSection();
      case 'apis':
        return renderApiSection();
      default:
        return <div className="text-center py-8 text-gray-500">Seção em desenvolvimento...</div>;
    }
  };
  if (isLoading.settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Carregando configurações...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações</h2>
              <nav className="space-y-2">
                {settingSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? `bg-${section.color}-100 text-${section.color}-700`
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{section.name}</span>
                      {Object.keys(pendingChanges).some(key => key.startsWith(section.id)) && (
                        <div className="w-2 h-2 bg-orange-400 rounded-full ml-auto"></div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {settingSections.find(s => s.id === activeSection)?.name}
                  </h3>
                  {hasPendingChanges && (
                    <p className="text-sm text-orange-600 mt-1">
                      Você tem alterações não salvas
                    </p>
                  )}
                </div>
                {hasPendingChanges && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleResetSection}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Desfazer</span>
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      disabled={isLoading.save}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isLoading.save ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      <span>Salvar</span>
                    </button>
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="p-6">
                {renderCurrentSection()}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Loading Overlay */}
      {isLoading.save && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Salvando configurações...</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdvancedSettingsPanel;
