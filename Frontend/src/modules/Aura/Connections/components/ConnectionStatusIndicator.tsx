/**
 * @module ConnectionStatusIndicator
 * @description Componente para exibir o status de conex?o de forma visual.
 * 
 * Este componente mostra um indicador visual do status de uma conex?o
 * (conectado, pendente ou desconectado) com cores e labels apropriados.
 * 
 * @example
 * ```tsx
 * <ConnectionStatusIndicator status="connected" / />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';

/**
 * Tipo para os status de conex?o dispon?veis
 */
type ConnectionStatus = 'connected' | 'pending' | 'disconnected';

/**
 * Interface para as propriedades do componente ConnectionStatusIndicator
 * 
 * @interface ConnectionStatusIndicatorProps
 * @property {ConnectionStatus} status - Status da conex?o
 */
interface ConnectionStatusIndicatorProps {
  /** Status da conex?o */
status: ConnectionStatus;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente para exibir o status de conex?o
 * 
 * @param {ConnectionStatusIndicatorProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({ status    }) => {
  const color = status === 'connected' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400';
  const label = status === 'connected' ? 'Conectado' : status === 'pending' ? 'Pendente' : 'Desconectado';
  return (
        <>
      <span className={`inline-flex items-center gap-2 text-xs ${color} text-white px-2 py-1 rounded`}>
      </span><span className="w-2 h-2 bg-white rounded-full">
           
        </span>{label}
    </span>);};

export default ConnectionStatusIndicator;
