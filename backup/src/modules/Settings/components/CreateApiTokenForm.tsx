import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Button from '@/components/ui/Button';
const CreateApiTokenForm = ({ isOpen = false, onClose, onCreate }) => {
  const [name, setName] = useState('');
  return (
    <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Novo Token">
      <div className="space-y-3">
        <div>
          <InputLabel htmlFor="name">Nome</InputLabel>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="text-right">
          <Button variant="outline" className="mr-2" onClick={() => onClose?.()}>Cancelar</Button>
          <Button onClick={() => onCreate?.(name)}>Criar</Button>
        </div>
      </div>
    </Modal>
  );
};
export default CreateApiTokenForm;
