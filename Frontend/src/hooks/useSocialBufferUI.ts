import { useState } from 'react';

export const useSocialBufferUI = () => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    setIsOpen,
    toggle: () => setIsOpen(!isOpen),};
};
