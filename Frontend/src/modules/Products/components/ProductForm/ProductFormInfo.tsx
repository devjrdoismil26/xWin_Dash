import React from 'react';
import { FileText } from 'lucide-react';

interface ProductFormBasicInfoProps {
  formData: {
name: string;
  description: string;
  shortDescription: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

  onChange?: (e: any) => void;
  errors?: Record<string, string>;
}

export const ProductFormBasicInfo: React.FC<ProductFormBasicInfoProps> = ({
  formData,
  onChange,
  errors ={  } ) => {
  return (
            <div className=" ">$2</div><div className=" ">$2</div><FileText className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Informações Básicas</h3></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Nome do Produto *</label>
        <input
          type="text"
          value={ formData.name }
          onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onChange('name', e.target.value) }
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Digite o nome do produto" />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
           
        </div><label className="block text-sm font-medium mb-2">Descrição Curta *</label>
        <textarea
          value={ formData.shortDescription }
          onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onChange('shortDescription', e.target.value) }
          className="w-full px-4 py-2 border rounded-lg"
          rows={ 2 }
          placeholder="Breve descrição do produto" /></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Descrição Completa *</label>
        <textarea
          value={ formData.description }
          onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onChange('description', e.target.value) }
          className="w-full px-4 py-2 border rounded-lg"
          rows={ 6 }
          placeholder="Descrição detalhada do produto" />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
           
        </div><label className="block text-sm font-medium mb-2">Categoria *</label>
        <select
          value={ formData.category }
          onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onChange('category', e.target.value) }
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Selecione uma categoria</option>
          <option value="digital">Produto Digital</option>
          <option value="physical">Produto Físico</option>
          <option value="service">Serviço</option>
          <option value="course">Curso</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
           
        </div><label className="block text-sm font-medium mb-2">Status</label>
        <select
          value={ formData.status }
          onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onChange('status', e.target.value) }
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="archived">Arquivado</option></select></div>);};
