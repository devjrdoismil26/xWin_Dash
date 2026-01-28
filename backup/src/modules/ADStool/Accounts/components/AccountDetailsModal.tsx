import React from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};
const AccountDetailsModal = ({ isOpen, onClose, account }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Card>
        <Card.Header>
          <Card.Title>Detalhes da Conta {account?.name}</Card.Title>
        </Card.Header>
        <Card.Content>
          {account ? (
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">ID</p>
                <p className="font-medium">{account.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Plataforma</p>
                <p className="font-medium">{account.platform}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <Badge color={account.status === 'connected' ? 'success' : 'danger'}>
                  {account.status === 'connected' ? 'Conectado' : 'Desconectado'}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500">Última sincronização</p>
                <p className="font-medium">{formatDate(account.last_sync)}</p>
              </div>
            </div>
          ) : (
            <div>Nenhuma conta selecionada.</div>
          )}
        </Card.Content>
        <Card.Footer>
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </Card.Footer>
      </Card>
    </Modal>
  );
};
export default AccountDetailsModal;
