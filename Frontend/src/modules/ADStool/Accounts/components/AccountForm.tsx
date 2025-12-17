/**
 * Formulário de conta de anúncios
 *
 * @description
 * Formulário para conectar novas contas de anúncios ao sistema.
 * Suporta múltiplas plataformas (Facebook, Google, LinkedIn, Twitter, TikTok)
 * e validação de campos obrigatórios.
 *
 * @module modules/ADStool/Accounts/components/AccountForm
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
import { AdsAccount, AdsPlatform, AdsAccountStatus } from '../../types/adsAccountTypes';

/**
 * Props do componente AccountForm
 *
 * @interface AccountFormProps
 * @property {() => void} [onSuccess] - Callback quando conta é conectada com sucesso
 */
interface AccountFormProps {
  onSuccess???: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
interface FormData {
  name: string;
  platform: AdsPlatform;
  account_id: string;
  access_token: string; }
/**
 * Componente AccountForm
 *
 * @description
 * Formulário completo para conectar conta de anúncios com campos para nome,
 * plataforma, ID da conta e token de acesso.
 * Integra com Inertia.js para submissão e exibe mensagens de feedback.
 *
 * @param {AccountFormProps} props - Props do componente
 * @returns {JSX.Element} Formulário de conta de anúncios
 *
 * @example
 * ```tsx
 * <AccountForm onSuccess={ () => router.reload() } />
 * ```
 */
const AccountForm: React.FC<AccountFormProps> = ({ onSuccess    }) => {
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
    [setData],);

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
    [post, reset, onSuccess],);

  return (
        <>
      <Card />
      <form onSubmit={ handleSubmit } />
        <Card.Header />
          <Card.Title>Conectar Nova Conta de Anúncio</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-4" />
          <div>
           
        </div><InputLabel htmlFor="name">Nome</InputLabel>
            <Input 
              id="name" 
              name="name" 
              value={ data.name }
              onChange={ handleChange }
              placeholder="Nome da conta" 
           >
          { errors?.name && <InputError text={errors.name } />}
          </div>
          <div>
           
        </div><InputLabel htmlFor="platform">Plataforma</InputLabel>
            <Select 
              id="platform" 
              name="platform" 
              value={ data.platform }
              onChange={ (e: unknown) => setData('platform', e.target.value as AdsPlatform)  }>
              {platformOptions.map(opt => (
                <option key={opt.value} value={ opt.value }>{opt.label}</option>
              ))}
            </Select>
            { errors?.platform && <InputError text={errors.platform } />} 
          </div>
          <div>
           
        </div><InputLabel htmlFor="account_id">ID da Conta</InputLabel>
            <Input 
              id="account_id" 
              name="account_id" 
              value={ data.account_id }
              onChange={ handleChange }
              placeholder="ID da conta" 
           >
          { errors?.account_id && <InputError text={errors.account_id } />}
          </div>
          <div>
           
        </div><InputLabel htmlFor="access_token">Access Token</InputLabel>
            <Textarea 
              id="access_token" 
              name="access_token" 
              value={ data.access_token }
              onChange={ handleChange }
              placeholder="Cole o token de acesso" 
              rows={ 3  }>
          { errors?.access_token && <InputError text={errors.access_token } />}
          </div>
        </Card.Content>
        <Card.Footer />
          <Button type="submit" loading={ processing } />
            {processing ? 'Conectando...' : 'Conectar Conta'}
          </Button>
        </Card.Footer></form></Card>);};

export default AccountForm;
