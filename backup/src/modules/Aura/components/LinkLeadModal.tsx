import React from 'react';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
const LinkLeadModal: React.FC<{ open: boolean; onClose: () => void; leads?: Array<{ id: string | number; name: string }>; onLink?: (leadId: string | number) => void }>
  = ({ open, onClose, leads = [], onLink }) => {
  const [leadId, setLeadId] = React.useState<string | number>('');
  return (
    <Modal open={open} onClose={onClose}>
      <Card>
        <Card.Header>
          <Card.Title>Vincular Lead</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-3">
          <Select value={leadId as any} onChange={(e) => setLeadId((e.target as HTMLSelectElement).value)}>
            <option value="">Selecione um lead</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </Select>
        </Card.Content>
        <Card.Footer className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => leadId && onLink?.(leadId)}>Vincular</Button>
        </Card.Footer>
      </Card>
    </Modal>
  );
};
export default LinkLeadModal;
