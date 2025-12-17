/**
 * @module AITextGenerationNode
 * @description Componente de nó para geração de texto usando IA em fluxos do Aura.
 * 
 * Este componente permite configurar um prompt para geração de texto através de IA
 * dentro de um fluxo de automação do Aura. O texto gerado pode ser usado em mensagens
 * ou armazenado em variáveis do fluxo.
 * 
 * @example
 * ```tsx
 * <AITextGenerationNode
 *   config={ prompt: "Crie uma mensagem de boas-vindas" } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Textarea from '@/shared/components/ui/Textarea';

/**
 * Interface para as propriedades do componente AITextGenerationNode
 * 
 * @interface AITextGenerationNodeProps
 * @property {Record<string, any>} [config] - Configuração do nó de geração de texto
 * @property {string} [config.prompt] - Prompt para a geração de texto pela IA
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configuração é alterada
 */
interface AITextGenerationNodeProps {
  /** Configuração do nó de geração de texto */
config?: {
/** Prompt para a geração de texto pela IA */
prompt?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void;
  [key: string]: unknown; };

  /** Callback chamado quando a configuração é alterada */
  onChange?: (e: any) => void;
}

/**
 * Componente de nó para geração de texto usando IA
 * 
 * @param {AITextGenerationNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const AITextGenerationNode: React.FC<AITextGenerationNodeProps> = ({ config = {} as any, onChange }) => (
  <Card title="IA: Geração de Texto" />
    <div className=" ">$2</div><Textarea 
        value={ config.prompt || '' }
        onChange={(e: unknown) => onChange?.({ ...config, prompt: e.target.value })} 
        placeholder="Prompt" /></div></Card>);

export default AITextGenerationNode;
