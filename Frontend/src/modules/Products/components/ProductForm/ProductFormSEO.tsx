import React from 'react';
import { Globe, Plus, X } from 'lucide-react';

interface ProductFormSEOProps {
  formData: {
seo: {
title: string;
  description: string;
  keywords: string[];
  slug: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };
};

  onChange?: (e: any) => void;
}

export const ProductFormSEO: React.FC<ProductFormSEOProps> = ({ formData,
  onChange
   }) => {
  const addKeyword = (keyword: string) => {
    if (keyword && !formData.seo.keywords.includes(keyword)) {
      onChange('seo.keywords', [...formData.seo.keywords, keyword]);

    } ;

  const removeKeyword = (keyword: string) => {
    onChange('seo.keywords', formData.seo.keywords.filter(k => k !== keyword));};

  return (
            <div className=" ">$2</div><div className=" ">$2</div><Globe className="w-5 h-5" />
        <h3 className="text-lg font-semibold">SEO & Marketing</h3></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Título SEO</label>
        <input
          type="text"
          value={ formData.seo.title }
          onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onChange('seo.title', e.target.value) }
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Título otimizado para SEO"
          maxLength={ 60 } />
        <p className="text-xs text-gray-500 mt-1" />
          {formData.seo.title.length}/60 caracteres
        </p></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Descrição SEO</label>
        <textarea
          value={ formData.seo.description }
          onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onChange('seo.description', e.target.value) }
          className="w-full px-4 py-2 border rounded-lg"
          rows={ 3 }
          placeholder="Descrição otimizada para SEO"
          maxLength={ 160 } />
        <p className="text-xs text-gray-500 mt-1" />
          {formData.seo.description.length}/160 caracteres
        </p></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Slug (URL)</label>
        <div className=" ">$2</div><span className="text-sm text-gray-500">seu-site.com/produtos/</span>
          <input
            type="text"
            value={ formData.seo.slug }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onChange('seo.slug', e.target.value) }
            className="flex-1 px-4 py-2 border rounded-lg"
            placeholder="slug-do-produto" /></div><p className="text-xs text-gray-500 mt-1" />
          URL amigável para o produto
        </p></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Palavras-chave</label>
        <div className="{formData.seo.keywords.map((keyword: unknown, index: unknown) => (">$2</div>
            <span
              key={ index }
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
           
        </span>{keyword}
              <button
                type="button"
                onClick={ () => removeKeyword(keyword) }
                className="hover:text-green-900"
              >
                <X className="w-3 h-3" /></button></span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Digite uma palavra-chave e pressione Enter"
          className="w-full px-4 py-2 border rounded-lg"
          onKeyPress={ (e: unknown) => {
            if (e.key === 'Enter') {
              e.preventDefault();

              addKeyword(e.currentTarget.value);

              e.currentTarget.value = '';
             } } />
        <p className="text-xs text-gray-500 mt-1" />
          Palavras-chave relevantes para SEO
        </p>
      </div>

      {/* Eye */}
      <div className=" ">$2</div><h4 className="text-sm font-medium mb-3">Eye Google</h4>
        <div className=" ">$2</div><div className="{formData.seo.title || 'Título do Produto'}">$2</div>
          </div>
          <div className="seu-site.com/produtos/{formData.seo.slug || 'slug'}">$2</div>
          </div>
          <div className="{formData.seo.description || 'Descrição do produto aparecerá aqui...'}">$2</div>
          </div>
      </div>);};
