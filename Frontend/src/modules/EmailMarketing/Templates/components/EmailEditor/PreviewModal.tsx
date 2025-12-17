import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@/shared/components/ui/Modal';
import Button from '@/shared/components/ui/Button';

interface PreviewModalProps {
  content?: string;
  mode?: 'mobile' | 'tablet' | 'desktop';
  onClose???: (e: any) => void;
  isOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const PreviewModal: React.FC<PreviewModalProps> = ({ content = '', mode = 'desktop', onClose, isOpen = true    }) => {
  const size = mode === 'mobile' ? 'sm' : mode === 'tablet' ? 'md' : 'xl';
  return (
            <Modal isOpen={isOpen} onClose={() => onClose?.()} title={`Pré-visualização (${mode})`} size={ size  }>
      <div className="prose max-w-none" dangerouslySetInnerHTML={ __html: content } />
           
        </div><div className=" ">$2</div><Button variant="outline" size="sm" onClick={ () => onClose?.() }>Fechar</Button></div></Modal>);};

PreviewModal.propTypes = {
  content: PropTypes.string,
  mode: PropTypes.oneOf(['mobile', 'tablet', 'desktop']),
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,};

export default PreviewModal;
