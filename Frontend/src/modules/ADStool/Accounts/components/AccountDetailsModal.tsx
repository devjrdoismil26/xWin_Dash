import React from 'react';
import Badge from '@/shared/components/ui/Badge';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import Modal from '@/shared/components/ui/Modal';
import { AdsAccount } from '../../types/adsAccountTypes';

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose??: (e: any) => void;
  account: AdsAccount | null;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();};

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({ isOpen, onClose, account    }) => {
  return (
        <>
      <Modal isOpen={isOpen} onClose={ onClose } />
      <Card />
        <Card.Header />
          <Card.Title>Detalhes da Conta {account?.name}</Card.Title>
        </Card.Header>
        <Card.Content />
          {account ? (
            <div className=" ">$2</div><div>
           
        </div><p className="text-xs text-gray-500">ID</p>
                <p className="font-medium">{account.id}</p></div><div>
           
        </div><p className="text-xs text-gray-500">Plataforma</p>
                <p className="font-medium">{account.platform}</p></div><div>
           
        </div><p className="text-xs text-gray-500">Status</p>
                <Badge color={ account.status === 'active' ? 'success' : 'danger' } />
                  {account.status === 'active' ? 'Conectado' : account.status === 'paused' ? 'Pausado' : account.status === 'suspended' ? 'Suspenso' : 'Pendente'}
                </Badge></div><div>
           
        </div><p className="text-xs text-gray-500">Última sincronização</p>
                <p className="font-medium">{formatDate(account.last_sync)}</p>
      </div>
    </>
  ) : (
            <div>Nenhuma conta selecionada.</div>
          )}
        </Card.Content>
        <Card.Footer />
          <Button variant="outline" onClick={ onClose }>Fechar</Button>
        </Card.Footer></Card></Modal>);};

export default AccountDetailsModal;
