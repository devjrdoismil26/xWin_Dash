import React from 'react';
import { DollarSign, Plus, Minus } from 'lucide-react';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  sku: string; }

interface ProductFormPricingProps {
  formData: {
price: number;
  originalPrice?: number;
  variants: ProductVariant[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

  onChange?: (e: any) => void;
  errors?: Record<string, string>;
}

export const ProductFormPricing: React.FC<ProductFormPricingProps> = ({
  formData,
  onChange,
  errors ={  } ) => {
  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      sku: '',};

    onChange('variants', [...formData.variants, newVariant]);};

  const removeVariant = (id: string) => {
    onChange('variants', formData.variants.filter(v => v.id !== id));};

  const updateVariant = (id: string, field: string, value: unknown) => {
    onChange('variants', formData.variants.map(v =>
      v.id === id ? { ...v, [field]: value } : v
    ));};

  return (
            <div className=" ">$2</div><div className=" ">$2</div><DollarSign className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Preços & Variações</h3>
      </div>

      {/* Preço Principal */}
      <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium mb-2">Preço *</label>
          <input
            type="number"
            value={ formData.price }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onChange('price', parseFloat(e.target.value)) }
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="0.00"
            min="0"
            step="0.01" />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
           
        </div><label className="block text-sm font-medium mb-2">Preço Original</label>
          <input
            type="number"
            value={ formData.originalPrice || '' }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onChange('originalPrice', parseFloat(e.target.value)) }
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="0.00"
            min="0"
            step="0.01" />
          <p className="text-xs text-gray-500 mt-1">Para mostrar desconto</p>
        </div>

      {/* Variações */}
      <div>
           
        </div><div className=" ">$2</div><label className="block text-sm font-medium">Variações do Produto</label>
          <button
            type="button"
            onClick={ addVariant }
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600" />
            <Plus className="w-4 h-4" />
            Adicionar Variação
          </button>
        </div>

        {formData.variants.length === 0 ? (
          <div className=" ">$2</div><p className="text-gray-500">Nenhuma variação adicionada</p>
            <p className="text-sm text-gray-400 mt-1" />
              Adicione variações como tamanhos, cores, etc.
            </p>
      </div>
    </>
  ) : (
          <div className="{formData.variants.map((variant: unknown) => (">$2</div>
              <div key={variant.id} className="p-4 border rounded-lg space-y-3">
           
        </div><div className=" ">$2</div><h4 className="font-medium">Variação</h4>
                  <button
                    type="button"
                    onClick={ () => removeVariant(variant.id) }
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Minus className="w-4 h-4" /></button></div>

                <div className=" ">$2</div><div>
           
        </div><label className="block text-xs font-medium mb-1">Nome</label>
                    <input
                      type="text"
                      value={ variant.name }
                      onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateVariant(variant.id, 'name', e.target.value) }
                      className="w-full px-3 py-2 text-sm border rounded-lg"
                      placeholder="Ex: Tamanho M" /></div><div>
           
        </div><label className="block text-xs font-medium mb-1">SKU</label>
                    <input
                      type="text"
                      value={ variant.sku }
                      onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateVariant(variant.id, 'sku', e.target.value) }
                      className="w-full px-3 py-2 text-sm border rounded-lg"
                      placeholder="SKU-001" /></div><div>
           
        </div><label className="block text-xs font-medium mb-1">Preço</label>
                    <input
                      type="number"
                      value={ variant.price }
                      onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateVariant(variant.id, 'price', parseFloat(e.target.value)) }
                      className="w-full px-3 py-2 text-sm border rounded-lg"
                      placeholder="0.00"
                      min="0"
                      step="0.01" /></div><div>
           
        </div><label className="block text-xs font-medium mb-1">Estoque</label>
                    <input
                      type="number"
                      value={ variant.stock || '' }
                      onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateVariant(variant.id, 'stock', parseInt(e.target.value)) }
                      className="w-full px-3 py-2 text-sm border rounded-lg"
                      placeholder="0"
                      min="0" /></div></div>
            ))}
          </div>
        )}
      </div>);};
