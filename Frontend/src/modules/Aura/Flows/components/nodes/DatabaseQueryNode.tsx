/**
 * @module DatabaseQueryNode
 * @description Componente de n? para execu??o de consultas ao banco de dados em fluxos do Aura.
 * 
 * Este componente permite configurar e executar consultas SQL dentro de um fluxo de automa??o,
 * permitindo buscar, inserir ou atualizar dados no banco de dados durante a execu??o do fluxo.
 * 
 * @example
 * ```tsx
 * <DatabaseQueryNode
 *   config={ query: "SELECT * FROM users WHERE id = ?" } *   onChange={ (newConfig: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Textarea from '@/shared/components/ui/Textarea';

/**
 * Interface para as propriedades do componente DatabaseQueryNode
 * 
 * @interface DatabaseQueryNodeProps
 * @property {Record<string, any>} [config] - Configura??o do n? de consulta ao banco
 * @property {string} [config.query] - Query SQL a ser executada
 * @property {(config: Record<string, any>) => void} [onChange] - Callback chamado quando a configura??o ? alterada
 */
interface DatabaseQueryNodeProps {
  /** Configura??o do n? de consulta ao banco de dados */
config?: {
/** Query SQL a ser executada no banco de dados */
query?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void;
  [key: string]: unknown; };

  /** Callback chamado quando a configura??o ? alterada */
  onChange?: (e: any) => void;
}

/**
 * Componente de n? para execu??o de consultas ao banco de dados
 * 
 * @param {DatabaseQueryNodeProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const DatabaseQueryNode: React.FC<DatabaseQueryNodeProps> = ({ config = {} as any, onChange }) => (
  <Card title="Consulta ao Banco" />
    <div className=" ">$2</div><Textarea 
        value={ config.query || '' }
        onChange={(e: unknown) => onChange?.({ ...config, query: e.target.value })} 
        placeholder="SQL..." /></div></Card>);

export default DatabaseQueryNode;
