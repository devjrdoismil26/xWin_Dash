import React, { useState, useCallback } from 'react';
import { Save, X } from 'lucide-react';
import { ProductFormBasicInfo, ProductFormMedia, ProductFormPricing, ProductFormContent, ProductFormSEO, ProductFormSocial } from './ProductForm';

interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  status: 'draft' | 'published' | 'archived';
  images: File[];
  videos: File[];
  tags: string[];
  variants: Array<{
    id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  sku: string; }>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;};

  features: string[];
  benefits: string[];
  testimonials: Array<{
    id: string;
    customerName: string;
    customerAvatar?: string;
    rating: number;
    comment: string;
    verified: boolean;
  }>;
  faq: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

interface EnhancedProductFormProps {
  product?: Partial<ProductFormData>;
  onSubmit?: (e: any) => void;
  onCancel??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const EnhancedProductForm: React.FC<EnhancedProductFormProps> = ({ product,
  onSubmit,
  onCancel
   }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    price: product?.price || 0,
    originalPrice: product?.originalPrice,
    category: product?.category || '',
    status: product?.status || 'draft',
    images: product?.images || [],
    videos: product?.videos || [],
    tags: product?.tags || [],
    variants: product?.variants || [],
    seo: product?.seo || {
      title: '',
      description: '',
      keywords: [],
      slug: ''
    },
    features: product?.features || [''],
    benefits: product?.benefits || [''],
    testimonials: product?.testimonials || [],
    faq: product?.faq || []
  });

  const [currentSection, setCurrentSection] = useState('basic');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const sections = [
    { id: 'basic', name: 'Básico' },
    { id: 'media', name: 'Mídia' },
    { id: 'pricing', name: 'Preços' },
    { id: 'content', name: 'Conteúdo' },
    { id: 'seo', name: 'SEO' },
    { id: 'social', name: 'Social' }
  ];

  const handleFieldChange = useCallback((field: string, value: unknown) => {
    setFormData(prev => {
      const keys = field.split('.');

      if (keys.length === 1) {
        return { ...prev, [field]: value};

      }
      
      const newData = { ...prev};

      let current: unknown = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });

  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.description) newErrors.description = 'Descrição é obrigatória';
    if (!formData.category) newErrors.category = 'Categoria é obrigatória';
    if (formData.price <= 0) newErrors.price = 'Preço deve ser maior que zero';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);

    } ;

  const renderSection = () => {
    switch (currentSection) {
      case 'basic':
        return (
                  <ProductFormBasicInfo
            formData={ formData }
            onChange={ handleFieldChange }
            errors={ errors }
          / />);

      case 'media':
        return (
                  <ProductFormMedia
            formData={ formData }
            onChange={ handleFieldChange }
          / />);

      case 'pricing':
        return (
                  <ProductFormPricing
            formData={ formData }
            onChange={ handleFieldChange }
            errors={ errors }
          / />);

      case 'content':
        return (
                  <ProductFormContent
            formData={ formData }
            onChange={ handleFieldChange }
          / />);

      case 'seo':
        return (
                  <ProductFormSEO
            formData={ formData }
            onChange={ handleFieldChange }
          / />);

      case 'social':
        return (
                  <ProductFormSocial
            formData={ formData }
            onChange={ handleFieldChange }
          / />);

      default:
        return null;
    } ;

  return (
        <>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6" />
      <div className=" ">$2</div><h2 className="text-2xl font-bold mb-2" />
          {product ? 'Editar Produto' : 'Novo Produto'}
        </h2>
        <p className="text-gray-600" />
          Preencha as informações do produto
        </p>
      </div>

      {/* Tabs */}
      <div className="{sections.map((section: unknown) => (">$2</div>
          <button
            key={ section.id }
            type="button"
            onClick={ () => setCurrentSection(section.id) }
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              currentSection === section.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } `}
  >
            {section.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="{renderSection()}">$2</div>
      </div>

      {/* Actions */}
      <div className=" ">$2</div><button
          type="button"
          onClick={ onCancel }
          className="flex items-center gap-2 px-6 py-2 border rounded-lg hover:bg-gray-50" />
          <X className="w-4 h-4" />
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" />
          <Save className="w-4 h-4" />
          Salvar Produto
        </button></div></form>);};

export default EnhancedProductForm;
