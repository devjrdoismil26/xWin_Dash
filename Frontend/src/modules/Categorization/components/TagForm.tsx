import React, { useState } from 'react';
export type TagType = 'general' | 'lead_source' | 'interest' | 'priority' | 'status' | 'custom';
type TagFormProps = {
  tag?: {
    id?: number | string;
    name?: string;
    description?: string;
    type?: TagType;
    project_id?: string | number;
    color?: string;
  } | null;
  onSave?: (data: any) => void;
  onCancel?: () => void;
};
const TagForm: React.FC<TagFormProps> = ({ tag = null, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: tag?.name || '',
    description: tag?.description || '',
    type: (tag?.type as TagType) || 'general',
    project_id: tag?.project_id?.toString() || '',
    color: tag?.color || '#3b82f6',
  });
  const submit = (e?: React.FormEvent) => {
    e?.preventDefault?.();
    onSave?.(form);
  };
  return (
    <form className="space-y-3" onSubmit={submit}>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">Nome *</label>
        <input id="name" className="w-full border rounded p-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="description">Descrição</label>
        <textarea id="description" className="w-full border rounded p-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="type">Tipo</label>
        <select id="type" className="w-full border rounded p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TagType })}>
          <option value="general">Geral</option>
          <option value="lead_source">Origem</option>
          <option value="interest">Interesse</option>
          <option value="priority">Prioridade</option>
          <option value="status">Status</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="project_id">Projeto</label>
        <select id="project_id" className="w-full border rounded p-2" value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })}>
          <option value="">Selecione</option>
          <option value="1">Projeto 1</option>
          <option value="2">Projeto 2</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="color">Cor</label>
        <input id="color" type="color" className="w-16 h-10 p-0 border rounded" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
      </div>
      <div className="flex gap-2">
        <button type="button" className="px-3 py-2 border rounded" onClick={() => onCancel?.()}>Cancelar</button>
        <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Salvar</button>
      </div>
    </form>
  );
};
export default TagForm;
