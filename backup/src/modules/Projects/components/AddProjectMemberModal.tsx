import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
import { AddProjectMemberModalProps, ProjectRole } from '../types/projectTypes';
const AddProjectMemberModal: React.FC<AddProjectMemberModalProps> = ({ 
  isOpen = false, 
  onClose, 
  onAdd 
}) => {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState<ProjectRole>('viewer');
  const roleOptions = [
    { value: 'viewer', label: 'Visualizador' },
    { value: 'editor', label: 'Editor' },
    { value: 'admin', label: 'Administrador' }
  ];
  const handleSubmit = () => {
    if (!userName.trim()) {
      return;
    }
    onAdd?.({ userName: userName.trim(), role });
    // Reset form
    setUserName('');
    setRole('viewer');
  };
  const handleClose = () => {
    setUserName('');
    setRole('viewer');
    onClose?.();
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Adicionar Membro" size="md">
      <div className="space-y-3">
        <div>
          <InputLabel htmlFor="user">Usuário</InputLabel>
          <Input 
            id="user" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            placeholder="Nome do usuário" 
            required
          />
        </div>
        <div>
          <InputLabel htmlFor="role">Função</InputLabel>
          <Select 
            id="role" 
            value={role} 
            onChange={(value) => setRole(value as ProjectRole)}
            options={roleOptions}
          />
        </div>
        <div className="text-right">
          <Button variant="outline" className="mr-2" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!userName.trim()}
          >
            Adicionar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default AddProjectMemberModal;
