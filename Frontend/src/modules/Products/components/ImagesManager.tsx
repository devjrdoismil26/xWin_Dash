// =========================================
// IMAGES MANAGER - GERENCIADOR DE IMAGENS
// =========================================
// Componente para gerenciar imagens de produtos
// Máximo: 200 linhas

import React, { useState, useRef } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { useProductImages } from '../ProductsImages/hooks/useProductImages';
import { useProductsOptimization } from '../hooks/useProductsOptimization';
import { validateImageFile, validateImageData } from '../services/productsValidationService';

interface ImagesManagerProps {
  productId: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ImagesManager: React.FC<ImagesManagerProps> = ({ productId,
  className = ''
   }) => {
  const {
    images,
    currentImage,
    uploading,
    loading,
    error,
    loadImages,
    uploadImage,
    updateImage,
    deleteImage,
    setPrimary,
    reorder,
    clearError
  } = useProductImages();

  const { useOptimizedCallback } = useProductsOptimization();

  const [dragOver, setDragOver] = useState(false);

  const [editingImage, setEditingImage] = useState<Record<string, any> | null>(null);

  const [editForm, setEditForm] = useState({
    alt: '',
    caption: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // =========================================
  // HANDLERS
  // =========================================

  const handleFileSelect = useOptimizedCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      const validFiles: File[] = [] as unknown[];
      const errors: string[] = [] as unknown[];

      // Validar cada arquivo
      fileArray.forEach((file: unknown) => {
        const validation = validateImageFile(file);

        if (validation.isValid) {
          validFiles.push(file);

        } else {
          errors.push(`${file.name}: ${validation.errors.join(', ')}`);

        } );

      if (errors.length > 0) {
        alert('Alguns arquivos não são válidos:\n' + errors.join('\n'));

      }

      // Fazer upload dos arquivos válidos
      for (const file of validFiles) {
        try {
          await uploadImage(productId, file);

        } catch (error) {
          console.error('Erro ao fazer upload:', error);

        } await loadImages(productId);

    },
    [productId, uploadImage, loadImages],
    'uploadImages');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    setDragOver(false);

    handleFileSelect(e.dataTransfer.files);};

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    setDragOver(true);};

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();

    setDragOver(false);};

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);};

  const handleEditImage = (image: unknown) => {
    setEditingImage(image);

    setEditForm({
      alt: image.alt || '',
      caption: image.caption || ''
    });};

  const handleSaveEdit = async () => {
    if (!editingImage) return;

    const validation = validateImageData(editForm);

    if (!validation.isValid) {
      alert('Dados inválidos: ' + validation.errors.join(', '));

      return;
    }

    try {
      await updateImage(editingImage.id, editForm);

      setEditingImage(null);

      await loadImages(productId);

    } catch (error) {
      console.error('Erro ao atualizar imagem:', error);

    } ;

  const handleDeleteImage = async (image: unknown) => {
    if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
      try {
        await deleteImage(image.id);

        await loadImages(productId);

      } catch (error) {
        console.error('Erro ao excluir imagem:', error);

      } };

  const handleSetPrimary = async (image: unknown) => {
    try {
      await setPrimary(image.id);

      await loadImages(productId);

    } catch (error) {
      console.error('Erro ao definir imagem principal:', error);

    } ;

  // =========================================
  // RENDER
  // =========================================

  return (
        <>
      <div className={`images-manager ${className} `}>
      </div><Card className="p-6" />
        <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900" />
            Imagens do Produto
          </h3>
          <Button
            variant="primary"
            onClick={ () => fileInputRef.current?.click() }
            disabled={ uploading  }>
            {uploading ? (
              <div className=" ">$2</div><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2">
          Enviando...
        </div>
    </div>
  ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" / />
                </svg>
                Adicionar Imagens
              </>
            )}
          </Button>
        </div>

        {/* Input de arquivo oculto */}
        <input
          ref={ fileInputRef }
          type="file"
          multiple
          accept="image/*"
          onChange={ handleFileInputChange }
          className="hidden"
       >
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

        {/* Área de upload */}
        <div
          className={`mb-6 p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } `}
          onDrop={ handleDrop }
          onDragOver={ handleDragOver }
          onDragLeave={ handleDragLeave  }>
        </div><svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" / /></svg><p className="text-gray-600 mb-2" />
            Arraste e solte imagens aqui ou clique para selecionar
          </p>
          <p className="text-sm text-gray-500" />
            Formatos suportados: JPEG, PNG, WebP, GIF (máx. 5MB)
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className=" ">$2</div><LoadingSpinner / />
            <span className="ml-3 text-gray-600">Carregando imagens...</span>
      </div>
    </>
  )}

        {/* Lista de imagens */}
        {images.length === 0 && !loading ? (
          <div className=" ">$2</div><svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" / /></svg><p>Nenhuma imagem encontrada</p>
            <p className="text-sm">Adicione imagens para o produto</p>
      </div>
    </>
  ) : (
          <div className="{(images || []).map((image: unknown) => (">$2</div>
              <div key={image.id} className="relative group">
           
        </div><div className=" ">$2</div><img
                    src={ image.url }
                    alt={ image.alt }
                    className="w-full h-48 object-cover"
                  / />
                </div>

                {/* Overlay com ações */}
                <div className=" ">$2</div><div className=" ">$2</div><Button
                      variant="primary"
                      size="sm"
                      onClick={ () => handleEditImage(image)  }>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" / /></svg></Button>
                    { !image.is_primary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={ () => handleSetPrimary(image)  }>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" / /></svg></Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={ () => handleDeleteImage(image)  }>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" / /></svg></Button>
                  </div>

                {/* Badge de imagem principal */}
                {image.is_primary && (
                  <div className=" ">$2</div><span className="Principal">$2</span>
                    </span>
      </div>
    </>
  )}

                {/* Informações da imagem */}
                <div className=" ">$2</div><p className="text-sm font-medium text-gray-900 truncate" />
                    {image.alt || 'Sem descrição'}
                  </p>
                  {image.caption && (
                    <p className="text-xs text-gray-500 truncate" />
                      {image.caption}
                    </p>
                  )}
                </div>
            ))}
          </div>
        )}

        {/* Modal de edição */}
        {editingImage && (
          <div className=" ">$2</div><div className=" ">$2</div><h4 className="text-lg font-semibold text-gray-900 mb-4" />
                Editar Imagem
              </h4>
              
              <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Texto Alternativo
                  </label>
                  <Input
                    type="text"
                    value={ editForm.alt }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                    placeholder="Descreva a imagem" /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Legenda
                  </label>
                  <Input
                    type="text"
                    value={ editForm.caption }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm(prev => ({ ...prev, caption: e.target.value }))}
                    placeholder="Legenda da imagem" /></div><div className=" ">$2</div><Button
                  variant="ghost"
                  onClick={ () => setEditingImage(null)  }>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={ handleSaveEdit } />
                  Salvar
                </Button></div></div>
        )}
      </Card>
    </div>);};

export default ImagesManager;
