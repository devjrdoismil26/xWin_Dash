import React from 'react';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
const VerificationModal: React.FC<{ open: boolean; onClose: () => void; onVerify?: () => void }> = ({ open, onClose, onVerify }) => (
  <Modal open={open} onClose={onClose}>
    <Card>
      <Card.Header>
        <Card.Title>Verificação</Card.Title>
      </Card.Header>
      <Card.Content className="p-6">Deseja verificar esta conexão?</Card.Content>
      <Card.Footer className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={onVerify}>Verificar</Button>
      </Card.Footer>
    </Card>
  </Modal>
);
export default VerificationModal;
