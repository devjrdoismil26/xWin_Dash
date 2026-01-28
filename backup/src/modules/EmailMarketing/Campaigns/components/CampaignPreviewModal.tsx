import React from 'react';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
interface CampaignPreviewModalProps {
  open: boolean;
  onClose: () => void;
  html?: string;
}
const CampaignPreviewModal: React.FC<CampaignPreviewModalProps> = ({ 
  open, 
  onClose, 
  html 
}) => (
  <Modal open={open} onClose={onClose}>
    <Card>
      <Card.Header>
        <Card.Title>Pré-visualização</Card.Title>
      </Card.Header>
      <Card.Content className="p-0">
        <iframe 
          title="Preview" 
          className="w-full h-96 border-0" 
          srcDoc={html || '<div class="p-4 text-sm text-gray-500">Sem conteúdo</div>'} 
        />
      </Card.Content>
    </Card>
  </Modal>
);
export default CampaignPreviewModal;
