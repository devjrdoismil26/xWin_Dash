import React, { useState, useCallback } from 'react';
import Card from '@/shared/components/ui/Card';
import Textarea from '@/shared/components/ui/Textarea';
import InputLabel from '@/shared/components/ui/InputLabel';
import InputError from '@/shared/components/ui/InputError';
import Button from '@/shared/components/ui/Button';
import { apiClient } from '@/services';
import { toast } from 'sonner';
const SubjectOptimizerForm: React.FC<{onOptimize}> = ({ onOptimize    }) => {
  const [subject, setSubject] = useState('');

  const [content, setContent] = useState('');

  const [processing, setProcessing] = useState(false);

  const [errors, setErrors] = useState({});

  const handleSubmit = useCallback(async (e: unknown) => {
    e.preventDefault();

    setProcessing(true);

    setErrors({});

    try {
      const { data } = await apiClient.post('/api/email-marketing/optimization/optimize-subject', { subject, content });

      onOptimize?.(data?.optimized_subject || '');

      toast.success('Assunto otimizado com sucesso!');

    } catch (err) {
      const message = err?.response?.data?.message || 'Erro ao otimizar assunto.';
      setErrors(err?.response?.data?.errors || {});

      toast.error('Erro ao otimizar assunto.', { description: message });

    } finally {
      setProcessing(false);

    } , [subject, content, onOptimize]);

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Otimizar Assunto</Card.Title>
      </Card.Header>
      <Card.Content />
        <form onSubmit={handleSubmit} className="space-y-4" />
          <div>
           
        </div><InputLabel htmlFor="subject">Assunto atual</InputLabel>
            <Textarea id="subject" rows={2} value={subject} onChange={(e: unknown) => setSubject(e.target.value)} placeholder="Digite o assunto atual do e-mail..." required />
            <InputError text={errors.subject} / /></div><div>
           
        </div><InputLabel htmlFor="content">Conteúdo (opcional)</InputLabel>
            <Textarea id="content" rows={5} value={content} onChange={(e: unknown) => setContent(e.target.value)} placeholder="Cole o conteúdo do e-mail para contexto melhor..." />
            <InputError text={errors.content} / /></div><div className=" ">$2</div><Button type="submit" disabled={ processing }>{processing ? 'Otimizando...' : 'Otimizar'}</Button></div></form>
      </Card.Content>
    </Card>);};

export default SubjectOptimizerForm;
