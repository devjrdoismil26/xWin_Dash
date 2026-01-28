import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Button from '@/components/ui/Button';
const AIModal = ({ isOpen = false, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  return (
    <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Gerar com IA" size="md">
      <div className="space-y-3">
        <div>
          <InputLabel htmlFor="prompt">Prompt</InputLabel>
          <Input id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Descreva o conteúdo desejado" />
        </div>
        <div className="text-right">
          <Button variant="outline" className="mr-2" onClick={() => onClose?.()}>Cancelar</Button>
          <Button onClick={() => onGenerate?.(prompt)}>Gerar</Button>
        </div>
      </div>
    </Modal>
  );
};
export default AIModal;
