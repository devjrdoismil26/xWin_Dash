import React from 'react';
import Button from '@/components/ui/Button';
import { DashboardExportButtonProps } from '../types';
const DashboardExportButton: React.FC<DashboardExportButtonProps> = ({ onExport }) => (
  <Button variant="outline" onClick={onExport}>
    Exportar
  </Button>
);
export default DashboardExportButton;
