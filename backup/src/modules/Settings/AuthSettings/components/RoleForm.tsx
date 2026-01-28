import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Button from '@/components/ui/Button';
const RoleForm = ({ isOpen = false, onClose, role, onSave }) => {
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  return (
    <Modal isOpen={isOpen} onClose={() => onClose?.()} title={role ? 'Editar Função' : 'Nova Função'}>
      <div className="space-y-3">
        <div>
          <InputLabel htmlFor="name">Nome</InputLabel>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <InputLabel htmlFor="description">Descrição</InputLabel>
          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="text-right">
          <Button variant="outline" className="mr-2" onClick={() => onClose?.()}>Cancelar</Button>
          <Button onClick={() => onSave?.({ name, description })}>{role ? 'Atualizar' : 'Criar'}</Button>
        </div>
      </div>
    </Modal>
  );
};
export default RoleForm;
