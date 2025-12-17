/**
 * Componente ConfirmationModal - Modal de Confirmação
 *
 * @description
 * Componente de modal de confirmação com suporte a múltiplos tipos (warning,
 * destructive, danger, info, success), ícones contextuais e estados de loading.
 * Usado para confirmar ações críticas antes de executá-las.
 *
 * Funcionalidades principais:
 * - Múltiplos tipos de confirmação (warning, destructive, danger, info, success)
 * - Ícones contextuais por tipo
 * - Estados de loading durante confirmação
 * - Textos customizáveis (título, mensagem, botões)
 * - Integração com Modal base
 * - Acessibilidade completa (ARIA)
 *
 * @module components/ui/ConfirmationModal
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import ConfirmationModal from '@/shared/components/ui/ConfirmationModal';
 *
 * <ConfirmationModal
 *   isOpen={ isOpen }
 *   onClose={ () => setIsOpen(false) }
 *   onConfirm={ handleConfirm }
 *   title="Confirmar exclusão"
 *   message="Tem certeza que deseja excluir este item?"
 *   type="destructive"
 *   confirmText="Excluir"
 *   cancelText="Cancelar"
 *   loading={ isDeleting }
 * />
 * ```
 */

import React from "react";
import { AlertTriangle, Info, CheckCircle, XCircle, HelpCircle,  } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

/**
 * Tipos de confirmação disponíveis
 *
 * @description
 * Tipos de modal de confirmação que podem ser exibidos.
 *
 * @typedef {('warning' | 'destructive' | 'danger' | 'info' | 'success')} ConfirmationType
 * @property {'warning'} warning - Confirmação de aviso (amarelo)
 * @property {'destructive'} destructive - Confirmação destrutiva (vermelho)
 * @property {'danger'} danger - Confirmação de perigo (vermelho, alias de destructive)
 * @property {'info'} info - Confirmação informativa (azul)
 * @property {'success'} success - Confirmação de sucesso (verde)
 */
type ConfirmationType =
  | "warning"
  | "destructive"
  | "danger"
  | "info"
  | "success";

/**
 * Props do componente ConfirmationModal
 *
 * @description
 * Propriedades que podem ser passadas para o componente ConfirmationModal.
 *
 * @interface ConfirmationModalProps
 * @property {boolean} isOpen - Se o modal está aberto
 * @property {() => void} onClose - Callback ao fechar o modal
 * @property {() => void} onConfirm - Callback ao confirmar a ação
 * @property {string} [title='Confirmar ação'] - Título do modal
 * @property {string} [message] - Mensagem principal do modal
 * @property {string} [text] - Texto alternativo (substitui message se fornecido)
 * @property {ConfirmationType} [type='warning'] - Tipo de confirmação
 * @property {string} [confirmText='Confirmar'] - Texto do botão de confirmação
 * @property {string} [cancelText='Cancelar'] - Texto do botão de cancelamento
 * @property {boolean} [loading=false] - Se está em estado de loading
 */
export interface ConfirmationModalProps {
  /** Se o modal está aberto */
isOpen: boolean;
  /** Callback ao fechar o modal */
onClose??: (e: any) => void;
  /** Callback ao confirmar a ação */
onConfirm??: (e: any) => void;
  /** Título do modal */
title?: string;
  /** Mensagem principal do modal */
message?: string;
  /** Texto alternativo (substitui message se fornecido) */
text?: string;
  /** Tipo de confirmação */
type?: ConfirmationType;
  /** Texto do botão de confirmação */
confirmText?: string;
  /** Texto do botão de cancelamento */
cancelText?: string;
  /** Se está em estado de loading */
loading?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente ConfirmationModal
 *
 * @description
 * Renderiza um modal de confirmação com ícone contextual, mensagem e botões
 * de ação. O tipo de confirmação determina a cor e o ícone exibidos.
 *
 * @component
 * @param {ConfirmationModalProps} props - Props do componente
 * @returns {JSX.Element} Modal de confirmação estilizado
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen,
  onClose,
  onConfirm,
  title = "Confirmar ação",
  message,
  text,
  type = "warning",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
   }) => {
  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
      confirmVariant: "warning" as const,
    },
    destructive: {
      icon: XCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      confirmVariant: "destructive" as const,
    },
    danger: {
      icon: XCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      confirmVariant: "destructive" as const,
    },
    info: {
      icon: Info,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      confirmVariant: "primary" as const,
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      confirmVariant: "success" as const,
    },};

  const safeType: ConfirmationType = (type as ConfirmationType) || "warning";
  const config = typeConfig[safeType] || typeConfig.warning;
  const Icon = config.icon;

  const displayMessage = message || text;

  return (
        <>
      <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" />
      <div className=" ">$2</div><div
          className={`flex-shrink-0 w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center`}>
           
        </div><Icon className={`w-6 h-6 ${config.iconColor} `} / /></div><div className="{displayMessage && (">$2</div>
            <p className="text-gray-700 dark:text-gray-300 mb-6" />
              {displayMessage}
            </p>
          )}
          <div className=" ">$2</div><Button variant="outline" onClick={onClose} disabled={ loading } />
              {cancelText}
            </Button>
            <Button
              variant={ config.confirmVariant }
              onClick={ onConfirm }
              loading={ loading } />
              {confirmText}
            </Button></div></div>
    </Modal>);};

export { ConfirmationModal };

export default ConfirmationModal;
