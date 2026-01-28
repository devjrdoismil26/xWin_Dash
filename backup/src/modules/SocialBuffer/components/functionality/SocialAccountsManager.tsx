// =========================================
// SOCIAL ACCOUNTS MANAGER - SOCIAL BUFFER
// =========================================

import React, { useMemo, useCallback, useState } from 'react';
import { 
  Users, 
  Plus, 
  Settings, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { Animated } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { useAccountsUI } from '../../hooks/useSocialBufferUI';
import { useAccountsStore } from '../../hooks/useAccountsStore';
import SocialBufferLoadingSkeleton from '../ui/SocialBufferLoadingSkeleton';
import SocialBufferErrorState from '../ui/SocialBufferErrorState';
import SocialBufferEmptyState from '../ui/SocialBufferEmptyState';
import SocialBufferSuccessState from '../ui/SocialBufferSuccessState';

// =========================================
// INTERFACES
// =========================================

interface SocialAccountsManagerProps {
  className?: string;
  showHeader?: boolean;
  showFilters?: boolean;
  showActions?: boolean;
  maxHeight?: string;
}

interface AccountCardProps {
  account: any;
  onEdit: (account: any) => void;
  onDelete: (account: any) => void;
  onRefresh: (account: any) => void;
  onView: (account: any) => void;
}

// =========================================
// COMPONENTE DE CARTÃO DE CONTA
// =========================================

const AccountCard: React.FC<AccountCardProps> = React.memo(({ 
  account, 
  onEdit, 
  onDelete, 
  onRefresh, 
  onView 
}) => {
  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      facebook: 'bg-blue-600',
      instagram: 'bg-pink-600',
      twitter: 'bg-blue-400',
      linkedin: 'bg-blue-700',
      youtube: 'bg-red-600',
      tiktok: 'bg-black',
      pinterest: 'bg-red-500',
      snapchat: 'bg-yellow-400'
    };
    return colors[platform.toLowerCase()] || 'bg-gray-600';
  };

  const getPlatformIcon = (platform: string) => {
    // Em uma implementação real, você teria ícones específicos para cada plataforma
    return <Users className="w-6 h-6" />;
  };

  return (
    <Animated delay={0}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="space-y-4">
          {/* Header do Cartão */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getPlatformColor(account.platform)} text-white`}>
                {getPlatformIcon(account.platform)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{account.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{account.platform}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {account.is_connected ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Informações da Conta */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Seguidores:</span>
              <span className="font-medium">{account.followers_count?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Posts:</span>
              <span className="font-medium">{account.posts_count || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Última Atividade:</span>
              <span className="font-medium">
                {account.last_activity ? new Date(account.last_activity).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          {/* Status de Conexão */}
          <div className={`p-2 rounded-lg text-center text-sm font-medium ${
            account.is_connected 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {account.is_connected ? 'Conectado' : 'Desconectado'}
          </div>

          {/* Ações */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(account)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ver
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(account)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Editar
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRefresh(account)}
              className="flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(account)}
              className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </Animated>
  );
});

AccountCard.displayName = 'AccountCard';

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

const SocialAccountsManager: React.FC<SocialAccountsManagerProps> = ({
  className = '',
  showHeader = true,
  showFilters = true,
  showActions = true,
  maxHeight = 'max-h-96'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [showConnectedOnly, setShowConnectedOnly] = useState(false);

  // Hooks
  const ui = useAccountsUI();
  const accountsStore = useAccountsStore();

  // ===== DADOS MEMOIZADOS =====

  const filteredAccounts = useMemo(() => {
    let filtered = accountsStore.accounts;

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(account =>
        account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.platform.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por plataforma
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(account => account.platform === selectedPlatform);
    }

    // Filtro por status de conexão
    if (showConnectedOnly) {
      filtered = filtered.filter(account => account.is_connected);
    }

    return filtered;
  }, [accountsStore.accounts, searchQuery, selectedPlatform, showConnectedOnly]);

  const platforms = useMemo(() => {
    const uniquePlatforms = [...new Set(accountsStore.accounts.map(account => account.platform))];
    return uniquePlatforms;
  }, [accountsStore.accounts]);

  const stats = useMemo(() => {
    const total = accountsStore.accounts.length;
    const connected = accountsStore.accounts.filter(account => account.is_connected).length;
    const disconnected = total - connected;
    
    return { total, connected, disconnected };
  }, [accountsStore.accounts]);

  // ===== CALLBACKS =====

  const handleConnectAccount = useCallback(() => {
    ui.setLoading(true);
    // Implementar lógica de conexão
    setTimeout(() => {
      ui.setLoading(false);
      ui.handleSuccess('Conta conectada com sucesso!');
    }, 2000);
  }, [ui]);

  const handleEditAccount = useCallback((account: any) => {
    console.log('Editar conta:', account);
    // Implementar lógica de edição
  }, []);

  const handleDeleteAccount = useCallback((account: any) => {
    if (window.confirm(`Tem certeza que deseja desconectar a conta ${account.name}?`)) {
      ui.setLoading(true);
      accountsStore.deleteAccount(account.id)
        .then(() => {
          ui.handleSuccess('Conta desconectada com sucesso!');
        })
        .catch((error) => {
          ui.handleError(error);
        })
        .finally(() => {
          ui.setLoading(false);
        });
    }
  }, [ui, accountsStore]);

  const handleRefreshAccount = useCallback((account: any) => {
    ui.setLoading(true);
    accountsStore.syncAccount(account.id)
      .then(() => {
        ui.handleSuccess('Conta sincronizada com sucesso!');
      })
      .catch((error) => {
        ui.handleError(error);
      })
      .finally(() => {
        ui.setLoading(false);
      });
  }, [ui, accountsStore]);

  const handleViewAccount = useCallback((account: any) => {
    console.log('Ver conta:', account);
    // Implementar lógica de visualização
  }, []);

  const handleRefreshAll = useCallback(() => {
    ui.setLoading(true);
    accountsStore.refreshAccounts()
      .then(() => {
        ui.handleSuccess('Todas as contas foram atualizadas!');
      })
      .catch((error) => {
        ui.handleError(error);
      })
      .finally(() => {
        ui.setLoading(false);
      });
  }, [ui, accountsStore]);

  // ===== RENDERIZAÇÃO =====

  if (ui.loading && !accountsStore.accounts.length) {
    return <SocialBufferLoadingSkeleton type="accounts" className={className} />;
  }

  if (ui.error && !accountsStore.accounts.length) {
    return (
      <SocialBufferErrorState
        message={ui.error}
        onRetry={handleRefreshAll}
        className={className}
      />
    );
  }

  if (ui.isEmpty) {
    return (
      <SocialBufferEmptyState
        type="accounts"
        onAction={handleConnectAccount}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contas Sociais</h2>
            <p className="text-gray-600 mt-1">
              Gerencie suas contas conectadas ({stats.connected}/{stats.total} conectadas)
            </p>
          </div>
          
          {showActions && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRefreshAll}
                disabled={ui.loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${ui.loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              
              <Button
                onClick={handleConnectAccount}
                disabled={ui.loading}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Conectar Conta
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Filtros */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar contas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtro por plataforma */}
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as plataformas</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </option>
              ))}
            </select>

            {/* Filtro por status */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showConnectedOnly}
                onChange={(e) => setShowConnectedOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Apenas conectadas</span>
            </label>
          </div>
        </Card>
      )}

      {/* Lista de Contas */}
      <div className={`overflow-y-auto ${maxHeight}`}>
        <ResponsiveGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={6}>
          {filteredAccounts.map((account, index) => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={handleEditAccount}
              onDelete={handleDeleteAccount}
              onRefresh={handleRefreshAccount}
              onView={handleViewAccount}
            />
          ))}
        </ResponsiveGrid>
      </div>

      {/* Estados de Sucesso/Erro */}
      {ui.success && (
        <SocialBufferSuccessState
          type="account"
          message={ui.success}
          onAction={() => ui.clearMessages()}
        />
      )}
    </div>
  );
};

export default SocialAccountsManager;
