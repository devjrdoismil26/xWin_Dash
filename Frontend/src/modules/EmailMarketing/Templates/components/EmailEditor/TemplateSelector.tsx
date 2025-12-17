import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@/shared/components/ui/Modal';
import Button from '@/shared/components/ui/Button';

interface TemplateSelectorProps {
  templates?: Record<string, any>[];
  onSelect??: (e: any) => void;
  onClose???: (e: any) => void;
  isLoading?: boolean;
  isOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates = [] as unknown[], onSelect, onClose, isLoading = false, isOpen = true    }) => {
  const [items, setItems] = useState(templates);

  useEffect(() => setItems(templates), [templates]);

  return (
            <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Selecionar Template" size="md">
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <div className="{(items || []).map((t: unknown) => (">$2</div>
            <Button
              key={ t.id ?? t.name }
              type="button"
              variant="ghost"
              className="w-full justify-start p-2 border rounded hover:bg-gray-50"
              onClick={ () => onSelect?.(t)  }>
              <div className="font-medium">{t.name ?? 'Sem nome'}</div>
              <div className="text-sm text-gray-600">{t.subject ?? ''}</div>
      </Button>
    </>
  ))}
          {items.length === 0 && <p className="text-sm text-gray-500">Nenhum template encontrado</p>}
        </div>
      )}
      <div className=" ">$2</div><Button variant="outline" size="sm" onClick={ () => onClose?.() }>Fechar</Button></div></Modal>);};

TemplateSelector.propTypes = {
  templates: PropTypes.array,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  isLoading: PropTypes.bool,
  isOpen: PropTypes.bool,};

export default TemplateSelector;
