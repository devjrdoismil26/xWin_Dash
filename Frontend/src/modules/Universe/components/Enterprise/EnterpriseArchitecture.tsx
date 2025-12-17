/**
 * Enterprise Architecture - Orquestrador
 */
import React from 'react';
import { ArchitectureOverview } from './Architecture/ArchitectureOverview';
import { ServicesMap } from './Architecture/ServicesMap';
import { SecurityLayer } from './Architecture/SecurityLayer';
import { ScalabilityMetrics } from './Architecture/ScalabilityMetrics';

interface EnterpriseArchitectureProps {
  organizationId?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const EnterpriseArchitecture: React.FC<EnterpriseArchitectureProps> = ({ organizationId    }) => {
  return (
            <div className=" ">$2</div><h2 className="text-2xl font-bold">Arquitetura Enterprise</h2>
      <ArchitectureOverview organizationId={organizationId} / />
      <div className=" ">$2</div><ServicesMap / />
        <SecurityLayer / /></div><ScalabilityMetrics / />
    </div>);};

export default EnterpriseArchitecture;
