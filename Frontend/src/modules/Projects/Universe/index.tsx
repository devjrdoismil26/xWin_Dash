// ========================================
// UNIVERSE - COMPONENTE PRINCIPAL (REFATORADO)
// ========================================
import React from 'react';
import UniverseInterfaceSimple from './core/UniverseInterfaceSimple';

interface UniverseProps {
  auth?: any;
}

const Universe: React.FC<UniverseProps> = ({ auth }) => {
  return <UniverseInterfaceSimple auth={auth} />;
};

export default Universe;