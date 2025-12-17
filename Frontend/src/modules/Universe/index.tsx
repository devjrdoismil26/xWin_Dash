// ========================================
// UNIVERSE - COMPONENTE PRINCIPAL (REFATORADO)
// ========================================
import React from 'react';
import UniverseInterfaceSimple from './core/UniverseInterface';

interface UniverseProps {
  auth?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const Universe: React.FC<UniverseProps> = ({ auth    }) => { return <UniverseInterfaceSimple auth={auth } />;};

export default Universe;