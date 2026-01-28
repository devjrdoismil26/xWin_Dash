import React, { useState } from 'react';
import { 
  UserPlus, 
  Shield, 
  Bell, 
  BarChart3, 
  Download, 
  Upload, 
  Settings, 
  Users, 
  UserCheck, 
  UserX, 
  Mail, 
  FileText,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Archive
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { Animated } from '@/components/ui/AdvancedAnimations';
import { EmptyState } from '@/components/ui/EmptyState';
import Tooltip from '@/components/ui/Tooltip';
import { useUserManagement } from '../hooks/useUserManagement';
import { useUserRoles } from '../hooks/useUserRoles';
import { useUserNotifications } from '../hooks/useUserNotifications';

interface UsersQuickActionsProps {
  className?: string;
  onActionComplete?: (action: string, result?: any) => void;
  selectedUsers?: string[];
  onSelectionChange?: (users: string[]) => void;
}

interface QuickAction {
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

const UsersQuickActions: React.FC<UsersQuickActionsProps> = ({ 
  className = '',
  onActionComplete,
  selectedUsers = [],
  onSelectionChange
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<QuickAction | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Hooks
  const { 
    createUser, 
    updateUser, 
    deleteUser, 
    activateUser, 
    deactivateUser, 
    suspendUser, 
    unsuspendUser,
    bulkCreateUsers,
    bulkUpdateUsers,
    bulkDeleteUsers,
    bulkActivateUsers,
    bulkDeactivateUsers,
    bulkSuspendUsers,
    exportUsers,
    importUsers
  } = useUserManagement();

  const { 
    assignRole, 
    removeRole, 
    bulkAssignRoles, 
    bulkRemoveRoles 
  } = useUserRoles();

  const { 
    sendNotification, 
    scheduleNotification, 
    bulkSendNotifications 
  } = useUserNotifications();

  const handleAction = async (action: QuickAction) => {
    if (action.requiresConfirmation) {
      setPendingAction(action);
      setShowConfirmModal(true);
      return;
    }

    await executeAction(action);
  };

  const executeAction = async (action: QuickAction) => {
    try {
      setLoading(action.id);

      switch (action.id) {
        case 'create_user':
          await createUser({
            name: 'Novo Usuário',
            email: `user${Date.now()}@example.com`,
            password: 'temp123',
            role: 'user'
          });
          onActionComplete?.('create_user', { success: true });
          break;

        case 'bulk_create':
          await bulkCreateUsers([
            { name: 'Usuário 1', email: 'user1@example.com', password: 'temp123', role: 'user' },
            { name: 'Usuário 2', email: 'user2@example.com', password: 'temp123', role: 'user' }
          ]);
          onActionComplete?.('bulk_create', { success: true });
          break;

        case 'export_users': {
          const exportData = await exportUsers();
          onActionComplete?.('export_users', { data: exportData });
          break;
        }

        case 'import_users':
          // Simular importação
          onActionComplete?.('import_users', { success: true });
          break;

        case 'bulk_activate':
          if (selectedUsers.length > 0) {
            await bulkActivateUsers(selectedUsers);
            onActionComplete?.('bulk_activate', { users: selectedUsers });
          }
          break;

        case 'bulk_deactivate':
          if (selectedUsers.length > 0) {
            await bulkDeactivateUsers(selectedUsers);
            onActionComplete?.('bulk_deactivate', { users: selectedUsers });
          }
          break;

        case 'bulk_suspend':
          if (selectedUsers.length > 0) {
            await bulkSuspendUsers(selectedUsers);
            onActionComplete?.('bulk_suspend', { users: selectedUsers });
          }
          break;

        case 'bulk_assign_role':
          if (selectedUsers.length > 0) {
            await bulkAssignRoles(selectedUsers, 'user');
            onActionComplete?.('bulk_assign_role', { users: selectedUsers, role: 'user' });
          }
          break;

        case 'send_notification':
          await sendNotification({
            title: 'Notificação de Teste',
            message: 'Esta é uma notificação de teste',
            type: 'info',
            user_ids: selectedUsers.length > 0 ? selectedUsers : undefined
          });
          onActionComplete?.('send_notification', { success: true });
          break;

        case 'generate_report':
          onActionComplete?.('generate_report', { success: true });
          break;

        default:
          console.log(`Ação ${action.id} não implementada`);
      }
    } catch (error) {
      console.error(`Erro ao executar ação ${action.id}:`, error);
      onActionComplete?.(action.id, { error: error instanceof Error ? error.message : 'Erro desconhecido' });
    } finally {
      setLoading(null);
      setShowConfirmModal(false);
      setPendingAction(null);
    }
  };

  const confirmAction = () => {
    if (pendingAction) {
      executeAction(pendingAction);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'create_user',
      title: 'Novo Usuário',
      description: 'Criar um novo usuário',
      icon: <UserPlus className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      action: () => handleAction(quickActions[0])
    },
    {
      id: 'bulk_create',
      title: 'Criar em Lote',
      description: 'Criar múltiplos usuários',
      icon: <Users className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      requiresConfirmation: true,
      action: () => handleAction(quickActions[1])
    },
    {
      id: 'export_users',
      title: 'Exportar',
      description: 'Exportar lista de usuários',
      icon: <Download className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      action: () => handleAction(quickActions[2])
    },
    {
      id: 'import_users',
      title: 'Importar',
      description: 'Importar usuários de arquivo',
      icon: <Upload className="w-5 h-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      action: () => handleAction(quickActions[3])
    }
  ];

  const bulkActions: QuickAction[] = [
    {
      id: 'bulk_activate',
      title: 'Ativar Selecionados',
      description: 'Ativar usuários selecionados',
      icon: <UserCheck className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      requiresSelection: true,
      disabled: selectedUsers.length === 0,
      action: () => handleAction(bulkActions[0])
    },
    {
      id: 'bulk_deactivate',
      title: 'Desativar Selecionados',
      description: 'Desativar usuários selecionados',
      icon: <UserX className="w-5 h-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      requiresSelection: true,
      requiresConfirmation: true,
      disabled: selectedUsers.length === 0,
      action: () => handleAction(bulkActions[1])
    },
    {
      id: 'bulk_suspend',
      title: 'Suspender Selecionados',
      description: 'Suspender usuários selecionados',
      icon: <Archive className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      requiresSelection: true,
      requiresConfirmation: true,
      disabled: selectedUsers.length === 0,
      action: () => handleAction(bulkActions[2])
    },
    {
      id: 'bulk_assign_role',
      title: 'Atribuir Role',
      description: 'Atribuir role aos selecionados',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      requiresSelection: true,
      requiresConfirmation: true,
      disabled: selectedUsers.length === 0,
      action: () => handleAction(bulkActions[3])
    }
  ];

  const notificationActions: QuickAction[] = [
    {
      id: 'send_notification',
      title: 'Enviar Notificação',
      description: 'Enviar notificação para usuários',
      icon: <Bell className="w-5 h-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      action: () => handleAction(notificationActions[0])
    },
    {
      id: 'generate_report',
      title: 'Gerar Relatório',
      description: 'Gerar relatório de usuários',
      icon: <FileText className="w-5 h-5" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      action: () => handleAction(notificationActions[1])
    }
  ];

  const renderActionButton = (action: QuickAction, index: number) => (
    <Animated key={action.id} delay={index * 100}>
      <Button
        variant="outline"
        className={`h-auto p-4 flex flex-col items-center gap-2 ${action.bgColor} ${action.borderColor} ${action.color} hover:opacity-80 transition-opacity`}
        onClick={action.action}
        disabled={action.disabled || loading === action.id}
      >
        {loading === action.id ? (
          <LoadingSpinner size="sm" />
        ) : (
          action.icon
        )}
        <div className="text-center">
          <div className="text-sm font-medium">{action.title}</div>
          <div className="text-xs opacity-75">{action.description}</div>
        </div>
      </Button>
    </Animated>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
          <p className="text-gray-600">Operações comuns do sistema de usuários</p>
        </div>
        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedUsers.length} usuário(s) selecionado(s)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectionChange?.([])}
            >
              Limpar Seleção
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Operações Básicas</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => renderActionButton(action, index))}
        </div>
      </Card>

      {/* Bulk Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">Ações em Lote</h4>
          <Tooltip content="Ações disponíveis quando usuários estão selecionados">
            <Filter className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {bulkActions.map((action, index) => renderActionButton(action, index))}
        </div>
        {selectedUsers.length === 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Selecione usuários para habilitar ações em lote
            </p>
          </div>
        )}
      </Card>

      {/* Notification Actions */}
      <Card className="p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Notificações e Relatórios</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {notificationActions.map((action, index) => renderActionButton(action, index))}
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar Ação"
        size="sm"
      >
        {pendingAction && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Tem certeza que deseja executar a ação &quot;{pendingAction.title}&quot;?
            </p>
            {pendingAction.requiresSelection && selectedUsers.length > 0 && (
              <p className="text-sm text-gray-500">
                Esta ação será aplicada a {selectedUsers.length} usuário(s) selecionado(s).
              </p>
            )}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmAction}
                disabled={loading === pendingAction.id}
              >
                {loading === pendingAction.id ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Confirmar'
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UsersQuickActions;
