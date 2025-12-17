import React, { useState } from 'react';
import Modal from '@/shared/components/ui/Modal';
import InputLabel from '@/shared/components/ui/InputLabel';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
type Props = { isOpen?: boolean; onClose???: (e: any) => void; onCreate??: (e: any) => void};

const CreateFolderModal: React.FC<Props> = ({ isOpen = false, onClose, onCreate    }) => {
  const [name, setName] = useState('');

  return (
            <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Criar pasta" size="sm">
      <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="folder-name">Nome da pasta</InputLabel>
          <Input id="folder-name" value={name} onChange={(e: unknown) => setName(e.target.value)} placeholder="Ex: Imagens" /></div><div className=" ">$2</div><Button variant="outline" onClick={ () => onClose?.() }>Cancelar</Button>
          <Button onClick={ () => onCreate?.(name) }>Criar</Button></div></Modal>);};

export default CreateFolderModal;
