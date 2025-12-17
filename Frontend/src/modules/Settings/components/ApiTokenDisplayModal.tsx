import React from 'react';
import Modal from '@/shared/components/ui/Modal';
import Button from '@/shared/components/ui/Button';
interface ApiTokenDisplayModalProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const ApiTokenDisplayModal = ({ isOpen = false, onClose, token }) => (
  <Modal isOpen={isOpen} onClose={() => onClose?.()} title="API Token">
    <div className=" ">$2</div><div className="font-mono text-xs break-all bg-gray-50 p-2 rounded">{token || '-'}</div>
      <div className=" ">$2</div><Button onClick={ () => onClose?.() }>Fechar</Button></div></Modal>);

export default ApiTokenDisplayModal;
