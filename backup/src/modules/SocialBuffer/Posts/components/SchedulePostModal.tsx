import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
interface SchedulePostModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSchedule?: (dateTime: string) => void;
}
const SchedulePostModal: React.FC<SchedulePostModalProps> = ({ 
  isOpen = false, 
  onClose, 
  onSchedule 
}) => {
  const [dateTime, setDateTime] = useState<string>('');
  const handleSchedule = () => {
    if (dateTime && onSchedule) {
      onSchedule(dateTime);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Agendar Post">
      <div className="space-y-3">
        <Input 
          type="datetime-local" 
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
        <div className="text-right">
          <Button 
            variant="outline" 
            className="mr-2" 
            onClick={() => onClose?.()}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSchedule}
            disabled={!dateTime}
          >
            Agendar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default SchedulePostModal;
