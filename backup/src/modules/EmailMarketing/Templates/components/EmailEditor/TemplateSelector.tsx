import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
const TemplateSelector: React.FC<{templates?: any, onSelect, onClose, isLoading?: any, isOpen?: any}> = ({ templates = [], onSelect, onClose, isLoading = false, isOpen = true }) => {
  const [items, setItems] = useState(templates);
  useEffect(() => setItems(templates), [templates]);
  return (
    <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Selecionar Template" size="md">
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-2">
          {items.map((t) => (
            <Button
              key={t.id ?? t.name}
              type="button"
              variant="ghost"
              className="w-full justify-start p-2 border rounded hover:bg-gray-50"
              onClick={() => onSelect?.(t)}
            >
              <div className="font-medium">{t.name ?? 'Sem nome'}</div>
              <div className="text-sm text-gray-600">{t.subject ?? ''}</div>
            </Button>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500">Nenhum template encontrado</p>}
        </div>
      )}
      <div className="mt-4 text-right">
        <Button variant="outline" size="sm" onClick={() => onClose?.()}>Fechar</Button>
      </div>
    </Modal>
  );
};
TemplateSelector.propTypes = {
  templates: PropTypes.array,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  isLoading: PropTypes.bool,
  isOpen: PropTypes.bool,
};
export default TemplateSelector;
