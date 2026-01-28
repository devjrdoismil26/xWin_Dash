import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
const ApiTokenDisplayModal = ({ isOpen = false, onClose, token }) => (
  <Modal isOpen={isOpen} onClose={() => onClose?.()} title="API Token">
    <div className="space-y-3">
      <div className="font-mono text-xs break-all bg-gray-50 p-2 rounded">{token || '-'}</div>
      <div className="text-right">
        <Button onClick={() => onClose?.()}>Fechar</Button>
      </div>
    </div>
  </Modal>
);
export default ApiTokenDisplayModal;
