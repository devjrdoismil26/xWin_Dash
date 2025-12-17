// =========================================
// VARIATIONS MANAGER - GERENCIADOR DE VARIAÇÕES
// =========================================
// Componente para gerenciar variações de produtos
// Máximo: 200 linhas

import React, { useState, useEffect } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import { Badge } from '@/shared/components/ui/Badge';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { useProductVariations } from '../ProductsVariations/hooks/useProductVariations';
import { useProductsOptimization } from '../hooks/useProductsOptimization';
import { validateVariationData } from '../services/productsValidationService';

interface VariationsManagerProps {
  productId: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const VariationsManager: React.FC<VariationsManagerProps> = ({ productId,
  className = ''
   }) => {
  const {
    variations,
    currentVariation,
    loading,
    error,
    loadVariations,
    createNewVariation,
    updateExistingVariation,
    deleteExistingVariation,
    clearError
  } = useProductVariations();

  const { useOptimizedCallback } = useProductsOptimization();

  const [showForm, setShowForm] = useState(false);

  const [editingVariation, setEditingVariation] = useState<Record<string, any> | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sku: '',
    inventory: '',
    attributes: {} as Record<string, string />
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);

  // =========================================
  // EFEITOS
  // =========================================

  useEffect(() => {
    loadVariations(productId);

  }, [productId, loadVariations]);

  useEffect(() => {
    if (editingVariation) {
      setFormData({
        name: editingVariation.name || '',
        price: editingVariation.price?.toString() || '',
        sku: editingVariation.sku || '',
        inventory: editingVariation.inventory?.toString() || '',
        attributes: editingVariation.attributes || {} );

      setShowForm(true);

    } , [editingVariation]);

  // =========================================
  // HANDLERS
  // =========================================

  const handleFormSubmit = useOptimizedCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validation = validateVariationData({
        ...formData,
        price: parseFloat(formData.price) || 0,
        inventory: parseInt(formData.inventory) || 0
      });

      if (!validation.isValid) {
        setFormErrors(validation.errors);

        return;
      }

      setFormErrors([]);

      try {
        const data = {
          ...formData,
          price: parseFloat(formData.price),
          inventory: parseInt(formData.inventory)};

        if (editingVariation) {
          await updateExistingVariation(editingVariation.id, data);

        } else {
          await createNewVariation(productId, data);

        }

        handleFormReset();

        await loadVariations(productId);

      } catch (error: unknown) {
        setFormErrors([getErrorMessage(error)]);

      } ,
    [formData, editingVariation, productId, createNewVariation, updateExistingVariation, loadVariations],
    'submitVariation');

  const handleFormReset = () => {
    setFormData({
      name: '',
      price: '',
      sku: '',
      inventory: '',
      attributes: {} );

    setFormErrors([]);

    setShowForm(false);

    setEditingVariation(null);};

  const handleEdit = (variation: unknown) => {
    setEditingVariation(variation);};

  const handleDelete = async (variation: unknown) => {
    if (window.confirm('Tem certeza que deseja excluir esta variação?')) {
      await deleteExistingVariation(variation.id);

      await loadVariations(productId);

    } ;

  const handleAttributeChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [key]: value } ));};

  // =========================================
  // RENDER
  // =========================================

  if (loading) {
    return (
        <>
      <div className={`variations-manager ${className} `}>
      </div><Card className="p-8" />
          <div className=" ">$2</div><LoadingSpinner / />
            <span className="ml-3 text-gray-600">Carregando variações...</span></div></Card>
      </div>);

  }

  return (
        <>
      <div className={`variations-manager ${className} `}>
      </div><Card className="p-6" />
        <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900" />
            Variações do Produto
          </h3>
          <Button
            variant="primary"
            onClick={ () => setShowForm(true)  }>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" / />
            </svg>
            Adicionar Variação
          </Button>
        </div>

        {/* Erro */}
        {error && (
          <div className=" ">$2</div><div className="text-red-800">{error}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={ clearError }
              className="mt-2" />
              Fechar
            </Button>
      </div>
    </>
  )}

        {/* Formulário */}
        {showForm && (
          <div className=" ">$2</div><h4 className="text-md font-semibold text-gray-900 mb-4" />
              {editingVariation ? 'Editar Variação' : 'Nova Variação'}
            </h4>

            {formErrors.length > 0 && (
              <div className=" ">$2</div><ul className="text-red-800 text-sm" />
                  {(formErrors || []).map((error: unknown, index: unknown) => (
                    <li key={ index }>{error}</li>
                  ))}
                </ul>
      </div>
    </>
  )}

            <form onSubmit={ handleFormSubmit } />
              <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Nome da Variação *
                  </label>
                  <Input
                    type="text"
                    value={ formData.name }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Tamanho M, Cor Azul"
                    required /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    SKU *
                  </label>
                  <Input
                    type="text"
                    value={ formData.sku }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="Código único da variação"
                    required /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Preço *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={ formData.price }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    required /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Estoque
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={ formData.inventory }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, inventory: e.target.value }))}
                    placeholder="0" />
                </div>

              {/* Atributos */}
              <div className=" ">$2</div><label className="block text-sm font-medium text-gray-700 mb-2" />
                  Atributos
                </label>
                <div className="{Object.entries(formData.attributes).map(([key, value]) => (">$2</div>
                    <div key={key} className="flex space-x-2">
           
        </div><Input
                        type="text"
                        value={ key }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newAttributes = { ...formData.attributes};

                          delete newAttributes[key];
                          newAttributes[e.target.value] = value;
                          setFormData(prev => ({ ...prev, attributes: newAttributes }));

                        } placeholder="Atributo (ex: Tamanho)"
                        className="flex-1" />
                      <Input
                        type="text"
                        value={ value }
                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleAttributeChange(key, e.target.value) }
                        placeholder="Valor (ex: M)"
                        className="flex-1" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newAttributes = { ...formData.attributes};

                          delete newAttributes[key];
                          setFormData(prev => ({ ...prev, attributes: newAttributes }));

                        } >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" / /></svg></Button>
      </div>
    </>
  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newKey = `atributo_${Object.keys(formData.attributes).length + 1}`;
                      handleAttributeChange(newKey, '');

                    } >
                    Adicionar Atributo
                  </Button></div><div className=" ">$2</div><Button type="submit" variant="primary" />
                  {editingVariation ? 'Atualizar' : 'Criar'} Variação
                </Button>
                <Button type="button" variant="ghost" onClick={ handleFormReset } />
                  Cancelar
                </Button></div></form>
      </div>
    </>
  )}

        {/* Lista de Variações */}
        {variations.length === 0 ? (
          <div className=" ">$2</div><svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" / /></svg><p>Nenhuma variação encontrada</p>
            <p className="text-sm">Clique em &quot;Adicionar Variação&quot; para criar a primeira</p>
      </div>
    </>
  ) : (
          <div className="{(variations || []).map((variation: unknown) => (">$2</div>
              <div key={variation.id} className="border border-gray-200 rounded-lg p-4">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h4 className="font-semibold text-gray-900">{variation.name}</h4>
                      <Badge variant="info" size="sm">{variation.sku}</Badge></div><div className=" ">$2</div><div>Preço: R$ {variation.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                      <div>Estoque: {variation.inventory || 0}</div>
                      <div>Status: {variation.status}</div>

                    {Object.keys(variation.attributes || {}).length > 0 && (
                      <div className=" ">$2</div><div className="{Object.entries(variation.attributes || {}).map(([key, value]) => (">$2</div>
                            <Badge key={key} variant="secondary" size="sm" />
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                    )}
                  </div>

                  <div className=" ">$2</div><Button
                      variant="ghost"
                      size="sm"
                      onClick={ () => handleEdit(variation)  }>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" / /></svg></Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={ () => handleDelete(variation) }
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" / /></svg></Button></div></div>
            ))}
          </div>
        )}
      </Card>
    </div>);};

export default VariationsManager;
