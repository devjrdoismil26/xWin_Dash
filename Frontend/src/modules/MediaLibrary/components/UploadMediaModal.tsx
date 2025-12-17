import React from 'react';
import Modal from '@/shared/components/ui/Modal';
import FileInput from '@/shared/components/ui/FileInput';
import Button from '@/shared/components/ui/Button';
type Props = { isOpen?: boolean; onClose???: (e: any) => void; onUpload??: (e: any) => void};

const UploadMediaModal: React.FC<Props> = ({ isOpen = false, onClose, onUpload    }) => {
  return (
            <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Enviar arquivos" size="md">
      <div className=" ">$2</div><FileInput multiple accept="image/*,video/*" onChange={ (files: unknown) => onUpload?.(files as any) } />
        <div className=" ">$2</div><Button variant="outline" onClick={ () => onClose?.() }>Fechar</Button></div></Modal>);};

export default UploadMediaModal;
