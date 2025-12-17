import React from 'react';
import Modal from '@/shared/components/ui/Modal';
import Button from '@/shared/components/ui/Button';
const TriggerWorkflowModal: React.FC<{ isOpen?: boolean; onClose???: (e: any) => void; onTrigger???: (e: any) => void }> = ({ isOpen = false, onClose, onTrigger }) => (
  <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Executar Workflow">
    <div className=" ">$2</div><Button variant="outline" className="mr-2" onClick={ () => onClose?.() }>Cancelar</Button>
      <Button onClick={ () => onTrigger?.() }>Executar</Button></div></Modal>);

export default TriggerWorkflowModal;
