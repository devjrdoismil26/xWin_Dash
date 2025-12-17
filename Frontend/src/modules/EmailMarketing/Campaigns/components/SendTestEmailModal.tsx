import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errorHelpers';
import { apiClient } from '@/services';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import InputError from '@/shared/components/ui/InputError';
import Button from '@/shared/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/Dialog';
import Card from '@/shared/components/ui/Card';
interface SendTestEmailModalProps {
  open: boolean;
  onOpenChange?: (e: any) => void;
  campaignId?: string | number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
interface FormErrors {
  email?: string;
  [key: string]: string | undefined; }
const SendTestEmailModal: React.FC<SendTestEmailModalProps> = ({ open, 
  onOpenChange, 
  campaignId 
   }) => {
  const [email, setEmail] = useState<string>('');

  const [processing, setProcessing] = useState<boolean>(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setProcessing(true);

      setErrors({});

      try {
        await apiClient.post('/api/email-marketing/campaigns/send-test', {
          email,
          campaign_id: campaignId,
        });

        toast.success('E-mail de teste enviado com sucesso!');

        setEmail('');

        onOpenChange(false);

      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);

        const errorObj = err as { response?: { data?: { message?: string; errors?: Record<string, string> } };

        const message = errorObj?.response?.data?.message || errorMessage;
        const fieldErrors = errorObj?.response?.data?.errors || {};

        setErrors(fieldErrors);

        toast.error('Falha ao enviar e-mail de teste.', { description: message });

      } finally {
        setProcessing(false);

      } ,
    [email, campaignId, onOpenChange]);

  return (
        <>
      <Dialog open={open} onOpenChange={ onOpenChange } />
      <DialogContent className="max-w-md" />
        <DialogHeader />
          <DialogTitle>Enviar e-mail de teste</DialogTitle></DialogHeader><Card />
          <Card.Content />
            <form onSubmit={handleSubmit} className="space-y-4" />
              <div>
           
        </div><InputLabel htmlFor="test-email">E-mail de destino</InputLabel>
                <Input
                  id="test-email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  value={ email }
                  onChange={ (e: unknown) => setEmail(e.target.value) }
                  required />
                <InputError text={errors.email} / /></div><div className=" ">$2</div><Button 
                  type="button" 
                  variant="outline" 
                  onClick={ () => onOpenChange(false)  }>
                  Cancelar
                </Button>
                <Button type="submit" disabled={ processing } />
                  {processing ? 'Enviando...' : 'Enviar Teste'}
                </Button></div></form>
          </Card.Content></Card></DialogContent>
    </Dialog>);};

export default SendTestEmailModal;
