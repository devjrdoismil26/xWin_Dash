import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';
import Textarea from '@/shared/components/ui/Textarea';
import Select from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';
import { useValidatedPost } from '@/hooks/useValidatedApi';
import { TextGenerationResponseSchema } from '@/schemas/ai.schema';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Terminal } from 'lucide-react';
import { BrainLoader } from '@/shared/components/ui/BrainLoader';

const TextGeneration: React.FC = () => {
  const [prompt, setPrompt] = useState('');

  const [model, setModel] = useState('claude-3-haiku-20240307');

  // Hook para a chamada de API, usando o schema de validação da resposta
  const { post: generateText, loading, data, error, reset } = useValidatedPost(
    '/api/ai/generate-text', 
    TextGenerationResponseSchema);

  const handleGenerate = async () => {
    if (!prompt) {
      // Opcional: Adicionar um alerta para o usuário se o prompt estiver vazio
      return;
    }
    // O corpo da requisição deve corresponder ao que o backend espera
    await generateText({ prompt, model });};

  // Limpa o erro quando o usuário começa a digitar novamente
  useEffect(() => {
    if (prompt || model) {
      reset();

    } , [prompt, model, reset]);

  return (
        <>
      <PageLayout title="Geração de Texto Unificada" />
      <Head title="Geração de Texto" / />
      <Card />
        <Card.Content className="p-6 space-y-4" />
          <div className=" ">$2</div><label className="text-sm font-medium">Prompt</label>
            <Textarea 
              value={ prompt }
              onChange={ (e: unknown) => setPrompt(e.target.value) }
              placeholder="Ex: Crie uma persona de cliente para um software de análise de dados focado em startups de tecnologia..."
              className="min-h-[150px]" /></div><div className=" ">$2</div><label className="text-sm font-medium">Modelo</label>
            <Select 
              value={ model }
              onChange={ (value: unknown) => setModel(String(value)) }
              options={[
                { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
                { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
                { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
                { value: 'gpt-4', label: 'GPT-4' },
                { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
                { value: 'gemini-pro', label: 'Gemini Pro' },
              ]} /></div><Button onClick={handleGenerate} disabled={ loading } />
            {loading ? (
              <>
                <BrainLoader className="mr-2" />
                Gerando...
              </>
            ) : 'Gerar'}
          </Button>

          {error && (
            <Alert variant="destructive" />
              <Terminal className="h-4 w-4" />
              <AlertTitle>Erro na Geração</AlertTitle>
              <AlertDescription />
                {error || "Ocorreu um erro ao se comunicar com a API."}
              </AlertDescription>
      </Alert>
    </>
  )}

          {data?.result && (
            <div className="{data.result}">$2</div>
    </div>
  )}
        </Card.Content></Card></PageLayout>);};

export default TextGeneration;
