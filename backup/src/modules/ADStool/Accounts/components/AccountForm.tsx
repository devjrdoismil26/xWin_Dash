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
import { AdsAccount, AdsPlatform, AdsAccountStatus } from '../../types/adsAccountTypes';
interface AccountFormProps {
  onSuccess?: () => void;
}
interface FormData {
  name: string;
  platform: AdsPlatform;
  account_id: string;
  access_token: string;
}
const AccountForm: React.FC<AccountFormProps> = ({ onSuccess }) => {
  const { data, setData, post, processing, errors, reset } = useForm<FormData>({
    name: '',
    platform: 'facebook_ads',
    account_id: '',
    access_token: '',
  });
  const platformOptions = [
    { value: 'facebook_ads', label: 'Facebook Ads' },
    { value: 'google_ads', label: 'Google Ads' },
    { value: 'linkedin_ads', label: 'LinkedIn Ads' },
    { value: 'twitter_ads', label: 'Twitter Ads' },
    { value: 'tiktok_ads', label: 'TikTok Ads' }
  ];
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setData(name as keyof FormData, value);
    },
    [setData],
  );
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      post(route('api.adstool.accounts.store'), {
        onSuccess: () => {
          toast.success('Conta conectada com sucesso!');
          reset();
          onSuccess?.();
        },
        onError: () => {
          toast.error('Ocorreu um erro inesperado. Por favor, tente novamente.');
        },
      });
    },
    [post, reset, onSuccess],
  );
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Card.Header>
          <Card.Title>Conectar Nova Conta de Anúncio</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div>
            <InputLabel htmlFor="name">Nome</InputLabel>
            <Input 
              id="name" 
              name="name" 
              value={data.name} 
              onChange={handleChange} 
              placeholder="Nome da conta" 
            />
            {errors?.name && <InputError text={errors.name} />}
          </div>
          <div>
            <InputLabel htmlFor="platform">Plataforma</InputLabel>
            <Select 
              id="platform" 
              name="platform" 
              value={data.platform} 
              onChange={(value) => setData('platform', value as AdsPlatform)}
              options={platformOptions}
            />
            {errors?.platform && <InputError text={errors.platform} />} 
          </div>
          <div>
            <InputLabel htmlFor="account_id">ID da Conta</InputLabel>
            <Input 
              id="account_id" 
              name="account_id" 
              value={data.account_id} 
              onChange={handleChange} 
              placeholder="ID da conta" 
            />
            {errors?.account_id && <InputError text={errors.account_id} />}
          </div>
          <div>
            <InputLabel htmlFor="access_token">Access Token</InputLabel>
            <Textarea 
              id="access_token" 
              name="access_token" 
              value={data.access_token} 
              onChange={handleChange} 
              placeholder="Cole o token de acesso" 
              rows={3}
            />
            {errors?.access_token && <InputError text={errors.access_token} />}
          </div>
        </Card.Content>
        <Card.Footer>
          <Button type="submit" loading={processing}>
            {processing ? 'Conectando...' : 'Conectar Conta'}
          </Button>
        </Card.Footer>
      </form>
    </Card>
  );
};
export default AccountForm;
