import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import FileInput from '@/components/ui/FileInput';
const ProductImageSelector = ({ isOpen = false, onClose, onSelect }) => {
  const [file, setFile] = useState(null);
  return (
    <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Selecionar Imagem" size="md">
      <FileInput accept="image/*" onChange={(f) => setFile(Array.isArray(f) ? f[0] : f)} />
      <div className="text-right mt-3">
        <Button variant="outline" className="mr-2" onClick={() => onClose?.()}>Cancelar</Button>
        <Button onClick={() => file && onSelect?.(file)}>Selecionar</Button>
      </div>
    </Modal>
  );
};
export default ProductImageSelector;
