/**
 * @module DelayNode
 * @description Componente de nó para adicionar delay/espera em fluxos do Aura.
 * 
 * Este componente permite configurar um tempo de espera (delay) durante a execução
 * de um fluxo, pausando a execução por um período determinado antes de continuar
 * para o próximo nó. Útil para criar intervalos entre mensagens ou aguardar
 * processamento.
 * 
 * @example
 * ```tsx
 * <DelayNode
 *   config={ delay_seconds: 30 } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';

/**
 * Interface para as propriedades do componente DelayNode
 * 
 * @interface DelayNodeProps
 * @property {Record<string, any>} [config] - Configuração do nó de delay
 * @property {number} [config.delay_seconds] - Tempo de espera em segundos (padrão: 5, máximo: 3600)
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configuração é alterada
 */
interface DelayNodeProps {
  /** Configuração do nó de delay */
config?: {
/** Tempo de espera em segundos (padrão: 5, máximo: 3600 = 1 hora) */
delay_seconds?: number;
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
 * Formata o tempo em segundos para uma representação legível
 * 
 * @param {number} seconds - Tempo em segundos
 * @returns {string} Tempo formatado (ex: "30s", "5m 30s", "1h 30m")
 */
const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;};

/**
 * Componente de nó para adicionar delay/espera no fluxo
 * 
 * @param {DelayNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const DelayNode: React.FC<DelayNodeProps> = ({ config = {} as any, onChange }) => {
  /**
   * Manipula a mudança no valor do delay
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de mudança do input
   */
  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seconds = parseInt(e.target.value) || 0;
    onChange?.({ ...config, delay_seconds: seconds });};

  return (
        <>
      <Card title="Aguardar" />
      <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
            Tempo de espera (segundos)
          </label>
          <Input 
            type="number" 
            min="1"
            max="3600"
            value={ config.delay_seconds || 5 }
            onChange={ handleDelayChange }
            placeholder="5"
         >
          {config.delay_seconds && (
            <div className="Aguardar: {formatTime(config.delay_seconds)}">$2</div>
    </div>
  )}
        </div>
        <div className="Máximo: 1 hora (3600 segundos)">$2</div>
        </div>
    </Card>);};

export default DelayNode;
