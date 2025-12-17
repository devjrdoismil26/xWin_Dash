import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { X } from 'lucide-react';

interface ADSToolFormModalProps {
  isOpen: boolean;
  onClose??: (e: any) => void;
  campaign?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ADSToolFormModal: React.FC<ADSToolFormModalProps> = ({ isOpen,
  onClose,
  campaign,
   }) => {
  if (!isOpen) return null;

  return (
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h2 className="text-xl font-bold" />
            {campaign ? 'Editar Campanha' : 'Nova Campanha'}
          </h2>
          <Button variant="ghost" size="sm" onClick={ onClose } />
            <X className="h-4 w-4" /></Button></div>

        <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium mb-2">Nome da Campanha</label>
              <Input placeholder="Ex: Campanha de Verão 2024" / /></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Plataforma</label>
              <select className="w-full px-3 py-2 border rounded-lg" />
                <option>Google Ads</option>
                <option>LinkedIn Ads</option>
                <option>Facebook Ads</option></select></div>

            <div>
           
        </div><label className="block text-sm font-medium mb-2">Orçamento Diário</label>
              <Input type="number" placeholder="0.00" / /></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Orçamento Total</label>
              <Input type="number" placeholder="0.00" / /></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Data de Início</label>
              <Input type="date" / /></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Data de Término</label>
              <Input type="date" / /></div><div className=" ">$2</div><label className="block text-sm font-medium mb-2">Objetivo</label>
              <select className="w-full px-3 py-2 border rounded-lg" />
                <option>Conversões</option>
                <option>Tráfego</option>
                <option>Reconhecimento de Marca</option>
                <option>Geração de Leads</option></select></div>

            <div className=" ">$2</div><label className="block text-sm font-medium mb-2">Público-alvo</label>
              <Input placeholder="Descreva o público-alvo" / /></div><div className=" ">$2</div><label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                rows={ 4 }
                placeholder="Descrição da campanha"
              / /></div></div>

        <div className=" ">$2</div><Button variant="outline" onClick={ onClose } />
            Cancelar
          </Button>
          <Button onClick={ onClose } />
            Salvar Campanha
          </Button></div></div>);};
