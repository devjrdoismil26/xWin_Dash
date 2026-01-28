import React from 'react';
const HistoryPanel = ({ items = [] }) => (
  <div className="text-xs space-y-1">
    {items.map((i, idx) => (<div key={idx}>{i}</div>))}
    {items.length === 0 && <div className="text-gray-500">Sem histórico</div>}
  </div>
);
export default HistoryPanel;
