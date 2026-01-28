import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
const PublishPostModal = ({ isOpen = false, onClose, onPublish }) => (
  <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Publicar Post">
    <div className="text-right">
      <Button variant="outline" className="mr-2" onClick={() => onClose?.()}>Cancelar</Button>
      <Button onClick={() => onPublish?.()}>Publicar</Button>
    </div>
  </Modal>
);
export default PublishPostModal;
