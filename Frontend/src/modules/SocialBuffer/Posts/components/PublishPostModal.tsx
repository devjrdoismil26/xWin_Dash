/**
 * Modal para publicar post do SocialBuffer
 *
 * @description
 * Modal de confirma??o para publicar post imediatamente.
 * Permite cancelar ou confirmar publica??o.
 *
 * @module modules/SocialBuffer/Posts/components/PublishPostModal
 * @since 1.0.0
 */

import React from 'react';
import Modal from '@/shared/components/ui/Modal';
import Button from '@/shared/components/ui/Button';

/**
 * Props do componente PublishPostModal
 *
 * @interface PublishPostModalProps
 * @property {boolean} [isOpen] - Se o modal est? aberto
 * @property {() => void} [onClose] - Callback para fechar o modal
 * @property {() => void} [onPublish] - Callback para publicar post
 */
interface PublishPostModalProps {
  isOpen?: boolean;
  onClose???: (e: any) => void;
  onPublish???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente PublishPostModal
 *
 * @description
 * Renderiza modal de confirma??o com bot?es para cancelar ou publicar.
 *
 * @param {PublishPostModalProps} props - Props do componente
 * @returns {JSX.Element} Modal de publica??o
 */
const PublishPostModal: React.FC<PublishPostModalProps> = ({ isOpen = false, onClose, onPublish    }) => (
  <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Publicar Post">
    <div className=" ">$2</div><Button variant="outline" className="mr-2" onClick={ () => onClose?.() }>Cancelar</Button>
      <Button onClick={ () => onPublish?.() }>Publicar</Button></div></Modal>);

export default PublishPostModal;
