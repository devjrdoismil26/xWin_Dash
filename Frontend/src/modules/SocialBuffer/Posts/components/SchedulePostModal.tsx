import React, { useState } from 'react';
import Modal from '@/shared/components/ui/Modal';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
interface SchedulePostModalProps {
  isOpen?: boolean;
  onClose???: (e: any) => void;
  onSchedule??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
/**
 * Componente SchedulePostModal
 *
 * @description
 * Renderiza modal com campo de data/hora para agendar post.
 * Valida se data foi selecionada antes de permitir agendamento.
 *
 * @param {SchedulePostModalProps} props - Props do componente
 * @returns {JSX.Element} Modal de agendamento
 */
const SchedulePostModal: React.FC<SchedulePostModalProps> = ({ isOpen = false, 
  onClose, 
  onSchedule 
   }) => {
  const [dateTime, setDateTime] = useState<string>('');

  const handleSchedule = () => {
    if (dateTime && onSchedule) {
      onSchedule(dateTime);

    } ;

  return (
            <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Agendar Post">
      <div className=" ">$2</div><Input 
          type="datetime-local" 
          value={ dateTime }
          onChange={ (e: unknown) => setDateTime(e.target.value) } />
        <div className=" ">$2</div><Button 
            variant="outline" 
            className="mr-2" 
            onClick={ () => onClose?.()  }>
            Cancelar
          </Button>
          <Button 
            onClick={ handleSchedule }
            disabled={ !dateTime } />
            Agendar
          </Button></div></Modal>);};

export default SchedulePostModal;
