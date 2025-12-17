import React, { useState } from 'react';
import Modal from '@/shared/components/ui/Modal';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
interface ScheduleCampaignModalProps {
  open: boolean;
  onClose??: (e: any) => void;
  onSchedule??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const ScheduleCampaignModal: React.FC<ScheduleCampaignModalProps> = ({ open, 
  onClose, 
  onSchedule 
   }) => {
  const [date, setDate] = useState<string>('');

  const handleSchedule = () => {
    if (date && onSchedule) {
      onSchedule(date);

    } ;

  return (
        <>
      <Modal isOpen={open} onClose={ onClose } />
      <Card />
        <Card.Header />
          <Card.Title>Agendar Campanha</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-3" />
          <Input 
            type="datetime-local" 
            value={ date }
            onChange={ (e: unknown) => setDate(e.target.value) } />
        </Card.Content>
        <Card.Footer className="flex gap-2 justify-end" />
          <Button variant="outline" onClick={ onClose } />
            Cancelar
          </Button>
          <Button onClick={handleSchedule} disabled={ !date } />
            Agendar
          </Button>
        </Card.Footer></Card></Modal>);};

export default ScheduleCampaignModal;
