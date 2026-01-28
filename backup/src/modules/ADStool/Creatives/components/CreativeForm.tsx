import React, { useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputError from '@/components/ui/InputError';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Textarea from '@/components/ui/Textarea';
import { AdsCreative, AdsCreativeType } from '../../types/adsCreativeTypes';
import { AdsCampaign } from '../../types/adsCampaignTypes';
interface CreativeFormProps {
  creative?: AdsCreative | null;
  campaigns?: AdsCampaign[];
  onSuccess?: () => void;
  onCancel?: () => void;
}
interface FormData {
  name: string;
  type: AdsCreativeType;
  content_text: string;
  content_file: File | null;
  campaign_id: string;
  headline: string;
  description: string;
  call_to_action: string;
  link_url: string;
}
const CreativeForm: React.FC<CreativeFormProps> = React.memo(({ 
  creative = null, 
  campaigns = [], 
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
    link_url: creative?.content?.link_url || '',
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
    ...campaigns.map(campaign => ({
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
    }
  }, [setData]);
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const submit = creative ? put : post;
      const url = creative 
        ? route('api.adstool.creatives.update', creative.id) 
        : route('api.adstool.creatives.store');
      const payload = {
        ...data,
        campaign_id: data.campaign_id ? parseInt(data.campaign_id) : null,
        content: {
          headline: data.headline,
          description: data.description,
          call_to_action: data.call_to_action,
          link_url: data.link_url,
          text: data.content_text
        }
      };
      submit(url, {
        onSuccess: () => {
          toast.success(creative ? 'Criativo atualizado com sucesso!' : 'Criativo criado com sucesso!');
          reset();
          onSuccess?.();
        },
        onError: () => toast.error('Falha ao salvar criativo. Por favor, verifique os campos.'),
      });
    },
    [creative, post, put, reset, onSuccess, data],
  );
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Card.Header>
          <Card.Title>{creative ? 'Editar Criativo' : 'Criar Criativo'}</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-6">
          <div>
            <InputLabel htmlFor="name">Nome do Criativo</InputLabel>
            <Input 
              id="name" 
              name="name" 
              value={data.name} 
              onChange={handleChange} 
              placeholder="Ex: Banner 728x90" 
            />
            {errors?.name && <InputError text={errors.name} />}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="type">Tipo de Criativo</InputLabel>
              <Select 
                id="type" 
                name="type" 
                value={data.type} 
                onChange={(value) => setData('type', value as AdsCreativeType)}
                options={creativeTypeOptions}
              />
              {errors?.type && <InputError text={errors.type} />}
            </div>
            <div>
              <InputLabel htmlFor="campaign_id">Campanha</InputLabel>
              <Select 
                id="campaign_id" 
                name="campaign_id" 
                value={data.campaign_id} 
                onChange={(value) => setData('campaign_id', value)}
                options={campaignOptions}
              />
              {errors?.campaign_id && <InputError text={errors.campaign_id} />}
            </div>
          </div>
          {/* Conteúdo do Criativo */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Conteúdo do Criativo</h3>
            <div>
              <InputLabel htmlFor="headline">Título</InputLabel>
              <Input 
                id="headline" 
                name="headline" 
                value={data.headline} 
                onChange={handleChange} 
                placeholder="Título principal do anúncio"
              />
              {errors?.headline && <InputError text={errors.headline} />}
            </div>
            <div>
              <InputLabel htmlFor="description">Descrição</InputLabel>
              <Textarea 
                id="description" 
                name="description" 
                value={data.description} 
                onChange={handleChange} 
                placeholder="Descrição do anúncio"
                rows={3}
              />
              {errors?.description && <InputError text={errors.description} />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <InputLabel htmlFor="call_to_action">Call to Action</InputLabel>
                <Select
                  id="call_to_action"
                  name="call_to_action"
                  value={data.call_to_action}
                  onChange={(value) => setData('call_to_action', value)}
                  options={[
                    { value: 'learn_more', label: 'Saiba Mais' },
                    { value: 'shop_now', label: 'Comprar Agora' },
                    { value: 'sign_up', label: 'Cadastrar' },
                    { value: 'download', label: 'Baixar' },
                    { value: 'contact_us', label: 'Contato' },
                    { value: 'get_quote', label: 'Solicitar Orçamento' }
                  ]}
                />
                {errors?.call_to_action && <InputError text={errors.call_to_action} />}
              </div>
              <div>
                <InputLabel htmlFor="link_url">URL de Destino</InputLabel>
                <Input 
                  id="link_url" 
                  name="link_url" 
                  value={data.link_url} 
                  onChange={handleChange} 
                  placeholder="https://exemplo.com"
                />
                {errors?.link_url && <InputError text={errors.link_url} />}
              </div>
            </div>
          </div>
          {/* Upload de Arquivo */}
          {data.type === 'image' && (
            <div>
              <InputLabel htmlFor="content_file">Imagem</InputLabel>
              <Input 
                id="content_file" 
                name="content_file" 
                type="file" 
                accept="image/*"
                onChange={handleChange} 
              />
              {errors?.content_file && <InputError text={errors.content_file} />}
            </div>
          )}
          {data.type === 'video' && (
            <div>
              <InputLabel htmlFor="content_file">Vídeo</InputLabel>
              <Input 
                id="content_file" 
                name="content_file" 
                type="file" 
                accept="video/*"
                onChange={handleChange} 
              />
              {errors?.content_file && <InputError text={errors.content_file} />}
            </div>
          )}
          {data.type === 'text' && (
            <div>
              <InputLabel htmlFor="content_text">Texto do Anúncio</InputLabel>
              <Textarea 
                id="content_text" 
                name="content_text" 
                value={data.content_text} 
                onChange={handleChange} 
                placeholder="Texto principal do anúncio"
                rows={4}
              />
              {errors?.content_text && <InputError text={errors.content_text} />}
            </div>
          )}
        </Card.Content>
        <Card.Footer>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="mr-2">
              Cancelar
            </Button>
          )}
          <Button type="submit" loading={processing}>
            {processing ? 'Salvando...' : creative ? 'Atualizar Criativo' : 'Salvar Criativo'}
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
});
CreativeForm.displayName = 'CreativeForm';
export default CreativeForm;
