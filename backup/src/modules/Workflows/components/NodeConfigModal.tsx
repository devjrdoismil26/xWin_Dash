import React from 'react';
import Modal from '@/components/ui/Modal';
interface NodeConfigModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  node?: Record<string, any>;
}
const NodeConfigModal: React.FC<NodeConfigModalProps> = ({ 
  isOpen = false, 
  onClose, 
  node 
}) => (
  <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Configurar Nó">
    <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
      {JSON.stringify(node || {}, null, 2)}
    </pre>
  </Modal>
);
export default NodeConfigModal;
