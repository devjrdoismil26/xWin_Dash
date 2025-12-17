import React from 'react';
import { Type, Plus, Minus } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string; }

interface ProductFormContentProps {
  formData: {
features: string[];
  benefits: string[];
  faq: FAQItem[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

  onChange?: (e: any) => void;
}

export const ProductFormContent: React.FC<ProductFormContentProps> = ({ formData,
  onChange
   }) => {
  const addFeature = () => {
    onChange('features', [...formData.features, '']);};

  const removeFeature = (index: number) => {
    onChange('features', formData.features.filter((_: unknown, i: unknown) => i !== index));};

  const updateFeature = (index: number, value: string) => {
    onChange('features', formData.features.map((f: unknown, i: unknown) => i === index ? value : f));};

  const addBenefit = () => {
    onChange('benefits', [...formData.benefits, '']);};

  const removeBenefit = (index: number) => {
    onChange('benefits', formData.benefits.filter((_: unknown, i: unknown) => i !== index));};

  const updateBenefit = (index: number, value: string) => {
    onChange('benefits', formData.benefits.map((b: unknown, i: unknown) => i === index ? value : b));};

  const addFAQ = () => {
    const newFAQ: FAQItem = {
      id: Date.now().toString(),
      question: '',
      answer: ''};

    onChange('faq', [...formData.faq, newFAQ]);};

  const removeFAQ = (id: string) => {
    onChange('faq', formData.faq.filter(f => f.id !== id));};

  const updateFAQ = (id: string, field: string, value: string) => {
    onChange('faq', formData.faq.map(f =>
      f.id === id ? { ...f, [field]: value } : f
    ));};

  return (
            <div className=" ">$2</div><div className=" ">$2</div><Type className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Conteúdo</h3>
      </div>

      {/* Features */}
      <div>
           
        </div><div className=" ">$2</div><label className="block text-sm font-medium">Características</label>
          <button
            type="button"
            onClick={ addFeature }
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600" />
            <Plus className="w-3 h-3" />
            Adicionar
          </button></div><div className="{formData.features.map((feature: unknown, index: unknown) => (">$2</div>
            <div key={index} className="flex gap-2">
           
        </div><input
                type="text"
                value={ feature }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateFeature(index, e.target.value) }
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Digite uma característica" />
              <button
                type="button"
                onClick={ () => removeFeature(index) }
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Minus className="w-4 h-4" /></button></div>
          ))}
        </div>

      {/* Benefits */}
      <div>
           
        </div><div className=" ">$2</div><label className="block text-sm font-medium">Benefícios</label>
          <button
            type="button"
            onClick={ addBenefit }
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600" />
            <Plus className="w-3 h-3" />
            Adicionar
          </button></div><div className="{formData.benefits.map((benefit: unknown, index: unknown) => (">$2</div>
            <div key={index} className="flex gap-2">
           
        </div><input
                type="text"
                value={ benefit }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateBenefit(index, e.target.value) }
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Digite um benefício" />
              <button
                type="button"
                onClick={ () => removeBenefit(index) }
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Minus className="w-4 h-4" /></button></div>
          ))}
        </div>

      {/* FAQ */}
      <div>
           
        </div><div className=" ">$2</div><label className="block text-sm font-medium">Perguntas Frequentes (FAQ)</label>
          <button
            type="button"
            onClick={ addFAQ }
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600" />
            <Plus className="w-3 h-3" />
            Adicionar
          </button></div><div className="{formData.faq.map((item: unknown) => (">$2</div>
            <div key={item.id} className="p-4 border rounded-lg space-y-3">
           
        </div><div className=" ">$2</div><h4 className="text-sm font-medium">FAQ Item</h4>
                <button
                  type="button"
                  onClick={ () => removeFAQ(item.id) }
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Minus className="w-4 h-4" /></button></div>
              <div>
           
        </div><label className="block text-xs font-medium mb-1">Pergunta</label>
                <input
                  type="text"
                  value={ item.question }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateFAQ(item.id, 'question', e.target.value) }
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                  placeholder="Digite a pergunta" /></div><div>
           
        </div><label className="block text-xs font-medium mb-1">Resposta</label>
                <textarea
                  value={ item.answer }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateFAQ(item.id, 'answer', e.target.value) }
                  className="w-full px-3 py-2 text-sm border rounded-lg"
                  rows={ 3 }
                  placeholder="Digite a resposta" />
              </div>
          ))}
        </div>
    </div>);};
