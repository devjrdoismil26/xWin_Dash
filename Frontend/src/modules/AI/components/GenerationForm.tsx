/**
 * Componente GenerationForm - Formulário de Geração de IA
 * @module modules/AI/components/GenerationForm
 * @description
 * Componente de formulário para criar novas gerações de IA, fornecendo
 * input de prompt, seleção de tipo (texto, imagem, código) e botão de geração.
 * @since 1.0.0
 */
import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Textarea from '@/shared/components/ui/Textarea';
import Select from '@/shared/components/ui/Select';

/**
 * Interface GenerationFormProps - Props do componente GenerationForm
 * @interface GenerationFormProps
 * @property {function} [onSubmit] - Função callback chamada ao submeter formulário (opcional)
 * @property {(data: { prompt: string; type: string }) => void} [onSubmit] - Callback com dados do formulário
 * @property {string} [title='Nova Geração'] - Título do formulário (opcional, padrão: 'Nova Geração')
 */
interface GenerationFormProps {
  onSubmit?: (e: any) => void;
  onChange?: (e: any) => void; }) => void;
  title?: string;
}

/**
 * Componente GenerationForm - Formulário de Geração de IA
 * @component
 * @description
 * Componente que renderiza formulário completo para criar novas gerações de IA,
 * incluindo input de prompt, seleção de tipo e botão de geração.
 * 
 * @param {GenerationFormProps} props - Props do componente
 * @returns {JSX.Element} Formulário de geração
 * 
 * @example
 * ```tsx
 * <GenerationForm 
 *   title="Geração Personalizada"
 *   onSubmit={({ prompt, type }) => } 
 * />
 * ```
 */
const GenerationForm: React.FC<GenerationFormProps> = ({ onSubmit, title = 'Nova Geração'    }) => {
  const [prompt, setPrompt] = useState('');

  const [type, setType] = useState('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit?.({ prompt, type });};

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-4" />
        <Textarea value={prompt} onChange={(e: unknown) => setPrompt(e.target.value)} placeholder="Descreva sua geração..." />
        <Select value={type} onChange={ (e: unknown) => setType(e.target.value)  }>
          <option value="text">Texto</option>
          <option value="image">Imagem</option>
          <option value="code">Código</option></Select></Card.Content>
      <Card.Footer />
        <Button onClick={ handleSubmit }>Gerar</Button>
      </Card.Footer>
    </Card>);};

export default GenerationForm;
