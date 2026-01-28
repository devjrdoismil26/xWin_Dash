
import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmationModalProps {
  isOpen: any;
  onClose: any;
  onConfirm: any;
  title?: string;
  message?: string;
  text?: string;
  type?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar ação',
  message,
  text,
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false
}) => {
  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      confirmVariant: 'warning' as const
    },
    destructive: {
      icon: XCircle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      confirmVariant: 'destructive' as const
    },
    danger: {
      icon: XCircle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      confirmVariant: 'destructive' as const
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      confirmVariant: 'primary' as const
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      confirmVariant: 'success' as const
    }
  };

  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.warning;
  const Icon = config.icon;

  const displayMessage = message || text;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          {displayMessage && (
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {displayMessage}
            </p>
          )}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              variant={config.confirmVariant}
              onClick={onConfirm}
              loading={loading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { ConfirmationModal };
export default ConfirmationModal;
