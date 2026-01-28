import React from 'react';
import Modal from '@/components/ui/Modal';
import FileInput from '@/components/ui/FileInput';
import Button from '@/components/ui/Button';
type Props = { isOpen?: boolean; onClose?: () => void; onUpload?: (files: FileList | File[]) => void };
const UploadMediaModal: React.FC<Props> = ({ isOpen = false, onClose, onUpload }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Enviar arquivos" size="md">
      <div className="space-y-3">
        <FileInput multiple accept="image/*,video/*" onChange={(files) => onUpload?.(files as any)} />
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onClose?.()}>Fechar</Button>
        </div>
      </div>
    </Modal>
  );
};
export default UploadMediaModal;
