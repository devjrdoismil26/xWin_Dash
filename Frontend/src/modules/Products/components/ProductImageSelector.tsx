import React, { useState } from 'react';
import Modal from '@/shared/components/ui/Modal';
import Button from '@/shared/components/ui/Button';
import FileInput from '@/shared/components/ui/FileInput';
interface ProductImageSelectorProps {
  images?: string[];
  onSelect??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const ProductImageSelector = ({ isOpen = false, onClose, onSelect }) => {
  const [file, setFile] = useState<any>(null);

  return (
            <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Selecionar Imagem" size="md">
      <FileInput accept="image/*" onChange={ (f: unknown) => setFile(Array.isArray(f) ? f[0] : f) } />
      <div className=" ">$2</div><Button variant="outline" className="mr-2" onClick={ () => onClose?.() }>Cancelar</Button>
        <Button onClick={ () => file && onSelect?.(file) }>Selecionar</Button></div></Modal>);};

export default ProductImageSelector;
