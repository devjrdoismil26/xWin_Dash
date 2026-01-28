import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
const TriggerWorkflowModal: React.FC<{ isOpen?: boolean; onClose?: () => void; onTrigger?: () => void }> = ({ isOpen = false, onClose, onTrigger }) => (
  <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Executar Workflow">
    <div className="text-right">
      <Button variant="outline" className="mr-2" onClick={() => onClose?.()}>Cancelar</Button>
      <Button onClick={() => onTrigger?.()}>Executar</Button>
    </div>
  </Modal>
);
export default TriggerWorkflowModal;
