import React from 'react';
import Modal from '@/shared/components/ui/Modal';
import Card from '@/shared/components/ui/Card';
interface CampaignPreviewModalProps {
  open: boolean;
  onClose??: (e: any) => void;
  html?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const CampaignPreviewModal: React.FC<CampaignPreviewModalProps> = ({ open, 
  onClose, 
  html 
   }) => (
  <Modal isOpen={open} onClose={ onClose } />
    <Card />
      <Card.Header />
        <Card.Title>Pré-visualização</Card.Title>
      </Card.Header>
      <Card.Content className="p-0" />
        <iframe 
          title="Eye" 
          className="w-full h-96 border-0" 
          srcDoc={ html || '<div class="p-4 text-sm text-gray-500">Sem conteúdo</div>' } />
      </Card.Content></Card></Modal>);

export default CampaignPreviewModal;
