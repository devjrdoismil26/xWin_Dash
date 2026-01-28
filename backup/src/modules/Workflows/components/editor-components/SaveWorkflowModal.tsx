import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
const SaveWorkflowModal = ({ isOpen = false, onClose, onSave }) => (
  <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Salvar Workflow">
    <div className="text-right">
      <Button variant="outline" className="mr-2" onClick={() => onClose?.()}>Cancelar</Button>
      <Button onClick={() => onSave?.()}>Salvar</Button>
    </div>
  </Modal>
);
export default SaveWorkflowModal;
