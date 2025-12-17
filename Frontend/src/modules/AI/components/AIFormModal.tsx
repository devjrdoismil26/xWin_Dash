import React from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { X } from 'lucide-react';

interface AIFormModalProps {
  isOpen: boolean;
  onClose??: (e: any) => void;
  generation?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const AIFormModal: React.FC<AIFormModalProps> = ({ isOpen,
  onClose,
  generation,
   }) => {
  if (!isOpen) return null;

  return (
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h2 className="text-xl font-bold" />
            {generation ? 'Editar Geração' : 'Nova Geração'}
          </h2>
          <Button variant="ghost" size="sm" onClick={ onClose } />
            <X className="h-4 w-4" /></Button></div>

        <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium mb-2">Tipo</label>
            <select className="w-full px-3 py-2 border rounded-lg" />
              <option>Texto</option>
              <option>Imagem</option>
              <option>Chat</option>
              <option>Análise</option></select></div>

          <div>
           
        </div><label className="block text-sm font-medium mb-2">Provider</label>
            <select className="w-full px-3 py-2 border rounded-lg" />
              <option>OpenAI</option>
              <option>Anthropic</option>
              <option>Google</option></select></div>

          <div>
           
        </div><label className="block text-sm font-medium mb-2">Modelo</label>
            <select className="w-full px-3 py-2 border rounded-lg" />
              <option>GPT-4</option>
              <option>GPT-3.5</option>
              <option>Claude 3</option>
              <option>Gemini Pro</option></select></div>

          <div>
           
        </div><label className="block text-sm font-medium mb-2">Prompt</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              rows={ 6 }
              placeholder="Digite seu prompt aqui..."
            / /></div><div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium mb-2">Temperatura</label>
              <Input type="number" step="0.1" min="0" max="2" defaultValue="0.7" / /></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Max Tokens</label>
              <Input type="number" defaultValue="1000" / /></div></div>

        <div className=" ">$2</div><Button variant="outline" onClick={ onClose } />
            Cancelar
          </Button>
          <Button onClick={ onClose } />
            Gerar
          </Button></div></div>);};
