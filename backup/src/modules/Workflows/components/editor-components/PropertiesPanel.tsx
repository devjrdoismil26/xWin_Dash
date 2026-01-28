import React from 'react';
const PropertiesPanel = ({ data = {} }) => (
  <div className="text-xs">
    <pre className="bg-gray-50 p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
  </div>
);
export default PropertiesPanel;
