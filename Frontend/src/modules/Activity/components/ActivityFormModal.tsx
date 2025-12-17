import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { X } from 'lucide-react';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose??: (e: any) => void;
  activity?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({ isOpen,
  onClose,
  activity,
   }) => {
  if (!isOpen) return null;

  return (
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h2 className="text-xl font-bold" />
            {activity ? 'Editar Atividade' : 'Nova Atividade'}
          </h2>
          <Button variant="ghost" size="sm" onClick={ onClose } />
            <X className="h-4 w-4" /></Button></div>

        <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium mb-2">Tipo</label>
            <select className="w-full px-3 py-2 border rounded-lg" />
              <option>Info</option>
              <option>Error</option>
              <option>Security</option>
              <option>Success</option></select></div>

          <div>
           
        </div><label className="block text-sm font-medium mb-2">Descrição</label>
            <Input placeholder="Descrição da atividade" / /></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Usuário</label>
            <Input placeholder="ID do usuário" / /></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Propriedades (JSON)</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              rows={ 4 }
              placeholder='{"key": "value"}'
            / /></div><div className=" ">$2</div><Button variant="outline" onClick={ onClose } />
            Cancelar
          </Button>
          <Button onClick={ onClose } />
            Salvar
          </Button></div></div>);};
