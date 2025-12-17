import React, { useState } from 'react';
import Modal from '@/shared/components/ui/Modal';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
interface RoleFormProps {
  role?: string;
  onSubmit?: (e: any) => void;
  onCancel???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const RoleForm = ({ isOpen = false, onClose, role, onSave }) => {
  const [name, setName] = useState(role?.name || '');

  const [description, setDescription] = useState(role?.description || '');

  return (
            <Modal isOpen={isOpen} onClose={() => onClose?.()} title={ role ? 'Editar Função' : 'Nova Função'  }>
      <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="name">Nome</InputLabel>
          <Input id="name" value={name} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="description">Descrição</InputLabel>
          <Input id="description" value={description} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value) } /></div><div className=" ">$2</div><Button variant="outline" className="mr-2" onClick={ () => onClose?.() }>Cancelar</Button>
          <Button onClick={() => onSave?.({ name, description })}>{role ? 'Atualizar' : 'Criar'}</Button></div></Modal>);};

export default RoleForm;
