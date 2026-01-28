import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
type Props = { isOpen?: boolean; folderName?: string; onClose?: () => void; onConfirm?: () => void };
const DeleteFolderModal: React.FC<Props> = ({ isOpen = false, folderName, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Excluir pasta" size="sm">
      <p className="mb-3">Tem certeza que deseja excluir &quot;{folderName ?? ''}&quot;?</p>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => onClose?.()}>Cancelar</Button>
        <Button variant="destructive" onClick={() => onConfirm?.()}>Excluir</Button>
      </div>
    </Modal>
  );
};
export default DeleteFolderModal;
