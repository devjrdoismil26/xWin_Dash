import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Loader2, Wifi, WifiOff, TestTube, Edit, Trash2, Eye, Copy, Phone } from 'lucide-react';
import { useAuraConnections } from '../../AuraConnections/hooks/useAuraConnections';
import { toast } from 'sonner';
const ConnectionTable = ({ connections: propConnections = [], onEdit, onView, onDelete }) => {
  const { 
    connections: storeConnections, 
    connectionLoading,
    testConnection, 
    connectWhatsApp, 
    disconnectWhatsApp,
    fetchConnections
  } = useAuraConnections();
  const [testingId, setTestingId] = useState(null);
  const [connectingId, setConnectingId] = useState(null);
  // Inicializar dados se necessário
  useEffect(() => {
    if (propConnections.length === 0 && storeConnections.length === 0) {
      fetchConnections();
    }
  }, []);
  // Usar dados do store ou props
  const displayConnections = propConnections.length > 0 ? propConnections : storeConnections;
  const statusConfig = {
    connected: { label: 'Conectado', variant: 'success', icon: Wifi },
    disconnected: { label: 'Desconectado', variant: 'destructive', icon: WifiOff },
    pending: { label: 'Pendente', variant: 'warning', icon: Loader2 },
    error: { label: 'Erro', variant: 'destructive', icon: WifiOff },
    testing: { label: 'Testando', variant: 'secondary', icon: Loader2 }
  };
  const getStatusBadge = (status) => {
    const config = statusConfig[status] || { label: status, variant: 'outline', icon: WifiOff };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`w-3 h-3 ${status === 'testing' || status === 'pending' ? 'animate-spin' : ''}`} />
        {config.label}
      </Badge>
    );
  };
  const handleTest = async (connection) => {
    setTestingId(connection.id);
    try {
      const result = await testConnection(connection.id);
      if (result?.success) {
        toast.success('Conexão testada com sucesso!');
      } else {
        toast.error('Falha no teste de conexão');
      }
    } catch (error) {
      // Error já tratado no store
    } finally {
      setTestingId(null);
    }
  };
  const handleConnect = async (connection) => {
    setConnectingId(connection.id);
    try {
      await connectWhatsApp(connection.id);
      await fetchConnections(); // Reload para atualizar status
    } catch (error) {
      // Error já tratado no store
    } finally {
      setConnectingId(null);
    }
  };
  const handleDisconnect = async (connection) => {
    if (window.confirm('Tem certeza que deseja desconectar esta conta do WhatsApp?')) {
      try {
        await disconnectWhatsApp(connection.id);
        await fetchConnections(); // Reload para atualizar status
      } catch (error) {
        // Error já tratado no store  
      }
    }
  };
  const copyWebhookUrl = (connection) => {
    const webhookUrl = `${window.location.origin}/api/aura/webhook/${connection.id}`;
    navigator.clipboard.writeText(webhookUrl);
    toast.success('URL do webhook copiada para área de transferência!');
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
    } catch {
      return 'Data inválida';
    }
  };
  if (connectionLoading) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg bg-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando conexões...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="border rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome da Conexão</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Número WhatsApp</TableHead>
            <TableHead>Último Teste</TableHead>
            <TableHead>Msgs (24h)</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayConnections.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                <div className="flex flex-col items-center gap-3">
                  <WifiOff className="w-12 h-12 text-gray-300" />
                  <div>
                    <p className="font-medium">Nenhuma conexão encontrada</p>
                    <p className="text-sm text-gray-400">Crie sua primeira conexão WhatsApp para começar</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            displayConnections.map((connection) => (
              <TableRow key={connection.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      connection.is_active ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <div>
                      <div className="font-medium">{connection.name}</div>
                      {connection.description && (
                        <div className="text-xs text-gray-500">{connection.description}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(
                    testingId === connection.id ? 'testing' : 
                    connectingId === connection.id ? 'connecting' : 
                    connection.status
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {connection.phone_number || 'Não configurado'}
                    </code>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(connection.last_tested_at)}
                </TableCell>
                <TableCell>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-blue-600">
                      {connection.statistics?.messages_sent || 0}
                    </div>
                    <div className="text-xs text-gray-400">enviadas</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTest(connection)}
                      disabled={testingId === connection.id}
                      title="Testar conexão"
                    >
                      {testingId === connection.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyWebhookUrl(connection)}
                      title="Copiar URL webhook"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {connection.status === 'disconnected' ? (
                      <Button
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleConnect(connection)}
                        disabled={connectingId === connection.id}
                        className="text-green-600 hover:text-green-700"
                        title="Conectar WhatsApp"
                      >
                        {connectingId === connection.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wifi className="h-4 w-4" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(connection)}
                        className="text-red-600 hover:text-red-700"
                        title="Desconectar WhatsApp"
                      >
                        <WifiOff className="h-4 w-4" />
                      </Button>
                    )}
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(connection)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(connection)}
                        title="Editar conexão"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(connection)}
                        className="text-red-600 hover:text-red-700"
                        title="Excluir conexão"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default ConnectionTable;
