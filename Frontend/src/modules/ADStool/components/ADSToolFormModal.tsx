import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { X } from 'lucide-react';

interface ADSToolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign?: any;
}

export const ADSToolFormModal: React.FC<ADSToolFormModalProps> = ({ 
  isOpen,
  onClose,
  campaign,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {campaign ? 'Editar Campanha' : 'Nova Campanha'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome da Campanha</label>
            <Input placeholder="Ex: Campanha de Verão 2024" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Plataforma</label>
            <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Google Ads</option>
              <option>LinkedIn Ads</option>
              <option>Facebook Ads</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Orçamento</label>
            <Input type="number" placeholder="0.00" />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button className="flex-1">
              {campaign ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ADSToolFormModal;
