import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Textarea from '@/shared/components/ui/Textarea';
const PromptLibraryDialog = ({ open, onOpenChange, prompts = [] as unknown[], onSelect, onAdd }) => { const [searchTerm, setSearchTerm] = useState('');

  const [newPromptContent, setNewPromptContent] = useState('');

  const filtered = useMemo(() => (prompts || []).filter((p: unknown) => p.content.toLowerCase().includes(searchTerm.toLowerCase())), [prompts, searchTerm]);

  if (!open) return null;
  return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={ () => onOpenChange?.(false)  }>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={ (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()  }>
        <div className=" ">$2</div><h3 className="text-lg font-semibold">Biblioteca de Prompts</h3>
          <div className=" ">$2</div><Input placeholder="Buscar prompts..." value={searchTerm} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value) } /></div><div className="{filtered.length === 0 ? (">$2</div>
              <p className="text-center text-gray-500">Nenhum prompt encontrado.</p>
            ) : (
              (filtered || []).map((p: unknown, i: unknown) => (
                <div key={p.id || i} className="p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-50" onClick={ () => onSelect?.(p.content)  }>
                  <p className="text-sm">{p.content}</p>
      </div>
    </>
  ))
            )}
          </div>
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();

              onAdd?.(newPromptContent);

              setNewPromptContent('');

            } className="space-y-2"
          >
            <Textarea value={newPromptContent} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPromptContent(e.target.value)} placeholder="Digite um novo prompt..." className="min-h-[100px]" />
            <div className=" ">$2</div><Button type="button" variant="outline" onClick={ () => onOpenChange?.(false)  }>
                Fechar
              </Button>
              <Button type="submit">Adicionar</Button></div></form></div></div>);};

PromptLibraryDialog.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  prompts: PropTypes.array,
  onSelect: PropTypes.func,
  onAdd: PropTypes.func,};

export default PromptLibraryDialog;
