/**
 * @module MultipleChoiceNode
 * @description Componente de nó para criar perguntas de múltipla escolha em fluxos do Aura.
 * 
 * Este componente permite criar perguntas com múltiplas opções de resposta, onde o usuário
 * pode escolher uma opção e o fluxo seguirá para diferentes caminhos baseado na escolha.
 * Útil para criar menus interativos, pesquisas, ou fluxos condicionais baseados em escolhas.
 * 
 * @example
 * ```tsx
 * <MultipleChoiceNode
 *   config={ 
 *     question: "Como podemos ajudar?",
 *     optionsText: "Suporte\nVendas\nFinanceiro"
 *   } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Textarea from '@/shared/components/ui/Textarea';

/**
 * Interface para uma opção de múltipla escolha
 * 
 * @interface MultipleChoiceOption
 * @property {string} value - Valor da opção
 * @property {string} label - Rótulo exibido para o usuário
 * @property {string | null} next_node_id - ID do próximo nó (definido via conexões visuais)
 */
interface MultipleChoiceOption {
  /** Valor da opção */
  value: string;
  /** Rótulo exibido para o usuário */
  label: string;
  /** ID do próximo nó (definido via conexões visuais no editor) */
  next_node_id: string | null; }

/**
 * Interface para as propriedades do componente MultipleChoiceNode
 * 
 * @interface MultipleChoiceNodeProps
 * @property {Record<string, any>} [config] - Configuração do nó de múltipla escolha
 * @property {string} [config.question] - Pergunta a ser exibida ao usuário
 * @property {MultipleChoiceOption[]} [config.options] - Array de opções disponíveis
 * @property {string} [config.optionsText] - Texto das opções (uma por linha) para edição
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configuração é alterada
 */
interface MultipleChoiceNodeProps {
  /** Configuração do nó de múltipla escolha */
config?: {
/** Pergunta a ser exibida ao usuário */
question?: string;
  /** Array de opções disponíveis para escolha */
options?: MultipleChoiceOption[];
  /** Texto das opções (uma por linha) usado para edição no textarea */
optionsText?: string;
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
 * Componente de nó para criar perguntas de múltipla escolha
 * 
 * @param {MultipleChoiceNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const MultipleChoiceNode: React.FC<MultipleChoiceNodeProps> = ({ config = {} as any, onChange }) => {
  /**
   * Manipula a mudança na pergunta
   * 
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - Evento de mudança do textarea
   */
  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.({ ...config, question: e.target.value });};

  /**
   * Manipula a mudança nas opções (converte texto em array de objetos)
   * 
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - Evento de mudança do textarea
   */
  const handleOptionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const optionsText = e.target.value;
    const optionLines = optionsText.split('\n').filter(line => line.trim());

    // Converter para formato esperado pelo backend: array de objetos {value, next_node_id}
    const options: MultipleChoiceOption[] = (optionLines || []).map((line: unknown) => ({
      value: line.trim(),
      next_node_id: null, // Será definido via conexões visuais
      label: line.trim()
  }));

    onChange?.({ ...config, options, optionsText });};

  return (
        <>
      <Card title="Múltipla Escolha" />
      <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
            Pergunta
          </label>
          <Textarea 
            value={ config.question || '' }
            onChange={ handleQuestionChange }
            placeholder="Digite sua pergunta..."
            className="min-h-[80px]"
          / /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
            Opções (uma por linha)
          </label>
          <Textarea 
            value={ config.optionsText || (config.options || []).map(opt => opt.label || opt.value).join('\n') }
            onChange={ handleOptionsChange }
            placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
            className="min-h-[100px]" />
          {config.options && config.options.length > 0 && (
            <div className="{config.options.length} opções configuradas">$2</div>
    </div>
  )}
        </div>
    </Card>);};

export default MultipleChoiceNode;
