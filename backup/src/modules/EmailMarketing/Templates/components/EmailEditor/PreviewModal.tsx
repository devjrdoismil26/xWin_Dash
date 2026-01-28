import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
const PreviewModal: React.FC<{content?: any, mode?: any, onClose, isOpen?: any}> = ({ content = '', mode = 'desktop', onClose, isOpen = true }) => {
  const size = mode === 'mobile' ? 'sm' : mode === 'tablet' ? 'md' : 'xl';
  return (
    <Modal isOpen={isOpen} onClose={() => onClose?.()} title={`Pré-visualização (${mode})`} size={size}>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      <div className="mt-4 text-right">
        <Button variant="outline" size="sm" onClick={() => onClose?.()}>Fechar</Button>
      </div>
    </Modal>
  );
};
PreviewModal.propTypes = {
  content: PropTypes.string,
  mode: PropTypes.oneOf(['mobile', 'tablet', 'desktop']),
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
};
export default PreviewModal;
