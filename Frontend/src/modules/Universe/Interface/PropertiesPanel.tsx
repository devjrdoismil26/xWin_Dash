import React from 'react';

export const PropertiesPanel: React.FC<{ selectedBlock: string | null }> = ({ selectedBlock    }) => (
  <div className=" ">$2</div><h3 className="font-semibold mb-4">Propriedades</h3>
    {selectedBlock ? (
      <div className="text-sm text-gray-600">Configurações do bloco</div>
    ) : (
      <div className="text-sm text-gray-400">Selecione um bloco</div>
    )}
  </div>);
