/**
 * @module EndFlow
 * @description Componente de n? terminal para encerrar um fluxo do Aura.
 * 
 * Este componente representa o ponto final de um fluxo de automa??o. Quando o fluxo
 * atinge este n?, a execu??o ? encerrada e o fluxo ? marcado como conclu?do.
 * N?o requer configura??o adicional, servindo apenas como marcador visual e l?gico
 * do fim do fluxo.
 * 
 * @example
 * ```tsx
 * <EndFlow / />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';

/**
 * Componente de n? terminal para encerrar um fluxo
 * 
 * Este componente n?o possui props, pois serve apenas como marcador do fim do fluxo.
 * 
 * @returns {JSX.Element} Componente renderizado
 */
const EndFlow: React.FC = () => (
  <Card title="Encerrar Fluxo" />
    <div className="p-6 text-sm text-gray-500">Fim do fluxo.</div>
  </Card>);

export default EndFlow;
