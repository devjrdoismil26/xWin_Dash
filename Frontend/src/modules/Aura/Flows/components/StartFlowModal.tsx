import React from 'react';
import Modal from '@/shared/components/ui/Modal';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
const StartFlowModal: React.FC<{ open: boolean; onClose??: (e: any) => void; onStart???: (e: any) => void }> = ({ open, onClose, onStart }) => (
  <Modal isOpen={open} onClose={ onClose } />
    <Card title="Iniciar Fluxo" />
      <div className=" ">$2</div><p>Deseja iniciar este fluxo?</p></div><div className=" ">$2</div><Button variant="outline" onClick={ onClose }>Cancelar</Button>
        <Button onClick={ onStart }>Iniciar</Button></div></Card>
  </Modal>);

export default StartFlowModal;
