/**
 * Página CreateGeneration - Criação de Geração de IA
 * @module modules/AI/pages/CreateGeneration
 * @description
 * Página para criar novas gerações de IA, fornecendo formulário simples
 * com input de prompt e botão de criação. Integra com PageLayout para
 * fornecer estrutura consistente de página.
 * @since 1.0.0
 */
import React, { useState } from 'react';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Textarea from '@/shared/components/ui/Textarea';

/**
 * Interface CreateGenerationProps - Props da página CreateGeneration
 * @interface CreateGenerationProps
 * @property {function} [onCreate] - Função callback chamada ao criar geração (opcional)
 * @property {(prompt: string) => void} [onCreate] - Callback com prompt da geração
 */
interface CreateGenerationProps {
  onCreate??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente CreateGeneration - Página de Criação de Geração de IA
 * @component
 * @description
 * Componente que renderiza a página de criação de gerações de IA,
 * fornecendo formulário simples com input de prompt e botão de criação.
 * 
 * @param {CreateGenerationProps} props - Props da página
 * @returns {JSX.Element} Página de criação de geração
 * 
 * @example
 * ```tsx
 * <CreateGeneration onCreate={ (prompt: unknown) =>  } />
 * ```
 */
const CreateGeneration: React.FC<CreateGenerationProps> = ({ onCreate    }) => {
  const [prompt, setPrompt] = useState('');

  return (
        <>
      <PageLayout title="Criar Geração" />
      <Card />
        <Card.Content className="p-6 space-y-4" />
          <Textarea value={prompt} onChange={(e: unknown) => setPrompt(e.target.value)} placeholder="Digite o prompt..." />
          <Button onClick={ () => onCreate?.(prompt) }>Criar</Button>
        </Card.Content></Card></PageLayout>);};

export default CreateGeneration;
