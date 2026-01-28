import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from "@/components/ui/Card";
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { ArrowLeft, Save, Hash, Palette } from 'lucide-react';
const PREDEFINED_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
  '#64748B', '#DC2626', '#059669', '#D97706', '#7C3AED'
];
const TagCreateEdit: React.FC<{ 
  auth?: any; 
  tag?: any;
  isEdit?: boolean;
}> = ({ 
  auth, 
  tag = null, 
  isEdit = false 
}) => {
  const { data, setData, post, put, processing, errors } = useForm({
    name: tag?.name || '',
    description: tag?.description || '',
    color: tag?.color || '#3B82F6',
    slug: tag?.slug || ''
  });
  const [customColor, setCustomColor] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && tag) {
      put(`/categorization/tags/${tag.id}`);
    } else {
      post('/categorization/tags');
    }
  };
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };
  const handleNameChange = (name: string) => {
    setData('name', name);
    if (!isEdit || !data.slug) {
      setData('slug', generateSlug(name));
    }
  };
  return (
    <AppLayout
      title={isEdit ? 'Editar Tag' : 'Nova Tag'}
      subtitle={isEdit ? `Editando: #${tag?.name}` : 'Criar uma nova tag'}
      showSidebar={true}
      showBreadcrumbs={true}
      breadcrumbs={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Categorização', href: '/categorization' },
        { name: 'Tags', href: '/categorization/tags' },
        { name: isEdit ? 'Editar' : 'Criar', current: true }
      ]}
      actions={
        <Button 
          variant="outline" 
          onClick={() => router.visit('/categorization/tags')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      }
    >
      <Head title={`${isEdit ? 'Editar' : 'Nova'} Tag - xWin Dash`} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <Card.Title>Informações da Tag</Card.Title>
                <Card.Description>
                  Configure as informações básicas da tag
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Tag *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      value={data.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Ex: marketing, vendas, tecnologia..."
                      className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Use nomes curtos e descritivos para facilitar a busca
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL)
                  </label>
                  <Input
                    type="text"
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                    placeholder="marketing-digital"
                    className={errors.slug ? 'border-red-500' : ''}
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    URL amigável para a tag
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <Textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Descreva quando usar esta tag..."
                    rows={4}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Ajude outros usuários a entender quando usar esta tag
                  </p>
                </div>
              </Card.Content>
            </Card>
          </div>
          {/* Configurações */}
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title>Aparência</Card.Title>
                <Card.Description>
                  Personalize a cor da tag
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Palette className="h-4 w-4 inline mr-1" />
                    Cor da Tag
                  </label>
                  {!customColor ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-5 gap-2">
                        {PREDEFINED_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${
                              data.color === color ? 'border-gray-900' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setData('color', color)}
                          />
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCustomColor(true)}
                      >
                        Cor Personalizada
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Input
                        type="color"
                        value={data.color}
                        onChange={(e) => setData('color', e.target.value)}
                        className="w-full h-10"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCustomColor(false)}
                      >
                        Cores Predefinidas
                      </Button>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>
            {/* Preview */}
            <Card>
              <Card.Header>
                <Card.Title>Preview</Card.Title>
                <Card.Description>
                  Como a tag aparecerá
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {/* Preview como badge */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Como Badge:</p>
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: data.color }}
                    >
                      #{data.name || 'nome-da-tag'}
                    </span>
                  </div>
                  {/* Preview como outline */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Como Outline:</p>
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2"
                      style={{ 
                        borderColor: data.color,
                        color: data.color
                      }}
                    >
                      #{data.name || 'nome-da-tag'}
                    </span>
                  </div>
                  {/* Preview em lista */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Em Lista:</p>
                    <div className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: data.color }}
                        />
                        <span className="text-sm">
                          #{data.name || 'nome-da-tag'}
                        </span>
                      </div>
                      {data.description && (
                        <p className="text-xs text-gray-600 mt-1 ml-5">
                          {data.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
            {/* Estatísticas (apenas para edição) */}
            {isEdit && tag && (
              <Card>
                <Card.Header>
                  <Card.Title>Estatísticas</Card.Title>
                  <Card.Description>
                    Uso da tag no sistema
                  </Card.Description>
                </Card.Header>
                <Card.Content className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total de usos:</span>
                    <span className="font-semibold">{tag.usage_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Criado em:</span>
                    <span className="font-semibold">
                      {new Date(tag.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {tag.last_used_at && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Último uso:</span>
                      <span className="font-semibold">
                        {new Date(tag.last_used_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </Card.Content>
              </Card>
            )}
          </div>
        </div>
        {/* Ações */}
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.visit('/categorization/tags')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="min-w-[120px]"
              >
                {processing ? (
                  'Salvando...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEdit ? 'Atualizar' : 'Criar'} Tag
                  </>
                )}
              </Button>
            </div>
          </Card.Content>
        </Card>
      </form>
    </AppLayout>
  );
};
export default TagCreateEdit;
