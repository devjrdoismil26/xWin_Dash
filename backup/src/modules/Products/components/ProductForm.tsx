import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
const ProductForm = ({ product = null, onSave, onCancel }) => {
  const [form, setForm] = useState({ name: product?.name || '', price: product?.price || '', description: product?.description || '' });
  const submit = (e) => { e?.preventDefault?.(); onSave?.(form); };
  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <InputLabel htmlFor="p-name">Nome</InputLabel>
        <Input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <InputLabel htmlFor="p-price">Preço</InputLabel>
        <Input id="p-price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      </div>
      <div>
        <InputLabel htmlFor="p-desc">Descrição</InputLabel>
        <Textarea id="p-desc" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" type="button" onClick={() => onCancel?.()}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};
export default ProductForm;
