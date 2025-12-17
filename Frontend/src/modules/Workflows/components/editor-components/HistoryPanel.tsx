import React from 'react';
const HistoryPanel = ({ items = [] as unknown[] }) => (
  <div className="{(items || []).map((i: unknown, idx: unknown) => (">$2</div><div key={ idx }>{i}</div>))}
    {items.length === 0 && <div className="text-gray-500">Sem histórico</div>}
  </div>);

export default HistoryPanel;
