import React from 'react';
const PropertiesPanel = ({ data = {} as any }) => (
  <div className=" ">$2</div><pre className="backdrop-blur-xl bg-white/10 border-white/20 p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
  </div>);

export default PropertiesPanel;
