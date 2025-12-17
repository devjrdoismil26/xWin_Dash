/**
 * @module ExecutionLogs
 * @description Componente para exibir logs de execução de fluxos do Aura.
 * 
 * Este componente exibe uma lista de logs de execução de fluxos, mostrando
 * mensagens e timestamps de cada log. Útil para depuração e monitoramento
 * de execuções de workflows.
 * 
 * @example
 * ```tsx
 * <ExecutionLogs
 *   logs={[
 *     { id: 1, message: "Fluxo iniciado", created_at: "2024-01-01T10:00:00Z" },
 *     { id: 2, message: "Nó processado", created_at: "2024-01-01T10:00:05Z" }
 *   ]}
 * / />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';

/**
 * Interface para um log de execução
 * 
 * @interface ExecutionLog
 * @property {string | number} id - ID único do log
 * @property {string} message - Mensagem do log
 * @property {string} [created_at] - Data/hora de criação (ISO string)
 */
interface ExecutionLog {
  /** ID único do log */
  id: string | number;
  /** Mensagem do log */
  message: string;
  /** Data/hora de criação (ISO string) */
  created_at?: string; }

/**
 * Interface para as propriedades do componente ExecutionLogs
 * 
 * @interface ExecutionLogsProps
 * @property {ExecutionLog[]} [logs] - Array de logs de execução
 */
interface ExecutionLogsProps {
  /** Array de logs de execução */
logs?: ExecutionLog[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente para exibir logs de execução de fluxos
 * 
 * @param {ExecutionLogsProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const ExecutionLogs: React.FC<ExecutionLogsProps> = ({ logs = [] as unknown[]    }) => (
  <Card />
    <Card.Header />
      <Card.Title>Logs de Execução</Card.Title>
    </Card.Header>
    <Card.Content className="p-0" />
      <ul className="divide-y" />
        {(logs || []).map((l: unknown) => (
          <li key={l.id} className="p-3 text-sm" />
            <div className=" ">$2</div><span>{l.message}</span>
              <span className="text-xs text-gray-500">{l.created_at ? new Date(l.created_at).toLocaleString('pt-BR') : '-'}</span></div></li>
        ))}
      </ul>
    </Card.Content>
  </Card>);

export default ExecutionLogs;
