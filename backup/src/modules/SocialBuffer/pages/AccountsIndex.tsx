import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Plus, Link, Unlink, RefreshCw, Facebook, Twitter, Instagram, Linkedin, Youtube, AlertCircle, CheckCircle } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import useSocialBuffer from '../hooks/useSocialBuffer';
const AccountsIndexPage: React.FC<{ auth?: any }> = ({ auth }) => {
  const {
    socialAccounts,
    socialAccountsLoading,
    socialAccountsError,
    fetchSocialAccounts,
    deleteSocialAccount,
    refreshAccountToken,
    disconnectAccount,
  } = useSocialBuffer();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  useEffect(() => {
    fetchSocialAccounts();
  }, []);
  const getPlatformIcon = (platform: string) => {
    const icons = {
      facebook: <Facebook className="w-5 h-5 text-blue-600" />,
      twitter: <Twitter className="w-5 h-5 text-blue-400" />,
      instagram: <Instagram className="w-5 h-5 text-pink-600" />,
      linkedin: <Linkedin className="w-5 h-5 text-blue-700" />,
      youtube: <Youtube className="w-5 h-5 text-red-600" />,
    };
    return icons[platform] || <Link className="w-5 h-5 text-gray-600" />;
  };
  const getPlatformColor = (platform: string) => {
    const colors = {
      facebook: 'bg-blue-100 text-blue-800',
      twitter: 'bg-blue-100 text-blue-600',
      instagram: 'bg-pink-100 text-pink-600',
      linkedin: 'bg-blue-100 text-blue-700',
      youtube: 'bg-red-100 text-red-600',
    };
    return colors[platform] || 'bg-gray-100 text-gray-600';
  };
  const handleDisconnect = async (id: number) => {
    if (confirm('Tem certeza que deseja desconectar esta conta?')) {
      try {
        await disconnectAccount(id);
      } catch (error) {
        console.error('Erro ao desconectar conta:', error);
      }
    }
  };
  const handleRefreshToken = async (id: number) => {
    try {
      await refreshAccountToken(id);
    } catch (error) {
      console.error('Erro ao renovar token:', error);
    }
  };
  const platforms = [
    { key: 'facebook', name: 'Facebook', icon: <Facebook className="w-6 h-6" /> },
    { key: 'twitter', name: 'Twitter', icon: <Twitter className="w-6 h-6" /> },
    { key: 'instagram', name: 'Instagram', icon: <Instagram className="w-6 h-6" /> },
    { key: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-6 h-6" /> },
    { key: 'youtube', name: 'YouTube', icon: <Youtube className="w-6 h-6" /> },
  ];
  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Contas Sociais - Social Buffer" />
      <PageLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contas Sociais</h1>
              <p className="text-gray-600">Conecte e gerencie suas contas das redes sociais</p>
            </div>
            <Button onClick={() => setShowConnectModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Conectar Conta
            </Button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <Card.Content className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Contas</p>
                    <p className="text-2xl font-bold text-gray-900">{socialAccounts.length}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Link className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contas Ativas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {socialAccounts.filter(acc => acc.is_active).length}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Plataformas</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {new Set(socialAccounts.map(acc => acc.platform)).size}
                    </p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Link className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
          {/* Connect Modal */}
          {showConnectModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Conectar Nova Conta</h3>
                <p className="text-gray-600 mb-4">Escolha a plataforma que deseja conectar:</p>
                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.key}
                      onClick={() => {
                        setSelectedPlatform(platform.key);
                        // Aqui você implementaria a lógica de OAuth
                        setShowConnectModal(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {platform.icon}
                      <span className="font-medium">{platform.name}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowConnectModal(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Accounts List */}
          <Card>
            <Card.Header>
              <Card.Title>Contas Conectadas</Card.Title>
            </Card.Header>
            <Card.Content>
              {socialAccountsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : socialAccountsError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">Erro ao carregar contas: {socialAccountsError}</p>
                </div>
              ) : socialAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Nenhuma conta conectada</p>
                  <Button onClick={() => setShowConnectModal(true)}>
                    Conectar Primeira Conta
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {socialAccounts.map((account) => (
                    <div key={account.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getPlatformIcon(account.platform)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900">{account.username}</h3>
                              <Badge 
                                variant={account.is_active ? 'success' : 'secondary'}
                                className={getPlatformColor(account.platform)}
                              >
                                {account.platform}
                              </Badge>
                              {account.is_active ? (
                                <Badge variant="success">Ativa</Badge>
                              ) : (
                                <Badge variant="secondary">Inativa</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Conectada em: {new Date(account.created_at).toLocaleDateString()}
                            </p>
                            {account.expires_at && (
                              <p className="text-xs text-gray-500">
                                Token expira em: {new Date(account.expires_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRefreshToken(account.id)}
                            title="Atualizar Token"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDisconnect(account.id)}
                            title="Desconectar"
                          >
                            <Unlink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default AccountsIndexPage;
