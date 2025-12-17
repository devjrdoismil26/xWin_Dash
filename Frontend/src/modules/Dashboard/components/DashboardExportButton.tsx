/**
 * @module modules/Dashboard/components/DashboardExportButton
 * @description
 * Bot?o de exporta??o do dashboard.
 * 
 * Componente simples que fornece um bot?o para exportar dados do dashboard.
 * 
 * @example
 * ```typescript
 * <DashboardExportButton
 *   onExport={() => {
 *     // L?gica de exporta??o
 *   } * />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Button from '@/shared/components/ui/Button';
import { DashboardExportButtonProps } from '../types';

/**
 * Componente bot?o de exporta??o do dashboard
 * @param {DashboardExportButtonProps} props - Props do bot?o
 * @returns {JSX.Element} Bot?o de exporta??o
 */
const DashboardExportButton: React.FC<DashboardExportButtonProps> = ({ onExport    }) => (
  <Button variant="outline" onClick={ onExport } />
    Exportar
  </Button>);

export default DashboardExportButton;
