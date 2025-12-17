/**
 * Formulário de criativo de anúncio
 *
 * @description
 * Formulário completo para criar ou editar criativos de anúncios.
 * Suporta múltiplos tipos (imagem, vídeo, carrossel, coleção, texto)
 * e integração com campanhas.
 *
 * @module modules/ADStool/Creatives/components/CreativeForm
 * @since 1.0.0
 */

import React, { useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputError from '@/shared/components/ui/InputError';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Textarea from '@/shared/components/ui/Textarea';
import { AdsCreative, AdsCreativeType } from '../../types/adsCreativeTypes';
import { AdsCampaign } from '../../types/adsCampaignTypes';

/**
 * Props do componente CreativeForm
 *
 * @interface CreativeFormProps
 * @property {AdsCreative | null} [creative] - Criativo existente para edição
 * @property {AdsCampaign[]} [campaigns] - Lista de campanhas disponíveis
 * @property {() => void} [onSuccess] - Callback quando criativo é salvo
 * @property {() => void} [onCancel] - Callback para cancelar edição
 */
interface CreativeFormProps {
  creative?: AdsCreative | null;
  campaigns?: AdsCampaign[];
  onSuccess???: (e: any) => void;
  onCancel???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
interface FormData {
  name: string;
  type: AdsCreativeType;
  content_text: string;
  content_file: File | null;
  campaign_id: string;
  headline: string;
  description: string;
  call_to_action: string;
  link_url: string; }
/**
 * Componente CreativeForm
 *
 * @description
 * Formulário completo para criar ou editar criativos com campos para
 * nome, tipo, conteúdo (texto, imagem, vídeo), headline, descrição,
 * call-to-action e URL de destino.
 * Adapta campos baseado no tipo de criativo selecionado.
 *
 * @param {CreativeFormProps} props - Props do componente
 * @returns {JSX.Element} Formulário de criativo
 *
 * @example
 * ```tsx
 * <CreativeForm
 *   creative={ existingCreative }
 *   campaigns={ availableCampaigns }
 *   onSuccess={ () => router.reload() }
 * />
 * ```
 */
const CreativeForm: React.FC<CreativeFormProps> = React.memo(({ 
  creative = null, 
  campaigns = [] as unknown[], 
  onSuccess, 
  onCancel 
}) => {
  const { data, setData, post, put, processing, errors, reset } = useForm<FormData>({
    name: creative?.name || '',
    type: creative?.type || 'image',
    content_text: creative?.content?.text || '',
    content_file: null,
    campaign_id: creative?.campaign_id?.toString() || '',
    headline: creative?.content?.headline || '',
    description: creative?.content?.description || '',
    call_to_action: creative?.content?.call_to_action || '',
    link_url: creative?.content?.links?.[0]?.url || '',
  });

  const creativeTypeOptions = [
    { value: 'image', label: 'Imagem' },
    { value: 'video', label: 'Vídeo' },
    { value: 'carousel', label: 'Carrossel' },
    { value: 'collection', label: 'Coleção' },
    { value: 'text', label: 'Texto' }
  ];
  const campaignOptions = [
    { value: '', label: 'Nenhuma' },
    ...(campaigns || []).map(campaign => ({
      value: campaign.id.toString(),
      label: campaign.name
    }))
  ];
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setData('content_file', fileInput.files?.[0] || null);

    } else {
      setData(name as keyof FormData, value);

    } , [setData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const submit = creative ? put : post;
      const url = creative 
        ? route('api.adstool.creatives.update', creative.id) 
        : route('api.adstool.creatives.store');

      const payload = {
        ...data,
        campaign_id: (data as any).campaign_id ? parseInt(data.campaign_id) : null,
        content: {
          headline: (data as any).headline,
          description: (data as any).description,
          call_to_action: (data as any).call_to_action,
          links: (data as any).link_url ? [{ url: (data as any).link_url }] : [],
          text: (data as any).content_text
        } ;

      submit(url, {
        onSuccess: () => {
          toast.success(creative ? 'Criativo atualizado com sucesso!' : 'Criativo criado com sucesso!');

          reset();

          onSuccess?.();

        },
        onError: () => toast.error('Falha ao salvar criativo. Por favor, verifique os campos.'),
      });

    },
    [creative, post, put, reset, onSuccess, data],);

  return (
        <>
      <Card />
      <form onSubmit={ handleSubmit } />
        <Card.Header />
          <Card.Title>{creative ? 'Editar Criativo' : 'Criar Criativo'}</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-6" />
          <div>
           
        </div><InputLabel htmlFor="name">Nome do Criativo</InputLabel>
            <Input 
              id="name" 
              name="name" 
              value={ data.name }
              onChange={ handleChange }
              placeholder="Ex: Banner 728x90" 
           >
          { errors?.name && <InputError text={errors.name } />}
          </div>
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="type">Tipo de Criativo</InputLabel>
              <Select 
                id="type" 
                name="type" 
                value={ data.type }
                onChange={ (e: unknown) => setData('type', e.target.value as AdsCreativeType)  }>
                {creativeTypeOptions.map(opt => (
                  <option key={opt.value} value={ opt.value }>{opt.label}</option>
                ))}
              </Select>
              { errors?.type && <InputError text={errors.type } />}
            </div>
            <div>
           
        </div><InputLabel htmlFor="campaign_id">Campanha</InputLabel>
              <Select 
                id="campaign_id" 
                name="campaign_id" 
                value={ data.campaign_id }
                onChange={ (e: unknown) => setData('campaign_id', e.target.value)  }>
                {campaignOptions.map(opt => (
                  <option key={opt.value} value={ opt.value }>{opt.label}</option>
                ))}
              </Select>
              { errors?.campaign_id && <InputError text={errors.campaign_id } />}
            </div>
          {/* Conteúdo do Criativo */}
          <div className=" ">$2</div><h3 className="font-medium text-gray-900">Conteúdo do Criativo</h3>
            <div>
           
        </div><InputLabel htmlFor="headline">Título</InputLabel>
              <Input 
                id="headline" 
                name="headline" 
                value={ data.headline }
                onChange={ handleChange }
                placeholder="Título principal do anúncio"
             >
          { errors?.headline && <InputError text={errors.headline } />}
            </div>
            <div>
           
        </div><InputLabel htmlFor="description">Descrição</InputLabel>
              <Textarea 
                id="description" 
                name="description" 
                value={ data.description }
                onChange={ handleChange }
                placeholder="Descrição do anúncio"
                rows={ 3  }>
          { errors?.description && <InputError text={errors.description } />}
            </div>
            <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="call_to_action">Call to Action</InputLabel>
                <Select
                  id="call_to_action"
                  name="call_to_action"
                  value={ data.call_to_action }
                  onChange={ (e: unknown) => setData('call_to_action', e.target.value)  }>
                  <option value="learn_more">Saiba Mais</option>
                  <option value="shop_now">Comprar Agora</option>
                  <option value="sign_up">Cadastrar</option>
                  <option value="download">Baixar</option>
                  <option value="contact_us">Contato</option>
                  <option value="get_quote">Solicitar Orçamento</option>
                </Select>
                { errors?.call_to_action && <InputError text={errors.call_to_action } />}
              </div>
              <div>
           
        </div><InputLabel htmlFor="link_url">URL de Destino</InputLabel>
                <Input 
                  id="link_url" 
                  name="link_url" 
                  value={ data.link_url }
                  onChange={ handleChange }
                  placeholder="https://exemplo.com"
               >
          { errors?.link_url && <InputError text={errors.link_url } />}
              </div>
          </div>
          {/* Upload de Arquivo */}
          { data.type === 'image' && (
            <div>
           
        </div><InputLabel htmlFor="content_file">Imagem</InputLabel>
              <Input 
                id="content_file" 
                name="content_file" 
                type="file" 
                accept="image/*"
                onChange={ handleChange  }>
          { errors?.content_file && <InputError text={errors.content_file } />}
            </div>
          )}
          { data.type === 'video' && (
            <div>
           
        </div><InputLabel htmlFor="content_file">Vídeo</InputLabel>
              <Input 
                id="content_file" 
                name="content_file" 
                type="file" 
                accept="video/*"
                onChange={ handleChange  }>
          { errors?.content_file && <InputError text={errors.content_file } />}
            </div>
          )}
          {data.type === 'text' && (
            <div>
           
        </div><InputLabel htmlFor="content_text">Texto do Anúncio</InputLabel>
              <Textarea 
                id="content_text" 
                name="content_text" 
                value={ data.content_text }
                onChange={ handleChange }
                placeholder="Texto principal do anúncio"
                rows={ 4  }>
          { errors?.content_text && <InputError text={errors.content_text } />}
            </div>
          )}
        </Card.Content>
        <Card.Footer />
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="mr-2" />
              Cancelar
            </Button>
          )}
          <Button type="submit" loading={ processing } />
            {processing ? 'Salvando...' : creative ? 'Atualizar Criativo' : 'Salvar Criativo'}
          </Button>
        </Card.Footer></form></Card>);

});

CreativeForm.displayName = 'CreativeForm';
export default CreativeForm;
