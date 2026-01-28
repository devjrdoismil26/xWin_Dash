import React from 'react';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
const AssignChatModal: React.FC<{ open: boolean; onClose: () => void; users?: Array<{ id: string | number; name: string }>; onAssign?: (userId: string | number) => void }>
  = ({ open, onClose, users = [], onAssign }) => {
  const [userId, setUserId] = React.useState<string | number>('');
  return (
    <Modal open={open} onClose={onClose}>
      <Card>
        <Card.Header>
          <Card.Title>Atribuir Chat</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-3">
          <Select value={String(userId)} onChange={(e) => setUserId((e.target as HTMLSelectElement).value)}>
            <option value="">Selecione um usuário</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </Select>
        </Card.Content>
        <Card.Footer className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => { if (userId) onAssign?.(userId); }}>Atribuir</Button>
        </Card.Footer>
      </Card>
    </Modal>
  );
};
export default AssignChatModal;
