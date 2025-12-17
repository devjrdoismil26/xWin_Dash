/**
 * Componente AIGenerationForm - Formulário de Geração de Conteúdo com IA
 * @module modules/AI/components/AIGenerationForm
 * @description
 * Componente de formulário para geração de conteúdo com IA, fornecendo
 * input de prompt, seleção de modelo e botão de geração.
 * @since 1.0.0
 */
import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Textarea from '@/shared/components/ui/Textarea';
import Select from '@/shared/components/ui/Select';

/**
 * Interface AIGenerationFormProps - Props do componente AIGenerationForm
 * @interface AIGenerationFormProps
 * @property {string} [title='Geração de Conteúdo'] - Título do formulário (opcional, padrão: 'Geração de Conteúdo')
 * @property {function} onGenerate - Função callback chamada ao gerar conteúdo
 * @property {(prompt: string, model: string) => void} onGenerate - Callback com prompt e modelo selecionado
 */
interface AIGenerationFormProps {
  title?: string;
  onGenerate?: (e: any) => void;
  onChange?: (e: any) => void; }) => void;
}

/**
 * Componente AIGenerationForm - Formulário de Geração de Conteúdo com IA
 * @component
 * @description
 * Componente que renderiza um formulário completo para geração de conteúdo com IA,
 * incluindo área de texto para prompt, seleção de modelo e botão de geração.
 * 
 * @param {AIGenerationFormProps} props - Props do componente
 * @returns {JSX.Element} Formulário de geração de conteúdo
 * 
 * @example
 * ```tsx
 * <AIGenerationForm 
 *   title="Geração de Texto"
 *   onGenerate={({ prompt, model }) => } 
 * />
 * ```
 */
const AIGenerationForm: React.FC<AIGenerationFormProps> = ({ title = 'Geração de Conteúdo', onGenerate    }) => {
  const [prompt, setPrompt] = useState('');

  const [model, setModel] = useState('gpt-4');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onGenerate?.({ prompt, model });};

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-4" />
        <Textarea value={prompt} onChange={(e: unknown) => setPrompt(e.target.value)} placeholder="Escreva seu prompt..." />
        <Select value={model} onChange={ (e: unknown) => setModel(e.target.value)  }>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gemini-pro">Gemini Pro</option></Select></Card.Content>
      <Card.Footer />
        <Button onClick={ handleSubmit }>Gerar</Button>
      </Card.Footer>
    </Card>);};

export { AIGenerationForm };

export default AIGenerationForm;
