import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Textarea from '@/shared/components/ui/Textarea';
import SimpleSelect from '@/shared/components/ui/SimpleSelect';
import { ArrowLeft, Save, Palette, FolderTree } from 'lucide-react';
const PREDEFINED_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];
interface CategoryCreateEditProps {
  auth?: Record<string, any>;
  category?: Record<string, any>;
  categories?: string[];
  isEdit?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const CategoryCreateEdit: React.FC<CategoryCreateEditProps> = ({ auth, 
  category = null, 
  categories = [] as unknown[],
  isEdit = false 
   }) => {
  const { data, setData, post, put, processing, errors } = useForm({
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#3B82F6',
    status: category?.status || 'active',
    parent_id: category?.parent_id || '',
    slug: category?.slug || '',
    meta_title: category?.meta_title || '',
    meta_description: category?.meta_description || '',
    sort_order: category?.sort_order || 0
  });

  const [customColor, setCustomColor] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && category) {
      put(`/categorization/categories/${category.id}`);

    } else {
      post('/categorization/categories');

    } ;

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();};

  const handleNameChange = (name: string) => {
    setData('name', name);

    if (!isEdit || !data.slug) {
      setData('slug', generateSlug(name));

    } ;

  // Filtrar categorias para não incluir a atual (evitar loop)
  const availableParents = (categories || []).filter(cat => 
    !isEdit || cat.id !== category?.id);

  return (
            <AppLayout
      title={ isEdit ? 'Editar Categoria' : 'Nova Categoria' }
      subtitle={isEdit ? `Editando: ${category?.name}` : 'Criar uma nova categoria'}
      showSidebar={ true }
      showBreadcrumbs={ true }
      breadcrumbs={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Categorização', href: '/categorization' },
        { name: 'Categorias', href: '/categorization/categories' },
        { name: isEdit ? 'Editar' : 'Criar', current: true }
      ]}
      actions={ <Button 
          variant="outline" 
          onClick={() => router.visit('/categorization/categories')  }>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
  }
  >
      <Head title={`${isEdit ? 'Editar' : 'Nova'} Categoria - xWin Dash`} / />
      <form onSubmit={handleSubmit} className="space-y-6" />
        <div className="{/* Informações Principais */}">$2</div>
          <div className=" ">$2</div><Card />
              <Card.Header />
                <Card.Title>Informações Básicas</Card.Title>
                <Card.Description />
                  Configure as informações principais da categoria
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4" />
                <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Nome da Categoria *
                  </label>
                  <Input
                    type="text"
                    value={ data.name }
                    onChange={ (e: unknown) => handleNameChange(e.target.value) }
                    placeholder="Ex: Tecnologia, Marketing, Vendas..."
                    className={errors.name ? 'border-red-500' : '' } />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Slug (URL)
                  </label>
                  <Input
                    type="text"
                    value={ data.slug }
                    onChange={ (e: unknown) => setData('slug', e.target.value) }
                    placeholder="tecnologia-marketing"
                    className={errors.slug ? 'border-red-500' : '' } />
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1" />
                    URL amigável para a categoria
                  </p></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Descrição
                  </label>
                  <Textarea
                    value={ data.description }
                    onChange={ (e: unknown) => setData('description', e.target.value) }
                    placeholder="Descreva o propósito desta categoria..."
                    rows={ 3 }
                    className={errors.description ? 'border-red-500' : '' } />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
                <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                      Categoria Pai
                    </label>
                    <SimpleSelect
                      value={ data.parent_id }
                      onChange={ (e: unknown) => setData('parent_id', e.target.value) }
                      className={errors.parent_id ? 'border-red-500' : ''  }>
                      <option value="">Nenhuma (Categoria Principal)</option>
                      {(availableParents || []).map((parent: unknown) => (
                        <option key={parent.id} value={ parent.id } />
                          {parent.name}
                        </option>
                      ))}
                    </SimpleSelect>
                    {errors.parent_id && (
                      <p className="text-red-500 text-sm mt-1">{errors.parent_id}</p>
                    )}
                  </div>
                  <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                      Ordem de Exibição
                    </label>
                    <Input
                      type="number"
                      value={ data.sort_order }
                      onChange={ (e: unknown) => setData('sort_order', parseInt(e.target.value) || 0) }
                      placeholder="0"
                      className={errors.sort_order ? 'border-red-500' : '' } />
                    {errors.sort_order && (
                      <p className="text-red-500 text-sm mt-1">{errors.sort_order}</p>
                    )}
                  </div>
              </Card.Content>
            </Card>
            {/* SEO */}
            <Card />
              <Card.Header />
                <Card.Title>SEO & Meta Tags</Card.Title>
                <Card.Description />
                  Otimize a categoria para mecanismos de busca
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4" />
                <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Meta Título
                  </label>
                  <Input
                    type="text"
                    value={ data.meta_title }
                    onChange={ (e: unknown) => setData('meta_title', e.target.value) }
                    placeholder="Título para SEO (60 caracteres)"
                    maxLength={ 60 }
                    className={errors.meta_title ? 'border-red-500' : '' } />
                  {errors.meta_title && (
                    <p className="text-red-500 text-sm mt-1">{errors.meta_title}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1" />
                    {data.meta_title.length}/60 caracteres
                  </p></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Meta Descrição
                  </label>
                  <Textarea
                    value={ data.meta_description }
                    onChange={ (e: unknown) => setData('meta_description', e.target.value) }
                    placeholder="Descrição para SEO (160 caracteres)"
                    maxLength={ 160 }
                    rows={ 3 }
                    className={errors.meta_description ? 'border-red-500' : '' } />
                  {errors.meta_description && (
                    <p className="text-red-500 text-sm mt-1">{errors.meta_description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1" />
                    {data.meta_description.length}/160 caracteres
                  </p></div></Card.Content></Card></div>
          {/* Configurações */}
          <div className=" ">$2</div><Card />
              <Card.Header />
                <Card.Title>Configurações</Card.Title>
                <Card.Description />
                  Status e aparência da categoria
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4" />
                <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Status
                  </label>
                  <SimpleSelect
                    value={ data.status }
                    onChange={ (e: unknown) => setData('status', e.target.value) }
                    className={errors.status ? 'border-red-500' : ''  }>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="archived">Arquivado</option>
                  </SimpleSelect>
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                  )}
                </div>
                <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    <Palette className="h-4 w-4 inline mr-1" />
                    Cor da Categoria
                  </label>
                  {!customColor ? (
                    <div className=" ">$2</div><div className="{(PREDEFINED_COLORS || []).map((color: unknown) => (">$2</div>
                          <button
                            key={ color }
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${
                              (data as any).color === color ? 'border-gray-900' : 'border-gray-300'
                            } `}
                            style={backgroundColor: color } onClick={ () => setData('color', color) } />
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={ () => setCustomColor(true)  }>
                        Cor Personalizada
                      </Button>
      </div>
    </>
  ) : (
                    <div className=" ">$2</div><Input
                        type="color"
                        value={ data.color }
                        onChange={ (e: unknown) => setData('color', e.target.value) }
                        className="w-full h-10" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={ () => setCustomColor(false)  }>
                        Cores Predefinidas
                      </Button>
      </div>
    </>
  )}
                  <div className=" ">$2</div><div 
                      className="w-4 h-4 rounded-full" 
                      style={backgroundColor: (data as any).color } />
           
        </div><span className="text-sm text-gray-600">Eye da cor</span></div></Card.Content>
            </Card>
            {/* Eye */}
            <Card />
              <Card.Header />
                <Card.Title>Eye</Card.Title>
                <Card.Description />
                  Como a categoria aparecerá
                </Card.Description>
              </Card.Header>
              <Card.Content />
                <div className=" ">$2</div><div className=" ">$2</div><div 
                      className="w-4 h-4 rounded-full" 
                      style={backgroundColor: (data as any).color } />
           
        </div><div>
           
        </div><h4 className="font-semibold" />
                        {data.name || 'Nome da Categoria'}
                      </h4>
                      {data.description && (
                        <p className="text-sm text-gray-600 mt-1" />
                          {data.description}
                        </p>
                      )}
                    </div></div></Card.Content></Card></div>
        {/* Ações */}
        <Card />
          <Card.Content className="p-6" />
            <div className=" ">$2</div><Button
                type="button"
                variant="outline"
                onClick={ () => router.visit('/categorization/categories')  }>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={ processing }
                className="min-w-[120px]" />
                {processing ? (
                  'Salvando...'
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEdit ? 'Atualizar' : 'Criar'} Categoria
                  </>
                )}
              </Button></div></Card.Content></Card></form>
    </AppLayout>);};

export default CategoryCreateEdit;
