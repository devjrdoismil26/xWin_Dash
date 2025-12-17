import React, { useState } from 'react';
import Modal from '@/shared/components/ui/Modal';
import InputLabel from '@/shared/components/ui/InputLabel';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
type Props = { isOpen?: boolean; currentName?: string; onClose???: (e: any) => void; onRename??: (e: any) => void};

const RenameFolderModal: React.FC<Props> = ({ isOpen = false, currentName = '', onClose, onRename    }) => {
  const [name, setName] = useState(currentName);

  return (
            <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Renomear pasta" size="sm">
      <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="rename-folder">Novo nome</InputLabel>
          <Input id="rename-folder" value={name} onChange={ (e: unknown) => setName(e.target.value) } /></div><div className=" ">$2</div><Button variant="outline" onClick={ () => onClose?.() }>Cancelar</Button>
          <Button onClick={ () => onRename?.(name) }>Renomear</Button></div></Modal>);};

export default RenameFolderModal;
