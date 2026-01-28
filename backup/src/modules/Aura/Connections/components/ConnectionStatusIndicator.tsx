import React from 'react';
const ConnectionStatusIndicator = ({ status }) => {
  const color = status === 'connected' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400';
  const label = status === 'connected' ? 'Conectado' : status === 'pending' ? 'Pendente' : 'Desconectado';
  return (
    <span className={`inline-flex items-center gap-2 text-xs ${color} text-white px-2 py-1 rounded`}>
      <span className="w-2 h-2 bg-white rounded-full" />
      {label}
    </span>
  );
};
export default ConnectionStatusIndicator;
