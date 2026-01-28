import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
interface ScheduleCampaignModalProps {
  open: boolean;
  onClose: () => void;
  onSchedule?: (date: string) => void;
}
const ScheduleCampaignModal: React.FC<ScheduleCampaignModalProps> = ({ 
  open, 
  onClose, 
  onSchedule 
}) => {
  const [date, setDate] = useState<string>('');
  const handleSchedule = () => {
    if (date && onSchedule) {
      onSchedule(date);
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Card>
        <Card.Header>
          <Card.Title>Agendar Campanha</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-3">
          <Input 
            type="datetime-local" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </Card.Content>
        <Card.Footer className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSchedule} disabled={!date}>
            Agendar
          </Button>
        </Card.Footer>
      </Card>
    </Modal>
  );
};
export default ScheduleCampaignModal;
