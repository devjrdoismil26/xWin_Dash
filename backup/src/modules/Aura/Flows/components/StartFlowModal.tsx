import React from 'react';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
const StartFlowModal: React.FC<{ open: boolean; onClose: () => void; onStart?: () => void }> = ({ open, onClose, onStart }) => (
  <Modal open={open} onClose={onClose}>
    <Card title="Iniciar Fluxo">
      <div className="p-6">
        <p>Deseja iniciar este fluxo?</p>
      </div>
      <div className="flex gap-2 justify-end mt-4 px-6 pb-6">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={onStart}>Iniciar</Button>
      </div>
    </Card>
  </Modal>
);
export default StartFlowModal;
