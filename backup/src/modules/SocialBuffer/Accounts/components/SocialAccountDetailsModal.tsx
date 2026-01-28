import React from 'react';
import Modal from '@/components/ui/Modal';
const SocialAccountDetailsModal = ({ isOpen = false, onClose, account }) => (
  <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Conta Social">
    <pre className="text-xs bg-gray-50 p-2 rounded">{JSON.stringify(account || {}, null, 2)}</pre>
  </Modal>
);
export default SocialAccountDetailsModal;
