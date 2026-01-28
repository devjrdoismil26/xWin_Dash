import React from 'react';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
const QRCodeDisplayModal = ({ open, onClose, qrCodeUrl }) => (
  <Modal open={open} onClose={onClose}>
    <Card>
      <Card.Header>
        <Card.Title>QR Code</Card.Title>
      </Card.Header>
      <Card.Content className="p-6 flex justify-center">
        {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code" className="max-w-xs" /> : <div className="text-gray-500">Sem código</div>}
      </Card.Content>
    </Card>
  </Modal>
);
export default QRCodeDisplayModal;
