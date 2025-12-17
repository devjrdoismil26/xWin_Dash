import React, { useState } from 'react';
import Modal from '@/shared/components/ui/Modal';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Button from '@/shared/components/ui/Button';
interface AIModalProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const AIModal = ({ isOpen = false, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');

  return (
            <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Gerar com IA" size="md">
      <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="prompt">Prompt</InputLabel>
          <Input id="prompt" value={prompt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)} placeholder="Descreva o conteúdo desejado" /></div><div className=" ">$2</div><Button variant="outline" className="mr-2" onClick={ () => onClose?.() }>Cancelar</Button>
          <Button onClick={ () => onGenerate?.(prompt) }>Gerar</Button></div></Modal>);};

export default AIModal;
