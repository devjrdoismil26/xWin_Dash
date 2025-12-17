import React, { useState } from 'react';
import Modal from '@/shared/components/ui/Modal';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
interface CreateApiTokenFormProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const CreateApiTokenForm = ({ isOpen = false, onClose, onCreate }) => {
  const [name, setName] = useState('');

  return (
            <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Novo Token">
      <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="name">Nome</InputLabel>
          <Input id="name" value={name} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value) } /></div><div className=" ">$2</div><Button variant="outline" className="mr-2" onClick={ () => onClose?.() }>Cancelar</Button>
          <Button onClick={ () => onCreate?.(name) }>Criar</Button></div></Modal>);};

export default CreateApiTokenForm;
