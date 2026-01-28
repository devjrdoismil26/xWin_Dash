import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Textarea from '@/components/ui/Textarea';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
const ProductsCreateEdit: React.FC<{ product?: any }> = ({ product }) => {
  const isEditing = Boolean(product);
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    status: product?.status || 'draft',
    category_id: product?.category_id || '',
  });
  const submit = (e?: React.FormEvent) => {
    e?.preventDefault?.();
  };
  return (
    <AuthenticatedLayout>
      <Head title={isEditing ? `Editar Produto: ${product?.name || ''}` : 'Criar Novo Produto'} />
      <div className="py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <Card.Header>
              <Card.Title>{isEditing ? 'Editar Produto' : 'Novo Produto'}</Card.Title>
            </Card.Header>
            <Card.Content>
              <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputLabel htmlFor="name">Nome</InputLabel>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome do produto" />
                  </div>
                  <div>
                    <InputLabel htmlFor="price">Preço</InputLabel>
                    <Input id="price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <InputLabel htmlFor="description">Descrição</InputLabel>
                  <Textarea id="description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descreva o produto..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <InputLabel htmlFor="status">Status</InputLabel>
                    <Select
                      id="status"
                      value={form.status}
                      onChange={(val) => setForm({ ...form, status: String(val) })}
                      options={[
                        { value: 'draft', label: 'Rascunho' },
                        { value: 'active', label: 'Ativo' },
                        { value: 'inactive', label: 'Inativo' },
                      ]}
                    />
                  </div>
                  <div>
                    <InputLabel htmlFor="category">Categoria</InputLabel>
                    <Select
                      id="category"
                      value={form.category_id}
                      onChange={(val) => setForm({ ...form, category_id: String(val) })}
                      options={[
                        { value: '', label: 'Selecione' },
                      ]}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" type="button">Cancelar</Button>
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </Card.Content>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};
export default ProductsCreateEdit;
