/**
 * Componente Modal
 *
 * @description
 * Componente de modal reutiliz?vel com suporte a diferentes tamanhos,
 * fechamento por overlay/ESC, e acessibilidade completa.
 *
 * @module components/ui/Modal
 * @since 1.0.0
 */

import React, { useEffect, useRef } from "react";
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

/**
 * Tamanhos dispon?veis para o modal
 */
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Props do componente Modal
 *
 * @interface ModalProps
 * @property {boolean} isOpen - Se o modal est? aberto
 * @property {() => void} onClose - Fun??o chamada ao fechar o modal
 * @property {React.ReactNode} [title] - T?tulo do modal (opcional)
 * @property {React.ReactNode} [children] - Conte?do do modal (opcional)
 * @property {ModalSize} [size='md'] - Tamanho do modal
 * @property {boolean} [closeOnOverlayClick=true] - Se fecha ao clicar no overlay
 * @property {boolean} [closeOnEscape=true] - Se fecha ao pressionar ESC
 * @property {boolean} [showCloseButton=true] - Se mostra o bot?o de fechar
 * @property {string} [className] - Classes CSS adicionais (opcional)
 */
export interface ModalProps {
  isOpen: boolean;
  onClose??: (e: any) => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string; }

/**
 * Componente Modal
 *
 * @description
 * Modal reutiliz?vel com suporte a diferentes tamanhos, acessibilidade,
 * fechamento por overlay/ESC, e renderiza??o via Portal.
 *
 * @param {ModalProps} props - Props do componente
 * @param {boolean} props.isOpen - Se o modal est? aberto
 * @param {() => void} props.onClose - Fun??o chamada ao fechar o modal
 * @param {React.ReactNode} [props.title] - T?tulo do modal
 * @param {React.ReactNode} [props.children] - Conte?do do modal
 * @param {ModalSize} [props.size='md'] - Tamanho do modal
 * @param {boolean} [props.closeOnOverlayClick=true] - Se fecha ao clicar no overlay
 * @param {boolean} [props.closeOnEscape=true] - Se fecha ao pressionar ESC
 * @param {boolean} [props.showCloseButton=true] - Se mostra o bot?o de fechar
 * @param {string} [props.className] - Classes CSS adicionais
 * @returns {JSX.Element | null} Modal renderizado ou null se fechado
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);

 *
 * <Modal
 *   isOpen={ isOpen }
 *   onClose={ () => setIsOpen(false) }
 *   title="T?tulo do Modal"
 *   size="lg"
 * >
 *   <p>Conte?do do modal</p>
 * </Modal>
 * ```
 */
const Modal: React.FC<ModalProps> = ({ isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
   }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const previousActiveElement = useRef<HTMLElement | null>(null);

  /**
   * Gerencia efeitos de abertura/fechamento do modal
   *
   * @description
   * - Adiciona listener para ESC
   * - Previne scroll do body quando aberto
   * - Gerencia foco para acessibilidade
   */
  useEffect(() => {
    if (!isOpen) return;

    // Salvar elemento ativo antes de abrir
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Fun??o para fechar ao pressionar ESC
    const handleEscape = (e: KeyboardEvent): void => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();

      } ;

    // Prevenir scroll do body
    document.body.style.overflow = "hidden";

    // Adicionar listener para ESC
    if (closeOnEscape) {
      document.addEventListener("keydown", handleEscape);

    }

    // Focar no modal ao abrir (para acessibilidade)
    if (modalRef.current) {
      const firstFocusable = modalRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',);

      if (firstFocusable) {
        firstFocusable.focus();

      } return () => {
      document.body.style.overflow = "unset";
      if (closeOnEscape) {
        document.removeEventListener("keydown", handleEscape);

      }
      // Restaurar foco ao elemento anterior
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();

      } ;

  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  /**
   * Classes CSS para tamanhos do modal
   */
  const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",};

  /**
   * Handler para clique no overlay
   *
   * @param {React.MouseEvent<HTMLDivElement>} e - Evento de clique
   */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();

    } ;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={ handleOverlayClick }
      role="dialog"
      aria-modal="true"
      aria-labelledby={ title ? "modal-title" : undefined  }>
        </div><div
        ref={ modalRef }
        className={cn(
          "bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full mx-4",
          "focus:outline-none",
          sizeClasses[size],
          className,
        )} onClick={ (e: unknown) => e.stopPropagation()  }>
        {(title || showCloseButton) && (
          <div className="{title && (">$2</div>
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900 dark:text-white" />
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={ onClose }
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
                aria-label="Fechar modal" />
                <X size={24} / />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
    </div>);

  // Renderizar via Portal para evitar problemas de z-index
  return typeof window !== "undefined" && document.body
    ? createPortal(modalContent, document.body)
    : modalContent;};

/**
 * Props dos componentes filhos do Modal
 */
interface ModalSubComponentProps {
  children: React.ReactNode;
  className?: string; }

/**
 * Componente ModalHeader
 *
 * @description
 * Componente para o cabe?alho do modal.
 *
 * @param {ModalSubComponentProps} props - Props do componente
 * @param {React.ReactNode} props.children - Conte?do do cabe?alho
 * @param {string} [props.className] - Classes CSS adicionais
 * @returns {JSX.Element} Cabe?alho do modal
 *
 * @example
 * ```tsx
 * <ModalHeader />
 *   <h2>T?tulo</h2>
 * </ModalHeader>
 * ```
 */
const ModalHeader: React.FC<ModalSubComponentProps> = ({ children,
  className,
   }) => (
  <div
    className={cn(
      "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700",
      className,
    )  }>
        </div>{children}
  </div>);

/**
 * Componente ModalBody
 *
 * @description
 * Componente para o corpo do modal.
 *
 * @param {ModalSubComponentProps} props - Props do componente
 * @param {React.ReactNode} props.children - Conte?do do corpo
 * @param {string} [props.className] - Classes CSS adicionais
 * @returns {JSX.Element} Corpo do modal
 *
 * @example
 * ```tsx
 * <ModalBody />
 *   <p>Conte?do principal</p>
 * </ModalBody>
 * ```
 */
const ModalBody: React.FC<ModalSubComponentProps> = ({ children,
  className,
   }) => <div className={cn("p-6", className) } >{children}</div>;

/**
 * Componente ModalFooter
 *
 * @description
 * Componente para o rodap? do modal (geralmente cont?m bot?es de a??o).
 *
 * @param {ModalSubComponentProps} props - Props do componente
 * @param {React.ReactNode} props.children - Conte?do do rodap?
 * @param {string} [props.className] - Classes CSS adicionais
 * @returns {JSX.Element} Rodap? do modal
 *
 * @example
 * ```tsx
 * <ModalFooter />
 *   <button onClick={ onClose }>Cancelar</button>
 *   <button onClick={ onSave }>Salvar</button>
 * </ModalFooter>
 * ```
 */
const ModalFooter: React.FC<ModalSubComponentProps> = ({ children,
  className,
   }) => (
  <div
    className={cn(
      "flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700",
      className,
    )  }>
        </div>{children}
  </div>);

export { Modal, ModalHeader, ModalBody, ModalFooter };

export default Modal;
