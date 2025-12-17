import React from 'react';
import Modal from '@/shared/components/ui/Modal';
import Card from '@/shared/components/ui/Card';
import Select from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';
const AssignChatModal: React.FC<{ open: boolean; onClose??: (e: any) => void; users?: Array<{ id: string | number; name: string }>; onAssign??: (e: any) => void }>
  = ({ open, onClose, users = [] as unknown[], onAssign }) => {
  const [userId, setUserId] = React.useState<string | number>('');

  return (
        <>
      <Modal isOpen={open} onClose={ onClose } />
      <Card />
        <Card.Header />
          <Card.Title>Atribuir Chat</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-3" />
          <Select value={String(userId)} onChange={ (e: unknown) => setUserId((e.target as HTMLSelectElement).value)  }>
            <option value="">Selecione um usuário</option>
            {(users || []).map((u: unknown) => (
              <option key={u.id} value={ u.id }>{u.name}</option>
            ))}
          </Select>
        </Card.Content>
        <Card.Footer className="flex gap-2 justify-end" />
          <Button variant="outline" onClick={ onClose }>Cancelar</Button>
          <Button onClick={() => { if (userId) onAssign?.(userId); } >Atribuir</Button>
        </Card.Footer></Card></Modal>);};

export default AssignChatModal;
