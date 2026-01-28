import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../../hooks/useTranslation';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useAdvancedNotifications } from '../../../hooks/useAdvancedNotifications';
import { useLoadingStates } from '../../../hooks/useLoadingStates';
import {
  Save, X, Upload, Image, Video, FileText, Tag, Globe,
  Eye, EyeOff, Wand2, BarChart3, Target, DollarSign,
  Plus, Minus, Copy, ExternalLink, Palette, Code,
  Star, Heart, Share2, Settings, Camera, Mic,
  Layers, Grid, Layout, Type, Zap, Sparkles
} from 'lucide-react';
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
  variants: ProductVariant[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
  };
  features: string[];
  benefits: string[];
  testimonials: Testimonial[];
  faq: FAQItem[];
  pricing: PricingOption[];
  deliveryInfo: {
    type: 'instant' | 'scheduled' | 'physical';
    details: string;
  };
  bonuses: Bonus[];
}
interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  sku: string;
  attributes: Record<string, string>;
  images: string[];
}
interface Testimonial {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  verified: boolean;
}
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
interface PricingOption {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  popular: boolean;
  urgency?: {
    type: 'limited_time' | 'limited_quantity' | 'early_bird';
    message: string;
    endDate?: string;
    quantity?: number;
  };
}
interface Bonus {
  id: string;
  name: string;
  value: number;
  description: string;
  image?: string;
}
interface EnhancedProductFormProps {
  product?: any;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}
const EnhancedProductForm: React.FC<EnhancedProductFormProps> = ({
  product,
  onSubmit,
  onCancel
}) => {
  const { t } = useTranslation();
  const { showNotification, showError, showSuccess } = useAdvancedNotifications();
  const { isLoading, setLoading } = useLoadingStates();
  // Estado do formulário
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    category: product?.category || '',
    status: product?.status || 'draft',
    images: [],
    videos: [],
    tags: product?.tags || [],
    variants: product?.variants || [],
    seo: {
      title: product?.seo?.title || '',
      description: product?.seo?.description || '',
      keywords: product?.seo?.keywords || [],
      slug: product?.seo?.slug || ''
    },
    features: product?.features || [''],
    benefits: product?.benefits || [''],
    testimonials: product?.testimonials || [],
    faq: product?.faq || [],
    pricing: product?.pricing || [],
    deliveryInfo: product?.deliveryInfo || {
      type: 'instant',
      details: ''
    },
    bonuses: product?.bonuses || []
  });
  const [currentSection, setCurrentSection] = useState<string>('basic');
  const [previewMode, setPreviewMode] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  // Seções do formulário
  const formSections = [
    { id: 'basic', name: 'Informações Básicas', icon: FileText },
    { id: 'media', name: 'Mídia', icon: Image },
    { id: 'pricing', name: 'Preços & Variações', icon: DollarSign },
    { id: 'content', name: 'Conteúdo', icon: Type },
    { id: 'seo', name: 'SEO & Marketing', icon: Globe },
    { id: 'social', name: 'Prova Social', icon: Star },
    { id: 'delivery', name: 'Entrega & Bônus', icon: Zap }
  ];
  // Validação
  const { validateField, getFieldError, isFormValid } = useFormValidation({
    name: { required: true, minLength: 2 },
    price: { required: true, min: 0 },
    description: { required: true, minLength: 10 },
    category: { required: true }
  });
  // Auto-geração de SEO slug
  useEffect(() => {
    if (formData.name && !product) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          slug,
          title: prev.seo.title || formData.name,
          description: prev.seo.description || formData.shortDescription
        }
      }));
    }
  }, [formData.name, formData.shortDescription, product]);
  // Handlers
  const handleFieldChange = useCallback((field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newData;
      }
    });
  }, []);
  const handleAddFeature = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  }, []);
  const handleRemoveFeature = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  }, []);
  const handleAddBenefit = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  }, []);
  const handleRemoveBenefit = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  }, []);
  const handleAddTag = useCallback((tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  }, [formData.tags]);
  const handleRemoveTag = useCallback((tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  }, []);
  const handleImageUpload = useCallback((files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  }, []);
  const handleAIAssistance = useCallback(async (type: string) => {
    setLoading('ai', true);
    setShowAIAssistant(true);
    try {
      // Simular chamada para IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      const suggestions = {
        description: `${formData.name} é uma solução completa que revoluciona a forma como você trabalha. Com funcionalidades avançadas e interface intuitiva, oferece resultados excepcionais para profissionais exigentes.`,
        features: [
          'Interface intuitiva e moderna',
          'Resultados comprovados',
          'Suporte especializado 24/7',
          'Atualizações constantes',
          'Integração com principais ferramentas'
        ],
        benefits: [
          'Economiza até 5 horas por semana',
          'Aumenta produtividade em 300%',
          'Reduz custos operacionais',
          'Melhora qualidade dos resultados',
          'Acelera tomada de decisões'
        ],
        seoKeywords: ['solução completa', 'produtividade', 'eficiência', 'resultados', 'profissional']
      };
      setAiSuggestions(suggestions);
      showSuccess('IA gerou sugestões personalizadas para seu produto!');
    } catch (error) {
      showError('Erro ao gerar sugestões com IA');
    } finally {
      setLoading('ai', false);
    }
  }, [formData.name, setLoading, showSuccess, showError]);
  const handleApplyAISuggestion = useCallback((field: string, value: any) => {
    handleFieldChange(field, value);
    showSuccess('Sugestão da IA aplicada com sucesso!');
  }, [handleFieldChange, showSuccess]);
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid(formData)) {
      showError('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    setLoading('submit', true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit(formData);
      showSuccess(product ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
    } catch (error) {
      showError('Erro ao salvar produto');
    } finally {
      setLoading('submit', false);
    }
  }, [formData, isFormValid, onSubmit, product, setLoading, showSuccess, showError]);
  const renderBasicSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Produto *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nome atrativo do produto"
          />
          {getFieldError('name') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleFieldChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecionar categoria</option>
            <option value="education">Educação</option>
            <option value="digital-products">Produtos Digitais</option>
            <option value="consulting">Consultoria</option>
            <option value="software">Software</option>
          </select>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Descrição Curta *
          </label>
          <button
            type="button"
            onClick={() => handleAIAssistance('description')}
            className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
          >
            <Wand2 className="h-4 w-4" />
            <span>IA Assistente</span>
          </button>
        </div>
        <textarea
          value={formData.shortDescription}
          onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descrição atrativa em poucas palavras"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Descrição Completa *
          </label>
          <button
            type="button"
            onClick={() => handleAIAssistance('description')}
            className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
          >
            <Wand2 className="h-4 w-4" />
            <span>IA Assistente</span>
          </button>
        </div>
        <textarea
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descrição detalhada do produto, benefícios e diferenciais"
        />
        {getFieldError('description') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('description')}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preço *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleFieldChange('price', Number(e.target.value))}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preço Original
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
            <input
              type="number"
              value={formData.originalPrice}
              onChange={(e) => handleFieldChange('originalPrice', Number(e.target.value))}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>
        </div>
      </div>
    </div>
  );
  const renderContentSection = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Características</h3>
          <button
            type="button"
            onClick={() => handleAIAssistance('features')}
            className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
          >
            <Wand2 className="h-4 w-4" />
            <span>IA Assistente</span>
          </button>
        </div>
        <div className="space-y-3">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...formData.features];
                  newFeatures[index] = e.target.value;
                  handleFieldChange('features', newFeatures);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Interface intuitiva"
              />
              <button
                type="button"
                onClick={() => handleRemoveFeature(index)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddFeature}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar característica</span>
          </button>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Benefícios</h3>
          <button
            type="button"
            onClick={() => handleAIAssistance('benefits')}
            className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700"
          >
            <Wand2 className="h-4 w-4" />
            <span>IA Assistente</span>
          </button>
        </div>
        <div className="space-y-3">
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => {
                  const newBenefits = [...formData.benefits];
                  newBenefits[index] = e.target.value;
                  handleFieldChange('benefits', newBenefits);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Economiza 5 horas por semana"
              />
              <button
                type="button"
                onClick={() => handleRemoveBenefit(index)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddBenefit}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar benefício</span>
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Digite uma tag e pressione Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'basic':
        return renderBasicSection();
      case 'content':
        return renderContentSection();
      default:
        return <div className="text-center py-8 text-gray-500">Seção em desenvolvimento...</div>;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] flex overflow-hidden"
      >
        {/* Sidebar de Navegação */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <nav className="space-y-2">
            {formSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentSection === section.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{section.name}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                previewMode
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="text-sm">
                {previewMode ? 'Sair do Preview' : 'Modo Preview'}
              </span>
            </button>
          </div>
        </div>
        {/* Conteúdo Principal */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {formSections.find(s => s.id === currentSection)?.name}
              </h3>
              {formData.name && (
                <p className="text-sm text-gray-500 mt-1">{formData.name}</p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading.submit}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading.submit ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>Salvar</span>
              </button>
            </div>
          </div>
          {/* Conteúdo do Formulário */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit}>
              {renderCurrentSection()}
            </form>
          </div>
        </div>
        {/* IA Assistant Sidebar */}
        <AnimatePresence>
          {showAIAssistant && aiSuggestions && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-80 bg-gradient-to-b from-purple-50 to-blue-50 border-l border-gray-200 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span>IA Assistente</span>
                </h3>
                <button
                  onClick={() => setShowAIAssistant(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {isLoading.ai ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {aiSuggestions.description && (
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-2">Descrição Sugerida</h4>
                      <p className="text-sm text-gray-600 mb-3">{aiSuggestions.description}</p>
                      <button
                        onClick={() => handleApplyAISuggestion('description', aiSuggestions.description)}
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        Aplicar sugestão
                      </button>
                    </div>
                  )}
                  {aiSuggestions.features && (
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-2">Características Sugeridas</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mb-3">
                        {aiSuggestions.features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleApplyAISuggestion('features', aiSuggestions.features)}
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        Aplicar sugestões
                      </button>
                    </div>
                  )}
                  {aiSuggestions.benefits && (
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-2">Benefícios Sugeridos</h4>
                      <ul className="text-sm text-gray-600 space-y-1 mb-3">
                        {aiSuggestions.benefits.map((benefit, index) => (
                          <li key={index}>• {benefit}</li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleApplyAISuggestion('benefits', aiSuggestions.benefits)}
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        Aplicar sugestões
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
export default EnhancedProductForm;
