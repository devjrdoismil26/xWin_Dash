import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import InputLabel from '@/components/ui/InputLabel';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
type Props = { isOpen?: boolean; currentName?: string; onClose?: () => void; onRename?: (name: string) => void };
const RenameFolderModal: React.FC<Props> = ({ isOpen = false, currentName = '', onClose, onRename }) => {
  const [name, setName] = useState(currentName);
  return (
    <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Renomear pasta" size="sm">
      <div className="space-y-3">
        <div>
          <InputLabel htmlFor="rename-folder">Novo nome</InputLabel>
          <Input id="rename-folder" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onClose?.()}>Cancelar</Button>
          <Button onClick={() => onRename?.(name)}>Renomear</Button>
        </div>
      </div>
    </Modal>
  );
};
export default RenameFolderModal;
