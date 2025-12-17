import React from 'react';
import { Star, Plus, Minus } from 'lucide-react';

interface Testimonial {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  verified: boolean; }

interface ProductFormSocialProps {
  formData: {
testimonials: Testimonial[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

  onChange?: (e: any) => void;
}

export const ProductFormSocial: React.FC<ProductFormSocialProps> = ({ formData,
  onChange
   }) => {
  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      customerName: '',
      rating: 5,
      comment: '',
      verified: false};

    onChange('testimonials', [...formData.testimonials, newTestimonial]);};

  const removeTestimonial = (id: string) => {
    onChange('testimonials', formData.testimonials.filter(t => t.id !== id));};

  const updateTestimonial = (id: string, field: string, value: unknown) => {
    onChange('testimonials', formData.testimonials.map(t =>
      t.id === id ? { ...t, [field]: value } : t
    ));};

  const renderStars = (rating: number, onChange?: (e: any) => void) => {
    return (
              <div className="{[1, 2, 3, 4, 5].map((star: unknown) => (">$2</div>
          <button
            key={ star }
            type="button"
            onClick={ () => onChange?.(star) }
            className={`${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${onChange ? 'cursor-pointer hover:text-yellow-500' : ''}`}
  >
            <Star className="w-5 h-5 fill-current" />
          </button>
        ))}
      </div>);};

  return (
            <div className=" ">$2</div><div className=" ">$2</div><Star className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Prova Social</h3>
      </div>

      {/* Testimonials */}
      <div>
           
        </div><div className=" ">$2</div><label className="block text-sm font-medium">Depoimentos</label>
          <button
            type="button"
            onClick={ addTestimonial }
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600" />
            <Plus className="w-4 h-4" />
            Adicionar Depoimento
          </button>
        </div>

        {formData.testimonials.length === 0 ? (
          <div className=" ">$2</div><p className="text-gray-500">Nenhum depoimento adicionado</p>
            <p className="text-sm text-gray-400 mt-1" />
              Adicione depoimentos de clientes satisfeitos
            </p>
      </div>
    </>
  ) : (
          <div className="{formData.testimonials.map((testimonial: unknown) => (">$2</div>
              <div key={testimonial.id} className="p-4 border rounded-lg space-y-3">
           
        </div><div className=" ">$2</div><h4 className="font-medium">Depoimento</h4>
                  <button
                    type="button"
                    onClick={ () => removeTestimonial(testimonial.id) }
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Minus className="w-4 h-4" /></button></div>

                <div className=" ">$2</div><div>
           
        </div><label className="block text-xs font-medium mb-1">Nome do Cliente</label>
                    <input
                      type="text"
                      value={ testimonial.customerName }
                      onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateTestimonial(testimonial.id, 'customerName', e.target.value) }
                      className="w-full px-3 py-2 text-sm border rounded-lg"
                      placeholder="Nome do cliente" /></div><div>
           
        </div><label className="block text-xs font-medium mb-1">Avatar URL</label>
                    <input
                      type="text"
                      value={ testimonial.customerAvatar || '' }
                      onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateTestimonial(testimonial.id, 'customerAvatar', e.target.value) }
                      className="w-full px-3 py-2 text-sm border rounded-lg"
                      placeholder="https://..." /></div><div>
           
        </div><label className="block text-xs font-medium mb-1">Avaliação</label>
                  {renderStars(testimonial.rating, (rating: unknown) =>
                    updateTestimonial(testimonial.id, 'rating', rating)
                  )}
                </div>

                <div>
           
        </div><label className="block text-xs font-medium mb-1">Comentário</label>
                  <textarea
                    value={ testimonial.comment }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateTestimonial(testimonial.id, 'comment', e.target.value) }
                    className="w-full px-3 py-2 text-sm border rounded-lg"
                    rows={ 3 }
                    placeholder="Depoimento do cliente..." /></div><div className=" ">$2</div><input
                    type="checkbox"
                    id={`verified-${testimonial.id}`}
                    checked={ testimonial.verified }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => updateTestimonial(testimonial.id, 'verified', e.target.checked) }
                    className="rounded" />
                  <label htmlFor={`verified-${testimonial.id}`} className="text-sm" />
                    Depoimento verificado
                  </label>
      </div>
    </>
  ))}
          </div>
        )}
      </div>

      {/* Social Proof Stats */}
      <div className=" ">$2</div><h4 className="text-sm font-medium mb-2">Estatísticas de Prova Social</h4>
        <div className=" ">$2</div><div>
           
        </div><div className="{formData.testimonials.length}">$2</div>
            </div>
            <div className="text-xs text-gray-600">Depoimentos</div>
          <div>
           
        </div><div className="{formData.testimonials.filter(t => t.verified).length}">$2</div>
            </div>
            <div className="text-xs text-gray-600">Verificados</div>
          <div>
           
        </div><div className="{formData.testimonials.length > 0">$2</div>
                ? (formData.testimonials.reduce((acc: unknown, t: unknown) => acc + t.rating, 0) / formData.testimonials.length).toFixed(1)
                : '0.0'}
            </div>
            <div className="text-xs text-gray-600">Média</div></div></div>);};
