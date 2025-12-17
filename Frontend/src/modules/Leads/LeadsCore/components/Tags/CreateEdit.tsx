import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Textarea from '@/shared/components/ui/Textarea';
import { ArrowLeft, Save, Hash, Palette } from 'lucide-react';
import { AuthUser, Tag } from '@/types/common';

const PREDEFINED_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
  '#64748B', '#DC2626', '#059669', '#D97706', '#7C3AED'
];
const TagCreateEdit: React.FC<{ 
  auth?: AuthUser; 
  tag?: Tag | null;
  isEdit?: boolean;
}> = ({ auth, 
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

  return (
            <AppLayout
      title={ isEdit ? 'Editar Tag' : 'Nova Tag' }
      subtitle={isEdit ? `Editando: #${tag?.name}` : 'Criar uma nova tag'}
      showSidebar={ true }
      showBreadcrumbs={ true }
      breadcrumbs={[
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Categorização', href: '/categorization' },
        { name: 'Tags', href: '/categorization/tags' },
        { name: isEdit ? 'Editar' : 'Criar', current: true }
      ]}
      actions={ <Button 
          variant="outline" 
          onClick={() => router.visit('/categorization/tags')  }>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
  }
  >
      <Head title={`${isEdit ? 'Editar' : 'Nova'} Tag - xWin Dash`} / />
      <form onSubmit={handleSubmit} className="space-y-6" />
        <div className="{/* Informações Principais */}">$2</div>
          <div className=" ">$2</div><Card />
              <Card.Header />
                <Card.Title>Informações da Tag</Card.Title>
                <Card.Description />
                  Configure as informações básicas da tag
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4" />
                <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Nome da Tag *
                  </label>
                  <div className=" ">$2</div><Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      value={ data.name }
                      onChange={ (e: unknown) => handleNameChange(e.target.value) }
                      placeholder="Ex: marketing, vendas, tecnologia..."
                      className={`pl-10 ${errors.name ? 'border-red-500' : ''} `} />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1" />
                    Use nomes curtos e descritivos para facilitar a busca
                  </p></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Slug (URL)
                  </label>
                  <Input
                    type="text"
                    value={ data.slug }
                    onChange={ (e: unknown) => setData('slug', e.target.value) }
                    placeholder="marketing-digital"
                    className={errors.slug ? 'border-red-500' : '' } />
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1" />
                    URL amigável para a tag
                  </p></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Descrição
                  </label>
                  <Textarea
                    value={ data.description }
                    onChange={ (e: unknown) => setData('description', e.target.value) }
                    placeholder="Descreva quando usar esta tag..."
                    rows={ 4 }
                    className={errors.description ? 'border-red-500' : '' } />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1" />
                    Ajude outros usuários a entender quando usar esta tag
                  </p></div></Card.Content></Card></div>
          {/* Configurações */}
          <div className=" ">$2</div><Card />
              <Card.Header />
                <Card.Title>Aparência</Card.Title>
                <Card.Description />
                  Personalize a cor da tag
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4" />
                <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    <Palette className="h-4 w-4 inline mr-1" />
                    Cor da Tag
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
                </div>
              </Card.Content>
            </Card>
            {/* Eye */}
            <Card />
              <Card.Header />
                <Card.Title>Eye</Card.Title>
                <Card.Description />
                  Como a tag aparecerá
                </Card.Description>
              </Card.Header>
              <Card.Content />
                <div className="{/* Eye como badge */}">$2</div>
                  <div>
           
        </div><p className="text-sm font-medium text-gray-700 mb-2">Como Badge:</p>
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={backgroundColor: (data as any).color } >
          #
        </span>{data.name || 'nome-da-tag'}
                    </span>
                  </div>
                  {/* Eye como outline */}
                  <div>
           
        </div><p className="text-sm font-medium text-gray-700 mb-2">Como Outline:</p>
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2"
                      style={borderColor: (data as any).color,
                        color: (data as any).color
                      } >
          #
        </span>{data.name || 'nome-da-tag'}
                    </span>
                  </div>
                  {/* Eye em lista */}
                  <div>
           
        </div><p className="text-sm font-medium text-gray-700 mb-2">Em Lista:</p>
                    <div className=" ">$2</div><div className=" ">$2</div><div 
                          className="w-3 h-3 rounded-full" 
                          style={backgroundColor: (data as any).color } />
           
        </div><span className="#{data.name || 'nome-da-tag'}">$2</span>
                        </span>
                      </div>
                      {data.description && (
                        <p className="text-xs text-gray-600 mt-1 ml-5" />
                          {data.description}
                        </p>
                      )}
                    </div></div></Card.Content>
            </Card>
            {/* Estatísticas (apenas para edição) */}
            {isEdit && tag && (
              <Card />
                <Card.Header />
                  <Card.Title>Estatísticas</Card.Title>
                  <Card.Description />
                    Uso da tag no sistema
                  </Card.Description>
                </Card.Header>
                <Card.Content className="space-y-3" />
                  <div className=" ">$2</div><span className="text-sm text-gray-600">Total de usos:</span>
                    <span className="font-semibold">{tag.usage_count || 0}</span></div><div className=" ">$2</div><span className="text-sm text-gray-600">Criado em:</span>
                    <span className="{new Date(tag.created_at).toLocaleDateString('pt-BR')}">$2</span>
                    </span>
                  </div>
                  {tag.last_used_at && (
                    <div className=" ">$2</div><span className="text-sm text-gray-600">Último uso:</span>
                      <span className="{new Date(tag.last_used_at).toLocaleDateString('pt-BR')}">$2</span>
                      </span>
      </div>
    </>
  )}
                </Card.Content>
      </Card>
    </>
  )}
          </div>
        {/* Ações */}
        <Card />
          <Card.Content className="p-6" />
            <div className=" ">$2</div><Button
                type="button"
                variant="outline"
                onClick={ () => router.visit('/categorization/tags')  }>
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
                    {isEdit ? 'Atualizar' : 'Criar'} Tag
                  </>
                )}
              </Button></div></Card.Content></Card></form>
    </AppLayout>);};

export default TagCreateEdit;
