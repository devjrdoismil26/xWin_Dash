import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
const PromptLibraryDialog = ({ open, onOpenChange, prompts = [], onSelect, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newPromptContent, setNewPromptContent] = useState('');
  const filtered = useMemo(() => prompts.filter((p) => p.content.toLowerCase().includes(searchTerm.toLowerCase())), [prompts, searchTerm]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => onOpenChange?.(false)}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Biblioteca de Prompts</h3>
          <div className="relative">
                          <Input placeholder="Buscar prompts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="h-64 border rounded-md p-3 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-500">Nenhum prompt encontrado.</p>
            ) : (
              filtered.map((p, i) => (
                <div key={p.id || i} className="p-3 border rounded-md mb-2 cursor-pointer hover:bg-gray-50" onClick={() => onSelect?.(p.content)}>
                  <p className="text-sm">{p.content}</p>
                </div>
              ))
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAdd?.(newPromptContent);
              setNewPromptContent('');
            }}
            className="space-y-2"
          >
            <Textarea value={newPromptContent} onChange={(e) => setNewPromptContent(e.target.value)} placeholder="Digite um novo prompt..." className="min-h-[100px]" />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
                Fechar
              </Button>
              <Button type="submit">Adicionar</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
PromptLibraryDialog.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  prompts: PropTypes.array,
  onSelect: PropTypes.func,
  onAdd: PropTypes.func,
};
export default PromptLibraryDialog;
