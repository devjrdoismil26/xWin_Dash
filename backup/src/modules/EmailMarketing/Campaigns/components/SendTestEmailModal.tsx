import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/services';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import InputError from '@/components/ui/InputError';
import Button from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import Card from '@/components/ui/Card';
interface SendTestEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId?: string | number;
}
interface FormErrors {
  email?: string;
  [key: string]: string | undefined;
}
const SendTestEmailModal: React.FC<SendTestEmailModalProps> = ({ 
  open, 
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
      } catch (err: any) {
        const message = err?.response?.data?.message || 'Falha ao enviar e-mail de teste.';
        const fieldErrors = err?.response?.data?.errors || {};
        setErrors(fieldErrors);
        toast.error('Falha ao enviar e-mail de teste.', { description: message });
      } finally {
        setProcessing(false);
      }
    },
    [email, campaignId, onOpenChange]
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar e-mail de teste</DialogTitle>
        </DialogHeader>
        <Card>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <InputLabel htmlFor="test-email">E-mail de destino</InputLabel>
                <Input
                  id="test-email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <InputError text={errors.email} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Enviando...' : 'Enviar Teste'}
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
export default SendTestEmailModal;
