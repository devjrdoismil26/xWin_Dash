import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import InputLabel from '@/components/ui/InputLabel';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
type Props = { isOpen?: boolean; onClose?: () => void; onCreate?: (name: string) => void };
const CreateFolderModal: React.FC<Props> = ({ isOpen = false, onClose, onCreate }) => {
  const [name, setName] = useState('');
  return (
    <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Criar pasta" size="sm">
      <div className="space-y-3">
        <div>
          <InputLabel htmlFor="folder-name">Nome da pasta</InputLabel>
          <Input id="folder-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Imagens" />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onClose?.()}>Cancelar</Button>
          <Button onClick={() => onCreate?.(name)}>Criar</Button>
        </div>
      </div>
    </Modal>
  );
};
export default CreateFolderModal;
