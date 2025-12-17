/**
 * Universe Interface - Orquestrador
 */
import React, { useState } from 'react';
import { InterfaceHeader } from './Interface/InterfaceHeader';
import { CanvasArea } from './Interface/CanvasArea';
import { BlocksPalette } from './Interface/BlocksPalette';
import { PropertiesPanel } from './Interface/PropertiesPanel';

interface UniverseInterfaceProps {
  projectId?: string;
  mode?: 'edit' | 'view';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const UniverseInterface: React.FC<UniverseInterfaceProps> = ({ projectId, mode = 'edit'    }) => {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  return (
            <div className=" ">$2</div><InterfaceHeader projectId={projectId} mode={mode} / />
      <div className=" ">$2</div><BlocksPalette / />
        <CanvasArea onSelectBlock={setSelectedBlock} / />
        <PropertiesPanel selectedBlock={selectedBlock} / />
      </div>);};

export default UniverseInterface;
