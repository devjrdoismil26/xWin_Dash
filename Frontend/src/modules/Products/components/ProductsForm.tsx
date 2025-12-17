// =========================================
// PRODUCTS FORM - FORMULÁRIO DE PRODUTOS
// =========================================
// Componente de formulário para criação/edição de produtos
// Máximo: 200 linhas

import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Input } from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { getErrorMessage } from '@/utils/errorHelpers';
import { X, Plus, Image, Plus, X } from 'lucide-react';

interface ProductsFormProps {
  productId?: string;
  onSave??: (e: any) => void;
  onCancel???: (e: any) => void;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ProductsForm: React.FC<ProductsFormProps> = ({ productId,
  onSave,
  onCancel,
  loading = false,
  className = ''
   }) => {
  const { 
    currentProduct, 
    loadProduct, 
    createProduct, 
    updateProduct,
    optimization 
  } = useProducts();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sku: '',
    tags: [] as string[],
    status: 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================
  // EFEITOS
  // =========================================

  useEffect(() => {
    if (productId) {
      loadProduct(productId);

    } , [productId, loadProduct]);

  useEffect(() => {
    if (currentProduct) {
      setFormData({
        name: currentProduct.name || '',
        description: currentProduct.description || '',
        price: currentProduct.price?.toString() || '',
        category: currentProduct.category || '',
        sku: currentProduct.sku || '',
        tags: currentProduct.tags || [],
        status: currentProduct.status || 'active'
      });

    } , [currentProduct]);

  // =========================================
  // HANDLERS
  // =========================================

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));

    } ;

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));

    } ;

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
  }));};

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {} as any;

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU é obrigatório';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price)};

      let result;
      if (productId) {
        result = await updateProduct(productId, productData);

      } else {
        result = await createProduct(productData);

      }

      if (result.success) {
        onSave?.(result.data);

      } else {
        setErrors({ submit: result.error || 'Erro ao salvar produto' });

      } catch (error: unknown) {
      setErrors({ submit: getErrorMessage(error) });

    } finally {
      setIsSubmitting(false);

    } ;

  // =========================================
  // RENDERIZAÇÃO
  // =========================================

  return (
        <>
      <div className={`products-form ${className} `}>
      </div><form onSubmit={handleSubmit} className="space-y-6" />
        {/* Informações básicas */}
        <Card className="p-6" />
          <h3 className="text-lg font-semibold text-gray-900 mb-4" />
            Informações Básicas
          </h3>
          
          <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                Nome do Produto *
              </label>
              <Input
                value={ formData.name }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value) }
                placeholder="Digite o nome do produto"
                error={ errors.name }
                disabled={ loading || isSubmitting } /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                SKU *
              </label>
              <Input
                value={ formData.sku }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('sku', e.target.value) }
                placeholder="Digite o SKU"
                error={ errors.sku }
                disabled={ loading || isSubmitting } /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                Preço *
              </label>
              <Input
                type="number"
                step="0.01"
                value={ formData.price }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('price', e.target.value) }
                placeholder="0.00"
                error={ errors.price }
                disabled={ loading || isSubmitting } /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                Categoria *
              </label>
              <Select
                value={ formData.category }
                onChange={ (value: unknown) => handleInputChange('category', value) }
                placeholder="Selecione uma categoria"
                error={ errors.category }
                disabled={ loading || isSubmitting  }>
                <option value="">Selecione uma categoria</option>
                <option value="electronics">Eletrônicos</option>
                <option value="clothing">Roupas</option>
                <option value="books">Livros</option>
                <option value="home">Casa</option></Select></div>

            <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                Status
              </label>
              <Select
                value={ formData.status }
                onChange={ (value: unknown) => handleInputChange('status', value) }
                disabled={ loading || isSubmitting  }>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="draft">Rascunho</option></Select></div>

          <div className=" ">$2</div><label className="block text-sm font-medium text-gray-700 mb-2" />
              Descrição
            </label>
            <textarea
              value={ formData.description }
              onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('description', e.target.value) }
              placeholder="Digite a descrição do produto"
              rows={ 4 }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={ loading || isSubmitting } /></div></Card>

        {/* Tags */}
        <Card className="p-6" />
          <h3 className="text-lg font-semibold text-gray-900 mb-4" />
            Tags
          </h3>
          
          <div className=" ">$2</div><div className=" ">$2</div><Input
                placeholder="Digite uma tag"
                onKeyPress={ (e: unknown) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();

                    handleTagAdd((e.target as HTMLInputElement).value);

                    (e.target as HTMLInputElement).value = '';
                   } }
                disabled={ loading || isSubmitting } />
              <Button
                type="button"
                variant="outline"
                onClick={ () => {
                  const input = document.querySelector('input[placeholder="Digite uma tag"]')! as HTMLInputElement;
                  if (input?.value) {
                    handleTagAdd(input.value);

                    input.value = '';
                   } }
                disabled={ loading || isSubmitting  }>
                <Plus className="h-4 w-4" /></Button></div>

            {formData.tags.length > 0 && (
              <div className="{(formData.tags || []).map((tag: unknown, index: unknown) => (">$2</div>
                  <Badge
                    key={ index }
                    variant="secondary"
                    className="flex items-center space-x-1" />
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={ () => handleTagRemove(tag) }
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" /></button></Badge>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Erro de submit */}
        {errors.submit && (
          <ErrorState
            title="Erro ao salvar"
            message={ errors.submit }
            className="mb-4"
          / />
        )}

        {/* Ações */}
        <div className=" ">$2</div><Button
            type="button"
            variant="outline"
            onClick={ onCancel }
            disabled={ loading || isSubmitting } />
            Cancelar
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={ loading || isSubmitting }
            className="flex items-center space-x-2" />
            {isSubmitting && <LoadingSpinner size="small" />}
            <span>{productId ? 'Atualizar' : 'Criar'} Produto</span></Button></div></form></div>);};

export default ProductsForm;
