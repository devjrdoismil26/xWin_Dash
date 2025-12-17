// =========================================
// REVIEWS MANAGER - GERENCIADOR DE REVIEWS
// =========================================
// Componente para gerenciar reviews de produtos
// Máximo: 200 linhas

import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import { Badge } from '@/shared/components/ui/Badge';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { useProductReviews } from '../ProductsReviews/hooks/useProductReviews';
import { useProductsOptimization } from '../hooks/useProductsOptimization';
import { validateReviewData } from '../services/productsValidationService';
import { getErrorMessage } from '@/utils/errorHelpers';

interface ReviewsManagerProps {
  productId: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ReviewsManager: React.FC<ReviewsManagerProps> = ({ productId,
  className = ''
   }) => {
  const {
    reviews,
    currentReview,
    reviewStats,
    loading,
    error,
    loadReviews,
    createNewReview,
    updateExistingReview,
    deleteExistingReview,
    moderate,
    reply,
    like,
    dislike,
    clearError
  } = useProductReviews();

  const { useOptimizedCallback } = useProductsOptimization();

  const [showForm, setShowForm] = useState(false);

  const [editingReview, setEditingReview] = useState<Record<string, any> | null>(null);

  const [formData, setFormData] = useState({
    rating: '',
    title: '',
    content: ''
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);

  const [replyText, setReplyText] = useState('');

  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // =========================================
  // EFEITOS
  // =========================================

  useEffect(() => {
    loadReviews(productId);

  }, [productId, loadReviews]);

  useEffect(() => {
    if (editingReview) {
      setFormData({
        rating: editingReview.rating?.toString() || '',
        title: editingReview.title || '',
        content: editingReview.content || ''
      });

      setShowForm(true);

    } , [editingReview]);

  // =========================================
  // HANDLERS
  // =========================================

  const handleFormSubmit = useOptimizedCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validation = validateReviewData({
        ...formData,
        rating: parseInt(formData.rating)
  });

      if (!validation.isValid) {
        setFormErrors(validation.errors);

        return;
      }

      setFormErrors([]);

      try {
        const data = {
          ...formData,
          rating: parseInt(formData.rating)};

        if (editingReview) {
          await updateExistingReview(editingReview.id, data);

        } else {
          await createNewReview(productId, data);

        }

        handleFormReset();

        await loadReviews(productId);

      } catch (error: unknown) {
        setFormErrors([getErrorMessage(error)]);

      } ,
    [formData, editingReview, productId, createNewReview, updateExistingReview, loadReviews],
    'submitReview');

  const handleFormReset = () => {
    setFormData({
      rating: '',
      title: '',
      content: ''
    });

    setFormErrors([]);

    setShowForm(false);

    setEditingReview(null);};

  const handleEdit = (review: unknown) => {
    setEditingReview(review);};

  const handleDelete = async (review: unknown) => {
    if (window.confirm('Tem certeza que deseja excluir este review?')) {
      await deleteExistingReview(review.id);

      await loadReviews(productId);

    } ;

  const handleModerate = async (review: unknown, action: 'approve' | 'reject' | 'flag') => {
    await moderate(review.id, action);

    await loadReviews(productId);};

  const handleReply = async (review: unknown) => {
    if (replyText.trim()) {
      await reply(review.id, replyText);

      setReplyText('');

      setReplyingTo(null);

      await loadReviews(productId);

    } ;

  const handleLike = async (review: unknown) => {
    await like(review.id);

    await loadReviews(productId);};

  const handleDislike = async (review: unknown) => {
    await dislike(review.id);

    await loadReviews(productId);};

  // =========================================
  // UTILITÁRIOS
  // =========================================

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_: unknown, i: unknown) => (
      <svg
        key={ i }
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'} `}
        fill="currentColor"
        viewBox="0 0 20 20" />
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" / />
      </svg>
    ));};

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      case 'flagged': return 'warning';
      default: return 'info';
    } ;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'pending': return 'Pendente';
      case 'rejected': return 'Rejeitado';
      case 'flagged': return 'Sinalizado';
      default: return 'Desconhecido';
    } ;

  // =========================================
  // RENDER
  // =========================================

  if (loading) {
    return (
        <>
      <div className={`reviews-manager ${className} `}>
      </div><Card className="p-8" />
          <div className=" ">$2</div><LoadingSpinner / />
            <span className="ml-3 text-gray-600">Carregando reviews...</span></div></Card>
      </div>);

  }

  return (
        <>
      <div className={`reviews-manager ${className} `}>
      </div><Card className="p-6" />
        <div className=" ">$2</div><h3 className="text-lg font-semibold text-gray-900" />
            Reviews do Produto
          </h3>
          <Button
            variant="primary"
            onClick={ () => setShowForm(true)  }>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" / />
            </svg>
            Adicionar Review
          </Button>
        </div>

        {/* Estatísticas */}
        {reviewStats && (
          <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><div className=" ">$2</div><div className="flex">{renderStars(Math.round(reviewStats.average_rating))}</div>
                  <span className="{reviewStats.average_rating?.toFixed(1) || '0.0'}">$2</span>
                  </span>
                  <span className="({reviewStats.total_reviews || 0} reviews)">$2</span>
                  </span></div><div className="Distribuição: {reviewStats.rating_distribution ? ">$2</div>
                  Object.entries(reviewStats.rating_distribution).map(([rating, count]) => 
                    `${rating}★: ${count}`
                  ).join(', ') : 'N/A'}
              </div>
    </div>
  )}

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
              {editingReview ? 'Editar Review' : 'Novo Review'}
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
                    Avaliação *
                  </label>
                  <Select
                    value={ formData.rating }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    options={[
                      { value: '', label: 'Selecione uma avaliação' },
                      { value: '1', label: '1 estrela - Muito ruim' },
                      { value: '2', label: '2 estrelas - Ruim' },
                      { value: '3', label: '3 estrelas - Regular' },
                      { value: '4', label: '4 estrelas - Bom' },
                      { value: '5', label: '5 estrelas - Excelente' }
                    ]}
                    required /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Título *
                  </label>
                  <Input
                    type="text"
                    value={ formData.title }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título do review"
                    required /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
                    Conteúdo *
                  </label>
                  <textarea
                    value={ formData.content }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Descreva sua experiência com o produto"
                    rows={ 4 }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required /></div><div className=" ">$2</div><Button type="submit" variant="primary" />
                  {editingReview ? 'Atualizar' : 'Criar'} Review
                </Button>
                <Button type="button" variant="ghost" onClick={ handleFormReset } />
                  Cancelar
                </Button></div></form>
      </div>
    </>
  )}

        {/* Lista de Reviews */}
        {reviews.length === 0 ? (
          <div className=" ">$2</div><svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" / /></svg><p>Nenhum review encontrado</p>
            <p className="text-sm">Seja o primeiro a avaliar este produto</p>
      </div>
    </>
  ) : (
          <div className="{(reviews || []).map((review: unknown) => (">$2</div>
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div className="flex">{renderStars(review.rating)}</div>
                      <Badge variant={getStatusVariant(review.status)} size="sm" />
                        {getStatusLabel(review.status)}
                      </Badge></div><h4 className="font-semibold text-gray-900 mb-1" />
                      {review.title}
                    </h4>
                    
                    <p className="text-gray-700 mb-2" />
                      {review.content}
                    </p>
                    
                    <div className=" ">$2</div><span>Por: {review.author_name || 'Anônimo'}</span>
                      <span>{new Date(review.created_at).toLocaleDateString('pt-BR')}</span>
                      <div className=" ">$2</div><button
                          onClick={ () => handleLike(review) }
                          className="flex items-center space-x-1 hover:text-blue-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m-7-8a2 2 0 01-2-2V5a2 2 0 012-2h2.343M11 7.06l-1.293-1.293a1 1 0 00-1.414 0L7 7.06" / /></svg><span>{review.likes || 0}</span></button><button
                          onClick={ () => handleDislike(review) }
                          className="flex items-center space-x-1 hover:text-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.018c.163 0 .326.02.485.06L17 4m-7 10V6m7 8a2 2 0 012-2V5a2 2 0 00-2-2h-2.343M13 16.94l1.293 1.293a1 1 0 001.414 0L17 16.94" / /></svg><span>{review.dislikes || 0}</span></button></div>

                    {/* Resposta */}
                    {review.reply && (
                      <div className=" ">$2</div><div className=" ">$2</div><span className="text-sm font-medium text-blue-900">Resposta da loja:</span>
                          <span className="{new Date(review.reply.created_at).toLocaleDateString('pt-BR')}">$2</span>
                          </span></div><p className="text-blue-800">{review.reply.content}</p>
      </div>
    </>
  )}

                    {/* Formulário de resposta */}
                    {replyingTo === review.id && (
                      <div className=" ">$2</div><textarea
                          value={ replyText }
                          onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setReplyText(e.target.value) }
                          placeholder="Digite sua resposta..."
                          rows={ 3 }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2" />
                        <div className=" ">$2</div><Button
                            size="sm"
                            onClick={ () => handleReply(review) }
                            disabled={ !replyText.trim()  }>
                            Responder
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setReplyText('');

                              setReplyingTo(null);

                            } >
                            Cancelar
                          </Button>
      </div>
    </>
  )}
                  </div>

                  <div className=" ">$2</div><Button
                      variant="ghost"
                      size="sm"
                      onClick={ () => setReplyingTo(replyingTo === review.id ? null : review.id)  }>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" / /></svg></Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={ () => handleEdit(review)  }>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" / /></svg></Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={ () => handleModerate(review, 'approve')  }>
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" / /></svg></Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={ () => handleModerate(review, 'flag')  }>
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" / /></svg></Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={ () => handleDelete(review) }
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" / /></svg></Button></div></div>
            ))}
          </div>
        )}
      </Card>
    </div>);};

export default ReviewsManager;
